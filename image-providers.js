/**
 * image-providers.js - AI image generation fallback chain
 *
 * Story mode uses these providers to create illustrated frames before stock.
 * The chain is intentionally conservative:
 * - disable outdated Gemini Imagen direct calls
 * - try current official Pollinations endpoints
 * - fall back to HF FLUX when credits are available
 */

require('dotenv').config();
const crypto = require('crypto');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const {GoogleGenerativeAI} = require('@google/generative-ai');

const IMAGE_TIMEOUT_MS = 60000;
const CACHE_DIR = path.join(__dirname, 'public', 'v12-cache');
const HF_SDXL_MODEL = process.env.HF_SDXL_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0';
const { generateStillFrame } = require('./comfyui-bridge');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function startsWithBytes(buffer, signature = []) {
  return Array.isArray(signature)
    && signature.length > 0
    && signature.every((value, index) => buffer[index] === value);
}

function bufferLooksLikeHtml(buffer) {
  if (!buffer || !buffer.length) return false;
  const head = buffer.slice(0, 64).toString('utf8').trim().toLowerCase();
  return head.startsWith('<!doctype html')
    || head.startsWith('<html')
    || head.startsWith('<?xml')
    || head.startsWith('<head')
    || head.startsWith('<body');
}

function detectImageExtension(buffer, contentType = '') {
  const normalizedType = String(contentType || '').toLowerCase();
  if (normalizedType.includes('image/png') || startsWithBytes(buffer, [0x89, 0x50, 0x4E, 0x47])) {
    return '.png';
  }
  if (
    normalizedType.includes('image/webp')
    || (startsWithBytes(buffer, [0x52, 0x49, 0x46, 0x46]) && buffer.slice(8, 12).toString('ascii') === 'WEBP')
  ) {
    return '.webp';
  }
  if (
    normalizedType.includes('image/jpeg')
    || normalizedType.includes('image/jpg')
    || startsWithBytes(buffer, [0xFF, 0xD8, 0xFF])
  ) {
    return '.jpg';
  }
  return null;
}

function assertValidImageBuffer(buffer, providerLabel, contentType = '') {
  if (!buffer || !buffer.length || buffer.length < 5000) {
    throw new Error(`${providerLabel} returned too-small image`);
  }
  if (bufferLooksLikeHtml(buffer) || /text\/html|application\/json|text\/plain/i.test(String(contentType || ''))) {
    throw new Error(`${providerLabel} returned non-image payload`);
  }
  const extension = detectImageExtension(buffer, contentType);
  if (!extension) {
    throw new Error(`${providerLabel} returned unsupported image format`);
  }
  return extension;
}

function buildPromptHash(prompt, options = {}) {
  return crypto
    .createHash('sha1')
    .update(`${options.seedHint || ''}|${options.storyMode ? 'story' : 'default'}|${prompt}`)
    .digest('hex')
    .slice(0, 8);
}

function deriveSeed(prompt, sceneIndex, options = {}) {
  // If we have a character lock, we want all scenes in the story to use the EXACT same seed
  // to maximize character visual consistency across different prompts.
  if (options.characterLock) {
    const storyHash = crypto.createHash('sha1').update(`${options.seedHint || 'story'}|${options.characterLock}`).digest('hex').slice(0, 8);
    return parseInt(storyHash, 16) % 2147483647;
  }
  const hash = buildPromptHash(prompt, options);
  return (parseInt(hash, 16) + sceneIndex) % 2147483647;
}

function buildCacheFileName(sceneIndex, providerSlug, prompt, extension, options = {}) {
  const hash = buildPromptHash(prompt, options);
  return `scene-${String(sceneIndex + 1).padStart(2, '0')}-${providerSlug}-${hash}${extension}`;
}

function getTargetDimensions(options = {}) {
  if (options.avatarMode) {
    return { width: 768, height: 1365 };
  }
  if (options.storyMode || options.visualIntent === 'hero_frame') {
    return { width: 832, height: 1472 };
  }
  return { width: 768, height: 1365 };
}

