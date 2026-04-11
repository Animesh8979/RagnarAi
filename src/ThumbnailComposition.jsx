import React from 'react';
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame } from 'remotion';

/**
 * Phase 5A: Remotion-Based Thumbnail Composition
 *
 * 4 template variants:
 *   1. breaking — red gradient bg + white bold text + subject
 *   2. reveal  — dark bg + gold text + subject + red arrow
 *   3. versus  — split dark bg + two-tone accent + VS center
 *   4. shock   — dark vignette + large emoji + 3-word text
 *
 * Layout: 1280×720 (YouTube standard)
 */

// ── Palette per template ────────────────────────────────────
const TEMPLATES = {
  breaking: {
    bg: 'linear-gradient(135deg, #B71C1C 0%, #D32F2F 40%, #FF5252 100%)',
    textColor: '#ffffff',
    accentBar: '#FF6F00',
    tagBg: 'rgba(255,255,255,0.2)',
    tagColor: '#fff',
    emoji: '🚨',
  },
  reveal: {
    bg: 'linear-gradient(180deg, #0D0D0D 0%, #1A1A2E 100%)',
    textColor: '#FFB703',
    accentBar: '#FF3D00',
    tagBg: 'rgba(255,183,3,0.2)',
    tagColor: '#FFB703',
    emoji: '👁️',
  },
  versus: {
    bg: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    textColor: '#ffffff',
    accentBar: '#E94560',
    tagBg: 'rgba(233,69,96,0.3)',
    tagColor: '#E94560',
    emoji: '⚔️',
  },
  shock: {
    bg: 'radial-gradient(circle at 50% 60%, #1a1a1a 0%, #000000 70%)',
    textColor: '#ffffff',
    accentBar: '#FF6F00',
    tagBg: 'rgba(255,111,0,0.25)',
    tagColor: '#FF6F00',
    emoji: '😱',
  },
};

// ── Helper: wrap headline into 2-3 lines ────────────────────
const wrapText = (text, maxChars = 18) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
};

// ── Accent bar ──────────────────────────────────────────────
const AccentBar = ({ color, bottom = 0 }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom,
      height: 8,
      background: color,
      boxShadow: `0 0 20px ${color}80`,
    }}
  />
);

// ── Tag badge ───────────────────────────────────────────────
const TagBadge = ({ text, bg, color }) => (
  <div
    style={{
      position: 'absolute',
      top: 28,
      right: 32,
      background: bg,
      color,
      fontFamily: '"Arial Black", "Impact", sans-serif',
      fontSize: 18,
      fontWeight: 900,
      padding: '6px 16px',
      borderRadius: 8,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      border: `1px solid ${color}40`,
    }}
  >
    {text}
  </div>
);

// ── Emoji badge ─────────────────────────────────────────────
const EmojiBadge = ({ emoji }) => (
  <div
    style={{
      position: 'absolute',
      top: 22,
      left: 32,
      fontSize: 48,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
    }}
  >
    {emoji}
  </div>
);

// ── Subject image ───────────────────────────────────────────
const SubjectImage = ({ src, template }) => {
  if (!src) return null;
  const isShock = template === 'shock';
  return (
    <div
      style={{
        position: 'absolute',
        right: isShock ? '5%' : '3%',
        bottom: isShock ? '8%' : '12%',
        width: isShock ? '55%' : '42%',
        height: isShock ? '70%' : '60%',
        overflow: 'hidden',
        borderRadius: 16,
        border: '3px solid rgba(255,255,255,0.15)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 20%',
        }}
      />
    </div>
  );
};

// ── Red arrow for reveal template ───────────────────────────
const RedArrow = () => (
  <div
    style={{
      position: 'absolute',
      right: '42%',
      top: '38%',
      fontSize: 64,
      color: '#FF3D00',
      filter: 'drop-shadow(0 4px 12px rgba(255,61,0,0.5))',
      transform: 'rotate(-15deg)',
    }}
  >
    ▶
  </div>
);

// ── VS badge for versus template ────────────────────────────
const VsBadge = () => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: '"Impact", "Arial Black", sans-serif',
      fontSize: 72,
      fontWeight: 900,
      color: '#E94560',
      textShadow: '0 0 30px rgba(233,69,96,0.6), 0 6px 20px rgba(0,0,0,0.8)',
      WebkitTextStroke: '3px rgba(0,0,0,0.5)',
      letterSpacing: '0.1em',
    }}
  >
    VS
  </div>
);

// ── Main Thumbnail Composition ──────────────────────────────
export const ThumbnailComposition = ({
  headline = 'BREAKING NEWS',
  template = 'breaking',
  tag = 'EXCLUSIVE',
  subjectImage = null,
  emoji = null,
}) => {
  const tmpl = TEMPLATES[template] || TEMPLATES.breaking;
  const resolvedEmoji = emoji || tmpl.emoji;
  const lines = wrapText(headline);
  const fontSize = lines.length > 2 ? 58 : lines.some(l => l.length > 14) ? 66 : 80;

  return (
    <AbsoluteFill style={{ background: tmpl.bg, overflow: 'hidden' }}>
      {/* Dark vignette overlay */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, transparent 30%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Subject image */}
      <SubjectImage src={subjectImage} template={template} />

      {/* Red arrow for reveal */}
      {template === 'reveal' ? <RedArrow /> : null}

      {/* VS badge for versus */}
      {template === 'versus' ? <VsBadge /> : null}

      {/* Emoji badge */}
      <EmojiBadge emoji={resolvedEmoji} />

      {/* Tag badge */}
      <TagBadge text={tag} bg={tmpl.tagBg} color={tmpl.tagColor} />

      {/* Headline text */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: template === 'shock' ? '15%' : '22%',
          width: subjectImage ? '52%' : '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: '"Impact", "Arial Black", sans-serif',
              fontSize,
              fontWeight: 900,
              color: tmpl.textColor,
              textTransform: 'uppercase',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              WebkitTextStroke: '4px rgba(0,0,0,0.7)',
              paintOrder: 'stroke fill',
              textShadow: `0 6px 20px rgba(0,0,0,0.8), 0 0 40px ${tmpl.textColor}30`,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Accent bar */}
      <AccentBar color={tmpl.accentBar} bottom={0} />

      {/* Secondary thin line */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          bottom: 20,
          right: 40,
          height: 2,
          background: `linear-gradient(90deg, ${tmpl.accentBar}, transparent)`,
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
