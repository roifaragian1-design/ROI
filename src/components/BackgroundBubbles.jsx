import React, { useMemo } from 'react';

// Inject bubble animation CSS once on module load — never re-rendered
if (typeof document !== 'undefined' && !document.getElementById('bg-bubbles-style')) {
  const tag = document.createElement('style');
  tag.id = 'bg-bubbles-style';
  tag.textContent = `
@keyframes bubble-rise {
  0%   { transform: translateY(110vh) scale(0.8); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-20vh) scale(1.1); opacity: 0; }
}
.bg-bubble {
  position: absolute;
  bottom: -150px;
  border-radius: 50%;
  animation: bubble-rise linear infinite;
  pointer-events: none;
  will-change: transform, opacity;
}`;
  document.head.appendChild(tag);
}

const BUBBLES = [
  { size: 80,  left: 10, delay: 0,   duration: 18 },
  { size: 120, left: 25, delay: 3,   duration: 22 },
  { size: 60,  left: 40, delay: 6,   duration: 16 },
  { size: 100, left: 55, delay: 1,   duration: 20 },
  { size: 70,  left: 70, delay: 8,   duration: 24 },
  { size: 90,  left: 85, delay: 4,   duration: 19 },
  { size: 50,  left: 5,  delay: 11,  duration: 15 },
  { size: 110, left: 92, delay: 7,   duration: 23 },
];

export default function BackgroundBubbles() {
  const bubbles = useMemo(() => BUBBLES.map((b, i) => (
    <div
      key={i}
      className="bg-bubble"
      style={{
        width: b.size,
        height: b.size,
        left: `${b.left}%`,
        animationDelay: `${b.delay}s`,
        animationDuration: `${b.duration}s`,
        background: i % 2 === 0
          ? 'radial-gradient(circle at 35% 35%, var(--primary-border, rgba(64,196,196,0.12)), transparent)'
          : 'radial-gradient(circle at 35% 35%, var(--accent-shadow, rgba(255,127,80,0.08)), transparent)',
        border: '1px solid var(--primary-border, rgba(64,196,196,0.15))',
      }}
    />
  )), []);

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {bubbles}
      </div>
    </>
  );

}
