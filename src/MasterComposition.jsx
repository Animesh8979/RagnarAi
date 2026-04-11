import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, OffthreadVideo, Audio, staticFile, spring, useVideoConfig } from 'remotion';

// TITANIUM FALLBACK CONSTANT
const FALLBACK_VIDEOS = [
  "https://videos.pexels.com/video-files/4142890/4142890-hd_1280_720_30fps.mp4",
  "https://videos.pexels.com/video-files/4835084/4835084-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/33932067/14399121_640_360_30fps.mp4",
  "https://videos.pexels.com/video-files/30289537/12984428_640_360_100fps.mp4",
  "https://videos.pexels.com/video-files/8123991/8123991-hd_720_1280_30fps.mp4"
];

export const loadFont = () => {
    if (typeof document !== 'undefined') {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Impact&family=Montserrat:wght@900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}
loadFont();

const NeonWord = ({ wordObj, syncShiftFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shiftedFrame = frame - syncShiftFrames; 
  const isActive = shiftedFrame >= wordObj.startFrame && shiftedFrame < wordObj.endFrame;
  const passed = shiftedFrame >= wordObj.endFrame;
  
  const scale = isActive ? spring({ frame: shiftedFrame - wordObj.startFrame, fps, config: { damping: 12, mass: 0.5 } }) : 1;

  // Yellow #FFFF00 active. Base White. Heavy #000 Text Shadow. Uppercase.
  return (
    <span
      style={{
        display: 'inline-block', 
        opacity: isActive || passed ? 1 : 0.4,
        transform: `scale(${isActive ? 1 + (scale * 0.15) : 1})`,
        color: isActive ? '#FFFF00' : '#ffffff', 
        textShadow: '8px 8px 15px #000000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
        marginRight: 10,
        marginBottom: 10,
        transition: 'color 0.1s ease',
      }}
    >
      {wordObj.text}&nbsp;
    </span>
  );
};

const KineticKaraoke = ({ timestamps, syncShiftFrames }) => {
  const frame = useCurrentFrame();
  const shiftedFrame = frame - syncShiftFrames;
  
  const activeIndex = timestamps.findIndex(t => shiftedFrame >= t.startFrame && shiftedFrame < t.endFrame);
  
  const batchIndex = Math.floor(Math.max(0, activeIndex) / 3);
  const currentBatch = timestamps.slice(batchIndex * 3, batchIndex * 3 + 3);

  // Safe Zones: Middle 50%. Bottom 30% empty, Right 15% empty.
  // 100% - 30% (bottom) - x% (top) = 50% => top 20%. Let's use 25% top and 25% bottom to center it truly but user explicitly asked bottom 30%.
  // So Top 20%, Left 5%, Right 15%, Bottom 30%.
  return (
    <AbsoluteFill style={{ 
      top: '20%', bottom: '30%', left: '5%', right: '15%', 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' 
    }}>
      <div style={{
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
        fontSize: 80, fontFamily: '"Montserrat", "Impact", sans-serif',
        textTransform: 'uppercase', lineHeight: 1.2, textAlign: 'center'
      }}>
        {currentBatch.map((t) => <NeonWord key={t.startFrame} wordObj={t} syncShiftFrames={syncShiftFrames} />)}
      </div>
    </AbsoluteFill>
  );
};

const ClipRenderer = ({ clip, duration }) => {
  const frame = useCurrentFrame();
  
  // Motion: apply continuous scale(1.1) Ken Burns
  const kenBurns = interpolate(frame, [0, Math.max(1, duration)], [1.0, 1.1]);

  return (
     <AbsoluteFill style={{ transform: `scale(${kenBurns})` }}>
       <AbsoluteFill>
          <OffthreadVideo src={clip} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
       </AbsoluteFill>
       <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />
    </AbsoluteFill>
  );
};

export const MasterComposition = ({ videoClips, timestamps, durationInFrames, voiceoverFile }) => {
  
  // THE TITANIUM FALLBACK
  const safeClips = (videoClips && videoClips.length > 0) ? videoClips : FALLBACK_VIDEOS;
  
  // Pacing Logic exactly forcing 45 to 60 frames natively mapping Sequence implicitly!
  const clipChunks = [];
  let currentFrame = 0;
  let idx = 0;
  while(currentFrame < durationInFrames) {
      // Strictly 45 to 60 frames (1.5 to 2.0s) map bound natively
      let dur = Math.floor(Math.random() * (60 - 45 + 1)) + 45;
      if (currentFrame + dur > durationInFrames) {
          dur = durationInFrames - currentFrame; // Last chunk clamps
      }
      clipChunks.push({ start: currentFrame, duration: dur, src: safeClips[idx % safeClips.length] });
      currentFrame += dur;
      idx++;
  }

  // Anticipation frame logic strictly bounded (-66ms)
  const syncShiftFrames = Math.round((-66 / 1000) * 30); 

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      
      <AbsoluteFill style={{ backgroundColor: '#111' }} />

      <Audio src={staticFile('audio/lofi-tech.mp3')} volume={0.15} loop />
      {voiceoverFile && <Audio src={staticFile(`audio/${voiceoverFile}`)} volume={1} />}

      {/* Z-Index: Sequences for Videos */}
      {clipChunks.map((c, i) => (
          <Sequence key={`clip-${i}`} from={c.start} durationInFrames={c.duration}>
            <ClipRenderer clip={c.src.url || c.src} duration={c.duration} />
          </Sequence>
      ))}

      {/* Z-Index: Sequence Wrapper explicitly over Captions. */}
      {timestamps && timestamps.length > 0 && (
          <Sequence from={0} durationInFrames={Math.max(1, durationInFrames)}>
             <KineticKaraoke timestamps={timestamps} syncShiftFrames={syncShiftFrames} />
          </Sequence>
      )}
    </AbsoluteFill>
  );
};
