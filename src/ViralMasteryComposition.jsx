import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, OffthreadVideo, Audio, staticFile, spring, useVideoConfig } from 'remotion';

export const loadFont = () => {
    if (typeof document !== 'undefined') {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}
loadFont();

const NeonWord = ({ wordObj, syncShiftFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Anticipation Sync: exactly 66ms (2 frames early) native mapped 
  const shiftedFrame = frame - syncShiftFrames; 
  const isActive = shiftedFrame >= wordObj.startFrame && shiftedFrame < wordObj.endFrame;
  const passed = shiftedFrame >= wordObj.endFrame;
  
  const scale = isActive ? spring({ frame: shiftedFrame - wordObj.startFrame, fps, config: { damping: 12, mass: 0.5 } }) : 1;
  const glow = isActive ? 'drop-shadow(0 0 25px #00FFFF)' : 'none';

  return (
    <span
      style={{
        display: 'block', 
        margin: '5px 0',
        opacity: isActive || passed ? 1 : 0.4,
        transform: `scale(${isActive ? 1 + (scale * 0.15) : 1})`,
        color: isActive ? '#00FFFF' : '#ffffff', 
        filter: glow,
        transition: 'color 0.1s ease',
      }}
    >
      {wordObj.text}
    </span>
  );
};

const KineticKaraoke = ({ timestamps, syncShiftFrames }) => {
  const frame = useCurrentFrame();
  const shiftedFrame = frame - syncShiftFrames;
  
  const activeIndex = timestamps.findIndex(t => shiftedFrame >= t.startFrame && shiftedFrame < t.endFrame);
  
  const batchIndex = Math.floor(Math.max(0, activeIndex) / 3);
  const currentBatch = timestamps.slice(batchIndex * 3, batchIndex * 3 + 3);

  // The UI Safe Zone: Hardcode boundary. Zero text in bottom 30% or right-most 15%.
  // Natively bounded strictly pushing the absolute limits center-offset.
  return (
    <AbsoluteFill style={{ 
      top: '20%', bottom: '30%', left: '10%', right: '15%', 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' 
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        fontSize: 90, fontFamily: '"Montserrat", sans-serif', fontWeight: 900,
        textTransform: 'uppercase', lineHeight: 1.1, textAlign: 'center'
      }}>
        {currentBatch.map((t) => <NeonWord key={t.startFrame} wordObj={t} syncShiftFrames={syncShiftFrames} />)}
      </div>
    </AbsoluteFill>
  );
};

const ClipRenderer = ({ clip, duration, currentBaseFrame }) => {
  const frame = useCurrentFrame();
  
  // Continuous Ken Burns tracking dynamically applied per clip regardless of duration maintaining movement!
  const kenBurns = interpolate(frame, [0, Math.max(1, duration)], [1.0, 1.15]);

  return (
     <AbsoluteFill style={{ transform: `scale(${kenBurns})`, transition: 'transform 0.05s linear' }}>
       <AbsoluteFill>
         {clip.url ? (
            <OffthreadVideo src={clip.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
         ) : (
            <AbsoluteFill style={{ background: 'linear-gradient(45deg, #111, #333)' }} />
         )}
       </AbsoluteFill>
       <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
    </AbsoluteFill>
  );
};

export const ViralMasteryComposition = ({ clipTimings, timestamps, voiceoverFile, bgMusicFile, syncShiftMs }) => {
  const syncShiftFrames = Math.round(((syncShiftMs || -66) / 1000) * 30); // Exactly -66ms

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1. Voiceover (Deep Male Voice SSML) */}
      {voiceoverFile && <Audio src={staticFile(`audio/${voiceoverFile}`)} volume={1} />}

      {/* 2. Visuals Layer */}
      {clipTimings?.map((clipObj, i) => (
          <Sequence key={`clip-${i}`} from={clipObj.startFrame} durationInFrames={clipObj.duration}>
            <ClipRenderer clip={clipObj.clip} duration={clipObj.duration} currentBaseFrame={clipObj.startFrame} />
            
            {/* The Creator Soundscape: BGM Swells explicitly on transitions (first 1.5s = 45 frames) to -10dB (0.3), else -25dB (0.056) */}
            {bgMusicFile && (
                <Sequence from={0} durationInFrames={Math.min(45, clipObj.duration)}>
                    <Audio src={staticFile(`audio/${bgMusicFile}`)} volume={0.3} loop />
                </Sequence>
            )}
            {bgMusicFile && clipObj.duration > 45 && (
                <Sequence from={45} durationInFrames={clipObj.duration - 45}>
                    <Audio src={staticFile(`audio/${bgMusicFile}`)} volume={0.056} loop />
                </Sequence>
            )}
          </Sequence>
      ))}

      {/* 3. The Creator Soundscape: SFX Matrix explicitly layering */}
      {clipTimings?.map((c, i) => (
          <Sequence key={`whoosh-${i}`} from={c.startFrame} durationInFrames={30}>
             <Audio src={staticFile('audio/whoosh.wav')} volume={0.4} playbackRate={2.0} />
          </Sequence>
      ))}
      {timestamps?.map((t, i) => (
          <Sequence key={`pop-${i}`} from={t.startFrame} durationInFrames={15}>
             <Audio src={staticFile('audio/pop.wav')} volume={0.15} />
          </Sequence>
      ))}

      {/* 4. Safe Mode Captions strictly bounded */}
      {timestamps && <KineticKaraoke timestamps={timestamps} syncShiftFrames={syncShiftFrames} />}
    </AbsoluteFill>
  );
};