function buildImagePrompt(prompt, options = {}) {
  const scenePrompt = String(prompt || '').replace(/\s+/g, ' ').trim();
  if (options.avatarMode) {
    const roleLabel = options.storyMode
      ? 'Signature-owned fictional Hindi storyteller presenter for Ragnar.'
      : 'Signature-owned digital newsroom presenter for Ragnar.';
    const characterDesign = options.characterLock ? `Character design lock: ${options.characterLock}.` : '';
    return [
      'Vertical 9:16 photoreal presenter portrait for premium short-form video.',
      roleLabel,
      characterDesign,
      'Recurring channel anchor identity, preserve the same facial structure, hair, and grooming across episodes.',
      'Head-and-shoulders framing only, face fills most of the frame, direct eye contact, expressive but natural face, premium lighting.',
      'Clean dark background, no text, no letters, no logos, no clothing graphics, no watermark, no microphone, no desk clutter.',
      `Portrait brief: ${scenePrompt || 'Confident presenter portrait.'}`,
    ].filter(Boolean).join(' ');
  }

  if (options.visualIntent === 'hero_frame') {
    return [
      'Vertical 9:16 cinematic editorial hero frame for a premium short-form video.',
      'Photoreal, dramatic but believable lighting, premium color grading, strong focal subject, depth separation, no text, no watermark, no collage, no extra faces.',
      options.characterLock ? `Character design lock: ${options.characterLock}.` : '',
      `Hero frame brief: ${scenePrompt || 'A premium attention-grabbing vertical hero frame.'}`,
    ].filter(Boolean).join(' ');
  }

  if (options.storyMode) {
    const moodLabel = options.mood === 'story_calm' ? 'calm cinematic suspense, melancholy warmth, premium OTT drama' : 'high-stakes cinematic suspense, premium OTT thriller';
    const seriesLabel = options.seriesTitle ? `Series title: ${options.seriesTitle}.` : 'Fictional Hindi short story.';
    const characterDesign = options.characterLock ? `PROTAGONIST DESIGN: ${options.characterLock}.` : '';
    return [
      'Vertical 9:16 cinematic photoreal frame for a fictional short-form suspense story.',
      'Feels like a premium OTT thriller still, not stock footage, concept art, anime, cartoon art, 3D render, or generic AI slop.',
      seriesLabel,
      `Mood: ${moodLabel}.`,
      characterDesign,
      'Keep one coherent protagonist design, one clear focal subject, layered foreground and background depth, realistic textures, expressive face, dramatic but believable lighting, cinematic lens compression, and a clean silhouette.',
      'No text, no logo, no watermark, no frame, no collage, no duplicate face, no extra fingers, no deformed hands, no low-detail background, no plastic skin.',
      `Scene: ${scenePrompt || 'A suspenseful cinematic story moment.'}`,
    ].filter(Boolean).join(' ');
  }

  return `Cinematic vertical 9:16 photograph, ${scenePrompt}, dramatic editorial lighting, shallow depth of field, photojournalistic style, 4K quality, film grain, no text, no watermark`;
}

async function generateGeminiImagen() {
  throw new Error('Imagen 3 is Vertex AI-only in the current official docs; direct Gemini API key flow is disabled here');
}

function getPollinationsAuthQuery() {
  const apiKey = process.env.POLLINATIONS_API_KEY;
  return apiKey ? `?key=${encodeURIComponent(apiKey)}` : '';
}

async function fetchPollinationsImage(url, sceneIndex, providerSlug, providerLabel, requestPrompt, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`${providerLabel} HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const buffer = await response.buffer();
    const extension = assertValidImageBuffer(buffer, providerLabel, contentType);

    ensureDir(CACHE_DIR);
    const fileName = buildCacheFileName(sceneIndex, providerSlug, requestPrompt, extension, options);
    const filePath = path.join(CACHE_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    return { src: `v12-cache/${fileName}`, provider: providerLabel };
  } finally {
    clearTimeout(timer);
  }
}

async function generatePollinationsUnified(prompt, sceneIndex, options = {}) {
  const requestPrompt = buildImagePrompt(prompt, options);
  const encoded = encodeURIComponent(requestPrompt);
  const url = `https://gen.pollinations.ai/image/${encoded}${getPollinationsAuthQuery()}`;
  return fetchPollinationsImage(url, sceneIndex, 'pollinations-unified', 'Pollinations Unified API', requestPrompt, options);
}

