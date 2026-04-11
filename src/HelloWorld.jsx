import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const HelloWorld = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, fps * 0.3], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 80,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            margin: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          Hello World
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 32,
            fontFamily: 'Arial, sans-serif',
            marginTop: 20,
          }}
        >
          Remotion is ready 🎬
        </p>
      </div>
    </AbsoluteFill>
  );
};
