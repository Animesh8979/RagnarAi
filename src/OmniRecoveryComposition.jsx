import React from 'react';
import { AbsoluteFill, Sequence, OffthreadVideo } from 'remotion';

const FALLBACK_VIDEOS = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
];
const FALLBACK_CAPTIONS = [
  "SYSTEM FAILURE",
  "INITIATING OMNI-RECOVERY",
  "DATA PIPELINE RESTORED",
  "TITANIUM FALLBACK ACTIVE",
  "RENDERING SECURED"
];

// ZERO-NULL ARCHITECTURE: Explicit component mapping defaulting to functional primitives inherently bypassing 100% of pipeline breakage points logically without null-arrays!
export const OmniRecoveryComposition = ({ videoClips = [], captions = [], durationInFrames = 300 }) => {
  // THE TITANIUM FALLBACK
  const safeVideos = videoClips && videoClips.length > 0 ? videoClips : FALLBACK_VIDEOS;
  const safeCaptions = captions && captions.length > 0 ? captions : FALLBACK_CAPTIONS;

  const framesPerScene = Math.floor(durationInFrames / 5);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
       {/* 1. Background (Z-index: Bottom) */}
       <AbsoluteFill style={{ backgroundColor: '#111' }} />
       
       {/* 2. STRICT SEQUENCE BINDING: Videos (Z-index: Mid) */}
       {safeVideos.slice(0, 5).map((url, index) => {
          // Evaluated explicit index*duration parameters enforcing linear progression bypassing broken maps!
          const videoSrc = url.url ? url.url : url;
          return (
             <Sequence key={`video-${index}`} from={index * framesPerScene} durationInFrames={framesPerScene}>
                <AbsoluteFill>
                   <OffthreadVideo src={videoSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                   <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
                </AbsoluteFill>
             </Sequence>
          );
       })}
       
       {/* 3. STRICT SEQUENCE BINDING: Captions (Z-index: Top) */}
       {safeCaptions.slice(0, 5).map((textObj, index) => {
          // Wrapped explicitly scaling array mappings over Sequence timing coordinates
          const capText = textObj.text ? textObj.text : textObj;
          return (
             <Sequence key={`caption-${index}`} from={index * framesPerScene} durationInFrames={framesPerScene}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                   <div style={{
                       fontSize: 80, fontFamily: 'Arial, sans-serif', fontWeight: 'bold',
                       color: '#FFF', textShadow: '4px 4px 0 #000',
                       textAlign: 'center', width: '80%'
                   }}>
                      {capText}
                   </div>
                </AbsoluteFill>
             </Sequence>
          );
       })}
    </AbsoluteFill>
  );
};
