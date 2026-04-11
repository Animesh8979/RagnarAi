const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function generateFishAudio(text, outputPath, voiceId = 'YOUR_MALE_HINDI_VOICE_ID', recoveryLog = []) {
  const voiceIdToUse = process.env.FISH_HINDI_MALE_VOICE_ID || voiceId;

  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey || apiKey === 'DEMO') {
    recoveryLog.push('Fish Audio API KEY missing or set to DEMO. Defaulting back to Edge TTS.');
    throw new Error('Missing FISH_AUDIO_API_KEY');
  }

  recoveryLog.push(`Calling Fish Audio API for cinematic Voiceover: ${voiceId}`);
  
  try {
    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        reference_id: voiceIdToUse !== 'YOUR_MALE_HINDI_VOICE_ID' ? voiceIdToUse : undefined,
        format: 'mp3'
      })
    });

    if (!response.ok) {
       throw new Error(`Fish Audio API failed: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.buffer();
    fs.writeFileSync(outputPath, buffer);
    recoveryLog.push(`Fish Audio generated successfully at ${outputPath}`);
    
    return {
       source: `fish-audio:${voiceId}`,
       path: outputPath
    };
  } catch (error) {
    recoveryLog.push(`Fish Audio API threw error: ${error.message}`);
    throw error;
  }
}

module.exports = { generateFishAudio };
