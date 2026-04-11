import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  OffthreadVideo,
} from 'remotion';

/* ─── Fallback Gradient (if video URL fails) ─────────────── */
const FallbackGradient = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    }}
  />
);

/* ─── Video Background with error fallback ────────────────── */
const VideoBackground = ({ videoUrl }) => {
  const [failed, setFailed] = React.useState(false);

  if (!videoUrl || failed) return <FallbackGradient />;

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={videoUrl}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => setFailed(true)}
        muted
      />
    </AbsoluteFill>
  );
};

/* ─── Word-by-word pop-in animation ───────────────────────── */
const AnimatedText = ({ text, fontSize = 64, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px 12px',
        maxWidth: '90%',
      }}
    >
      {words.map((word, i) => {
        const delay = startFrame + i * 4; // 4 frames between each word pop
        const s = spring({
          frame: frame - delay,
          fps,
          config: { damping: 12, stiffness: 200, mass: 0.5 },
        });

        const scale = interpolate(s, [0, 1], [0.3, 1]);
        const opacity = interpolate(s, [0, 1], [0, 1]);

        return (
          <span
            key={`${word}-${i}`}
            style={{
              fontSize,
              fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
              fontWeight: 800,
              color: 'white',
              textShadow: '0 2px 16px rgba(0,0,0,0.6)',
              transform: `scale(${scale})`,
              opacity,
              display: 'inline-block',
              lineHeight: 1.3,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/* ─── Main Composition ─────────────────────────────────────── */
export const UniversalShort = ({
  hook = 'Your hook here',
  value = 'Your value proposition goes here with extra detail',
  cta = 'Follow for more!',
  videoUrl = null,
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  // Divide timeline into 3 sections
  const sectionDuration = Math.floor(durationInFrames / 3);
  const hookStart = 0;
  const valueStart = sectionDuration;
  const ctaStart = sectionDuration * 2;

  return (
    <AbsoluteFill>
      {/* Layer 1: Background Video or Gradient */}
      <VideoBackground videoUrl={videoUrl} />

      {/* Layer 2: Semi-transparent dark overlay for readability */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />

      {/* Layer 3: Text in the "Safe Zone" (middle third) */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Hook Section */}
        <Sequence from={hookStart} durationInFrames={sectionDuration}>
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 40px',
            }}
          >
            <AnimatedText text={hook} fontSize={72} startFrame={6} />
          </AbsoluteFill>
        </Sequence>

        {/* Value Section */}
        <Sequence from={valueStart} durationInFrames={sectionDuration}>
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 40px',
            }}
          >
            <AnimatedText text={value} fontSize={56} startFrame={6} />
          </AbsoluteFill>
        </Sequence>

        {/* CTA Section */}
        <Sequence from={ctaStart} durationInFrames={sectionDuration}>
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 40px',
            }}
          >
            <AnimatedText text={cta} fontSize={68} startFrame={6} />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