async function generatePollinationsOpen(prompt, sceneIndex, options = {}) {
  const requestPrompt = buildImagePrompt(prompt, options);
  const encoded = encodeURIComponent(requestPrompt);
  const authQuery = getPollinationsAuthQuery();
  const separator = authQuery ? '&' : '?';
  const url = `https://pollinations.ai/p/${encoded}${authQuery}${separator}seed=${deriveSeed(requestPrompt, sceneIndex, options)}`;
  return fetchPollinationsImage(url, sceneIndex, 'pollinations-open', 'Pollinations Open Image', requestPrompt, options);
}

async function generateHFFlux(prompt, sceneIndex, options = {}) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HUGGINGFACE_API_KEY not set');
  const requestPrompt = buildImagePrompt(prompt, options);
  const { width, height } = getTargetDimensions(options);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);

  try {
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: requestPrompt,
          parameters: { width, height },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`HF FLUX HTTP ${response.status}: ${errText.slice(0, 150)}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const buffer = await response.buffer();
    const extension = assertValidImageBuffer(buffer, 'HF FLUX', contentType);

    ensureDir(CACHE_DIR);
    const fileName = buildCacheFileName(sceneIndex, 'hf-flux', requestPrompt, extension, options);
    const filePath = path.join(CACHE_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    return { src: `v12-cache/${fileName}`, provider: 'HF FLUX.1-schnell' };
  } finally {
    clearTimeout(timer);
  }
}

async function generateHFSDXL(prompt, sceneIndex, options = {}) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HUGGINGFACE_API_KEY not set');
  const requestPrompt = buildImagePrompt(prompt, options);
  const { width, height } = getTargetDimensions(options);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://router.huggingface.co/hf-inference/models/${HF_SDXL_MODEL}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: requestPrompt,
          parameters: {
            width,
            height,
            guidance_scale: options.avatarMode ? 6.5 : 7.5,
            num_inference_steps: options.storyMode ? 28 : 24,
            negative_prompt: DEFAULT_NEGATIVE_PROMPT,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`HF SDXL HTTP ${response.status}: ${errText.slice(0, 150)}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const buffer = await response.buffer();
    const extension = assertValidImageBuffer(buffer, 'HF SDXL', contentType);

    ensureDir(CACHE_DIR);
    const fileName = buildCacheFileName(sceneIndex, 'hf-sdxl', requestPrompt, extension, options);
    fs.writeFileSync(path.join(CACHE_DIR, fileName), buffer);

    return { src: `v12-cache/${fileName}`, provider: 'HF SDXL' };
  } finally {
    clearTimeout(timer);
  }
}

// ComfyUI local wrapper â€” adapts generateStoryFrame to the provider interface
async function generateComfyUILocal(prompt, sceneIndex, options = {}) {
  if (!options.storyMode && !options.avatarMode && options.visualIntent !== 'hero_frame') return null;
  const comfyuiBridge = require('./comfyui-bridge');
  const comfyuiReady = await comfyuiBridge.isComfyUIRunning();
  if (!comfyuiReady) {
    return { permanentSkipReason: 'local ComfyUI is not running in this session' };
  }
  const seed = deriveSeed(prompt, sceneIndex, options);
  const result = await generateStillFrame(prompt, seed, sceneIndex, {
    seriesTitle: options.seriesTitle,
    storyPart: options.storyPart,
    mood: options.mood,
    avatarMode: Boolean(options.avatarMode),
    characterLock: options.characterLock || null,
  });
  return result || { softSkipReason: 'ComfyUI returned no frame' };
}

const IMAGE_PROVIDERS = [
  { label: 'ComfyUI Local Still', fn: generateComfyUILocal },
  {
    label: 'Gemini Imagen 3',
    fn: generateGeminiImagen,
    disabledReason: 'Imagen 3 direct API path is disabled here; Vertex AI-only flow is not wired into this pipeline.',
  },
  { label: 'HF SDXL', fn: generateHFSDXL },
  { label: 'HF FLUX.1-schnell', fn: generateHFFlux },
  { label: 'Pollinations Open Image', fn: generatePollinationsOpen },
  { label: 'Pollinations Unified API', fn: generatePollinationsUnified },
];

function isPermanentProviderFailure(message) {
  const normalized = String(message || '').toLowerCase();
  return normalized.includes('vertex ai-only') ||
    normalized.includes('disabled here') ||
    normalized.includes('http 401') ||
    normalized.includes('http 402') ||
    normalized.includes('depleted your monthly included credits') ||
    normalized.includes('maximum redirect reached') ||
    normalized.includes('returned too-small image');
}

