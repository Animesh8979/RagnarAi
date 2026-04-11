const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Default ElevenLabs Voice ID if missing (Callum - Deep male voice excellent for storytelling)
const DEFAULT_ELEVENLABS_VOICE_ID = 'N2lVS1w4EtoT3dr4eOWO'; 

async function generateElevenLabsAudio(text, outputPath, voiceId = null, recoveryLog = []) {
  const voiceIdToUse = process.env.ELEVENLABS_VOICE_ID || voiceId || DEFAULT_ELEVENLABS_VOICE_ID;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === 'DEMO') {
    recoveryLog.push('ElevenLabs API KEY missing or set to DEMO. Defaulting back through AI Fallback Chain.');
    throw new Error('Missing ELEVENLABS_API_KEY');
  }

  recoveryLog.push(`Calling ElevenLabs API for cinematic Voiceover: ${voiceIdToUse}`);
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceIdToUse}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
       let errorMsg = response.statusText;
       try {
           const errBody = await response.json();
           if (errBody && errBody.detail) errorMsg = errBody.detail.message || JSON.stringify(errBody.detail);
       } catch (e) {}
       throw new Error(`ElevenLabs API failed: ${response.status} ${errorMsg}`);
    }

    const buffer = await response.buffer();
    fs.writeFileSync(outputPath, buffer);
    recoveryLog.push(`ElevenLabs generated successfully at ${outputPath}`);
    
    return {
       source: `elevenlabs:${voiceIdToUse}`,
       path: outputPath
    };
  } catch (error) {
    recoveryLog.push(`ElevenLabs API threw error: ${error.message}`);
    throw error;
  }
}

module.exports = { generateElevenLabsAudio };
