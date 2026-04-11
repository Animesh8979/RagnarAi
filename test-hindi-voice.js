const { executeV15Factory } = require('./v15-factory');

async function test() {
  const testPayload = {
    language: 'hi',
    contentType: 'story',
    scenes: [
      {
        sentenceHindi: 'यह एक परीक्षण कहानी है। क्या आप मुझे सुन सकते हैं?',
        sentence: 'This is a test story. Can you hear me?'
      }
    ],
    scriptText: 'This is a test script.'
  };

  console.log('Starting Hindi Voiceover Smoke Test...');
  try {
    const result = await executeV15Factory({
      topic: 'Hindi Voice Test',
      inputPayload: testPayload,
      dryRun: true
    });
    console.log('Smoke Test Finished.');
    console.log('Voice Source:', result.qualityReport.voiceover.source);
  } catch (error) {
    console.error('Smoke Test Failed:', error);
  }
}

test();