function getProviderRunOrder(options = {}) {
  const priority = {
    'ComfyUI Local Still': 0,
    'HF SDXL': 1,
    'HF FLUX.1-schnell': 2,
    'Pollinations Open Image': 3,
    'Pollinations Unified API': 4,
    'Gemini Imagen 3': 5,
  };

  return [...IMAGE_PROVIDERS].sort((left, right) => {
    const leftPriority = Object.prototype.hasOwnProperty.call(priority, left.label) ? priority[left.label] : 99;
    const rightPriority = Object.prototype.hasOwnProperty.call(priority, right.label) ? priority[right.label] : 99;
    return leftPriority - rightPriority;
  });
}

async function generateAIImage(prompt, sceneIndex, recoveryLog = [], options = {}) {
  const providerHealth = options.providerHealth || null;

  for (const provider of getProviderRunOrder(options)) {
    if (options.localOnly && provider.label !== 'ComfyUI Local Still') {
      continue;
    }

    if (provider.disabledReason) {
      if (providerHealth) {
        providerHealth[provider.label] = { permanent: true, reason: provider.disabledReason };
      }
      recoveryLog.push(`Scene ${sceneIndex + 1}: ${provider.label} skipped - ${provider.disabledReason}`);
      continue;
    }

    const cachedState = providerHealth && providerHealth[provider.label];
    if (cachedState && cachedState.permanent) {
      recoveryLog.push(`Scene ${sceneIndex + 1}: ${provider.label} skipped - ${cachedState.reason}`);
      continue;
    }

    try {
      console.log(`      Trying ${provider.label}...`);
      const result = await provider.fn(prompt, sceneIndex, options);
      if (result && result.permanentSkipReason) {
        if (providerHealth) {
          providerHealth[provider.label] = { permanent: true, reason: result.permanentSkipReason };
        }
        recoveryLog.push(`Scene ${sceneIndex + 1}: ${provider.label} skipped - ${result.permanentSkipReason}`);
        continue;
      }
      if (result && result.softSkipReason) {
        if (providerHealth && provider.label === 'ComfyUI Local Still' && /server is not responding|returned no frame|could not be downloaded|completed without/i.test(result.softSkipReason)) {
          providerHealth[provider.label] = { permanent: true, reason: result.softSkipReason };
        }
        recoveryLog.push(`Scene ${sceneIndex + 1}: ${provider.label} skipped - ${result.softSkipReason}`);
        continue;
      }
      if (!result || !result.src) {
        recoveryLog.push(`Scene ${sceneIndex + 1}: ${provider.label} returned no asset, continuing fallback chain.`);
        continue;
      }
      
      // V17 AI Vision Judge Filter  
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
          const imagePath = path.join(__dirname, 'public', result.src);
          const imageData = fs.readFileSync(imagePath).toString('base64');
          const imageMimeType = /\.png$/i.test(imagePath) ? 'image/png' : /\.webp$/i.test(imagePath) ? 'image/webp' : 'image/jpeg';
          const prompt = "Act as a strict photo editor. Does this image have severely deformed hands, horrible text/watermarks, or chaotic mesh artifacts? If YES return REJECT. Else return ACCEPT. Be decisive.";
          
          const aiResponse = await model.generateContent([
            prompt, 
            { inlineData: { data: imageData, mimeType: imageMimeType } }
          ]);
          
          const textRes = aiResponse.response.text();
          if (textRes.includes('REJECT')) {
              recoveryLog.push(`Scene ${sceneIndex + 1}: AI Judge REJECTED image from ${provider.label} due to deformities.`);
              continue; // Reject and try the next provider
          }
        } catch (visionErr) {
            recoveryLog.push(`Scene ${sceneIndex + 1}: AI Judge Vision check failed (${visionErr.message}), allowing image.`);
        }
      }

      console.log(`      Success: ${provider.label}`);
      recoveryLog.push(`Scene ${sceneIndex + 1}: AI Image from ${provider.label}.`);
      return result;
    } catch (error) {
      const msg = String(error && error.message ? error.message : error).slice(0, 120);
      if (providerHealth && isPermanentProviderFailure(msg)) {
        providerHealth[provider.label] = { permanent: true, reason: msg };
      }
      recoveryLog.push(`Scene ${sceneIndex + 1}: ${provider.label} failed - ${msg}`);
    }
  }

  return null;
}

module.exports = { generateAIImage, IMAGE_PROVIDERS };

