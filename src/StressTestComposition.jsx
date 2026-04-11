import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, OffthreadVideo, Audio, staticFile } from 'remotion';

const NeonWord = ({ word, index, totalWords, duration, syncShiftFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Absolute frame compensation for playback latencies!
  const shiftedFrame = frame - syncShiftFrames; 
  const framesPerWord = duration / totalWords;
  const startFrame = index * framesPerWord;
  const endFrame = startFrame + framesPerWord;
  const isActive = shiftedFrame >= startFrame && shiftedFrame < endFrame;
  const passed = shiftedFrame >= endFrame;
  
  // Spring Bounce Animation (bouncy config mapping mass and dampening)
  const scale = spring({ frame: shiftedFrame - startFrame, fps, config: { damping: 5, stiffness: 250, mass: 1 } });
  
  return (
    <span
      style={{
        display: 'inline-block',
        margin: '0 12px',
        opacity: isActive || passed ? 1 : 0.6,
        transform: `scale(${isActive ? 1 + (scale * 0.2) : 1})`,
        // Electric Blue #00FFFF mapping
        color: isActive ? '#00FFFF' : '#ffffff', 
        textShadow: isActive ? '0 0 15px #00FFFF, 0 0 30px #00FFFF' : '0 0 10px rgba(0,0,0,0.8)',
        transition: 'color 0.1s ease, text-shadow 0.1s ease',
      }}
    >
      {word}
    </span>
  );
};

const KineticKaraoke = ({ text, duration, syncShiftFrames }) => {
  const words = text.split(' ');
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
      fontSize: 70, fontWeight: 'bold', fontFamily: 'Inter, Montserrat, sans-serif',
      textTransform: 'uppercase', lineHeight: 1.3, textAlign: 'center'
    }}>
      {words.map((w, i) => <NeonWord key={i} word={w} index={i} totalWords={words.length} duration={duration} syncShiftFrames={syncShiftFrames} />)}
    </div>
  );
};

const ClipRenderer = ({ clip }) => {
  return (
     <AbsoluteFill>
       <AbsoluteFill>
         {clip.video && clip.video.url ? (
            <OffthreadVideo src={clip.video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
         ) : (
            <AbsoluteFill style={{ background: 'linear-gradient(45deg, #111, #333)' }} />
         )}
       </AbsoluteFill>
       <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />

       <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 80px' }}>
         {clip.type === 'agent' && (
           <div style={{ fontSize: 50, color: '#00FFFF', marginBottom: 30, textAlign: 'center', fontFamily: 'Inter', fontWeight: 900, textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)', padding: '10px 30px', borderRadius: 15 }}>
             {clip.name}
           </div>
         )}
       </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const StressTestComposition = ({ clips, voiceoverFile, bgMusicFile, watermark, syncShiftMs }) => {
  let currentFrame = 0;
  const playbackRate = 1.3; // High-stakes faster playback limit per instructions
  const syncShiftFrames = Math.round(((syncShiftMs || -150) / 1000) * 30);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {voiceoverFile && <Audio src={staticFile(`audio/${voiceoverFile}`)} volume={1} playbackRate={playbackRate} />}

      {clips?.map((clip, i) => {
        // Base lengths scaled strictly to 1.3x algorithm
        const duration = Math.round((clip.type === 'agent' ? 300 : 150) / playbackRate);
        const startOffset = currentFrame;
        currentFrame += duration;
        const isAgent = clip.type === 'agent';
        
        return (
          <Sequence key={i} from={startOffset} durationInFrames={duration}>
            <ClipRenderer clip={clip} />
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 80px' }}>
               <KineticKaraoke text={clip.text} duration={duration} syncShiftFrames={syncShiftFrames} />
            </AbsoluteFill>

            {/* Glitch / Stutter background music on Agents! Overrides Loop natively mapped. */}
            {bgMusicFile && isAgent && (
                <Sequence from={0} durationInFrames={3}>
                    <Audio src={staticFile(`audio/${bgMusicFile}`)} volume={1} playbackRate={2.0} />
                </Sequence>
            )}
            {bgMusicFile && isAgent && duration > 3 && (
                <Sequence from={3} durationInFrames={duration - 3}>
                    <Audio src={staticFile(`audio/${bgMusicFile}`)} volume={0.12} loop />
                </Sequence>
            )}
            {bgMusicFile && !isAgent && (
                <Sequence from={0} durationInFrames={duration}>
                    <Audio src={staticFile(`audio/${bgMusicFile}`)} volume={0.12} loop />
                </Sequence>
            )}
          </Sequence>
        );
      })}

      <AbsoluteFill style={{ justifyContent: 'flex-end', paddingBottom: 680, alignItems: 'center' }}>
        <span style={{ color: 'white', opacity: 0.3, fontSize: 36, fontFamily: 'Inter', fontWeight: 'bold' }}>
          {watermark}
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
