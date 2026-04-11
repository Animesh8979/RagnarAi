import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  OffthreadVideo,
  Audio,
  staticFile,
} from 'remotion';

/* ════════════════════════════════════════════
   FALLBACK GRADIENT (Cinematic Dark)
   ════════════════════════════════════════════ */
const CinematicGradient = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slowly shifting gradient angle for visual interest
  const angle = interpolate(frame, [0, fps * 15], [135, 200], {
    extrapolateRight: 'clamp',
  });

  // Ken Burns–style slow zoom
  const scale = interpolate(frame, [0, fps * 15], [1.0, 1.2], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, #0a0a2e 0%, #1a0533 25%, #0d1b2a 50%, #1b2838 75%, #0a0a2e 100%)`,
        transform: `scale(${scale})`,
      }}
    />
  );
};

/* ════════════════════════════════════════════
   VIDEO BACKGROUND with error fallback
   ════════════════════════════════════════════ */
const VideoBackground = ({ videoUrl }) => {
  const [failed, setFailed] = React.useState(false);

  if (!videoUrl || failed) return <CinematicGradient />;

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

/* ════════════════════════════════════════════
   NEON GLOW TEXT — Karaoke-style pop
   ════════════════════════════════════════════ */
const NeonWord = ({ word, delay, fontSize, fps, frame }) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 280, mass: 0.4 },
  });

  const scale = interpolate(s, [0, 1], [0.0, 1.0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  // Neon glow fades in with the word
  const glowIntensity = interpolate(s, [0, 1], [0, 20]);

  return (
    <span
      style={{
        fontSize,
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        fontWeight: 900,
        color: '#ffffff',
        textShadow: `
          0 0 ${glowIntensity * 0.5}px #ffffff,
          0 0 ${glowIntensity}px #ffffff,
          0 0 ${glowIntensity * 2}px #a78bfa,
          0 0 ${glowIntensity * 3}px #7c3aed
        `,
        transform: `scale(${scale})`,
        opacity,
        display: 'inline-block',
        lineHeight: 1.4,
        letterSpacing: '-0.02em',
      }}
    >
      {word}
    </span>
  );
};

/* ════════════════════════════════════════════
   ANIMATED TEXT LINE (word-by-word karaoke)
   ════════════════════════════════════════════ */
const KaraokeText = ({ text, fontSize = 64, startDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '6px 14px',
        maxWidth: '85%',
        padding: '0 10px',
      }}
    >
      {words.map((word, i) => (
        <NeonWord
          key={`${word}-${i}`}
          word={word}
          delay={startDelay + i * 3}
          fontSize={fontSize}
          fps={fps}
          frame={frame}
        />
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════
   POINT CARD (for list items)
   ════════════════════════════════════════════ */
const PointCard = ({ text, index, fontSize = 48 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  const translateY = interpolate(slideIn, [0, 1], [60, 0]);
  const opacity = interpolate(slideIn, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transform: `translateY(${translateY}px)`,
        opacity,
        maxWidth: '85%',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 900,
          color: 'white',
          flexShrink: 0,
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
        }}
      >
        {index}
      </div>
      <KaraokeText text={text} fontSize={fontSize} startDelay={12} />
    </div>
  );
};

/* ════════════════════════════════════════════
   WATERMARK
   ════════════════════════════════════════════ */
const Watermark = ({ handle }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 160,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 28,
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      fontWeight: 700,
      color: 'rgba(255, 255, 255, 0.30)',
      letterSpacing: '0.05em',
      pointerEvents: 'none',
    }}
  >
    {handle}
  </div>
);

/* ════════════════════════════════════════════
   AUDIO LAYER — Voiceover + Background Music
   ════════════════════════════════════════════ */
const AudioLayer = ({ voiceoverFile, bgMusicFile }) => {
  return (
    <>
      {/* Voiceover narration — full volume, synced to content */}
      {voiceoverFile && (
        <Sequence from={0}>
          <Audio
            src={staticFile(`audio/${voiceoverFile}`)}
            volume={1.0}
            startFrom={0}
          />
        </Sequence>
      )}

      {/* Background music — low volume, ducked under voice */}
      {bgMusicFile && (
        <Sequence from={0}>
          <Audio
            src={staticFile(`audio/${bgMusicFile}`)}
            volume={0.12}
            loop
          />
        </Sequence>
      )}
    </>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPOSITION — KaraokeShort
   ════════════════════════════════════════════ */
export const KaraokeShort = ({
  hook = 'This changes everything',
  points = [
    'First key insight here',
    'Second important point',
    'Third crucial detail',
    'Fourth game changer',
    'Fifth mind blowing fact',
  ],
  cta = 'Follow for more!',
  videoUrl = null,
  watermark = '@AIFactoryBot',
  lang = 'en',
  voiceoverFile = null,
  bgMusicFile = null,
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  // Timeline layout (15 seconds = 450 frames @ 30fps)
  // Hook:   0–90   (3 seconds)
  // Points: 90–390 (10 seconds, 2 sec each = 60 frames each)
  // CTA:    390–450 (2 seconds)
  const hookDuration = 90;
  const pointDuration = 60;
  const ctaStart = hookDuration + points.length * pointDuration;
  const ctaDuration = durationInFrames - ctaStart;

  return (
    <AbsoluteFill>
      {/* Layer 1: Background */}
      <VideoBackground videoUrl={videoUrl} />

      {/* Layer 2: Dark overlay for text readability */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }} />

      {/* Layer 3: Vignette edges */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Layer 4: Audio — Voiceover + Background Music */}
      <AudioLayer voiceoverFile={voiceoverFile} bgMusicFile={bgMusicFile} />

      {/* Layer 5: Content — Safe Zone (middle third) */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>

        {/* HOOK */}
        <Sequence from={0} durationInFrames={hookDuration}>
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 50px',
            }}
          >
            <KaraokeText text={hook} fontSize={78} startDelay={6} />
          </AbsoluteFill>
        </Sequence>

        {/* POINTS — one by one */}
        {points.map((point, i) => (
          <Sequence
            key={i}
            from={hookDuration + i * pointDuration}
            durationInFrames={pointDuration}
          >
            <AbsoluteFill
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 50px',
              }}
            >
              <PointCard text={point} index={i + 1} fontSize={46} />
            </AbsoluteFill>
          </Sequence>
        ))}

        {/* CTA */}
        <Sequence from={ctaStart} durationInFrames={ctaDuration}>
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 50px',
            }}
          >
            <KaraokeText text={cta} fontSize={72} startDelay={6} />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>

      {/* Layer 6: Watermark in safe zone */}
      <Watermark handle={watermark} />
    </AbsoluteFill>
  );
};
