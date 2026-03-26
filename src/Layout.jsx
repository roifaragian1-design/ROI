import React, { useState, useEffect } from 'react';
import BackgroundBubbles from '@/components/BackgroundBubbles';

// Static CSS injected once — never re-rendered
const STATIC_STYLE = `
  *, *::before, *::after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    scrollbar-width: none;
    transition: background-color var(--animation-duration, 0.3s) ease,
                color var(--animation-duration, 0.3s) ease,
                border-color var(--animation-duration, 0.3s) ease;
  }
  *::-webkit-scrollbar { display: none; }
  html, body {
    overscroll-behavior: none;
    overflow: hidden;
    width: 100%;
    height: 100%;
    max-width: 100%;
    touch-action: manipulation;
    -webkit-overflow-scrolling: touch;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  #root {
    width: 100%;
    height: 100%;
    max-width: 100%;
    overflow: hidden;
  }
  :root {
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --safe-left: env(safe-area-inset-left, 0px);
    --safe-right: env(safe-area-inset-right, 0px);
  }
  .pt-safe { padding-top: max(env(safe-area-inset-top, 0px), 12px); }
  .pb-safe { padding-bottom: max(env(safe-area-inset-bottom, 0px), 8px); }
  .pl-safe { padding-left: env(safe-area-inset-left, 0px); }
  .pr-safe { padding-right: env(safe-area-inset-right, 0px); }
  .header-safe { padding-top: max(env(safe-area-inset-top, 0px), 12px); }
  .messages-scroll, [class*="overflow-y-auto"] {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    scroll-behavior: smooth;
  }
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
  }
  input, textarea, select {
    font-size: 16px !important;
    -webkit-appearance: none;
    border-radius: 0;
  }
  input:focus, textarea:focus, button:focus { outline: none; }
  .h-screen-mobile, .h-interactive { height: 100vh; height: 100dvh; }
  [data-theme="dark"] {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #f1f5f9;
  }
  [data-theme="dark"] select {
    background-color: #1e293b;
    color: #f1f5f9;
    border-color: #334155;
  }
  [data-theme="dark"] input,
  [data-theme="dark"] textarea {
    background-color: rgba(30, 41, 59, 0.9) !important;
    color: #e2e8f0 !important;
    border-color: rgba(255,255,255,0.12) !important;
  }
  [data-theme="dark"] input::placeholder,
  [data-theme="dark"] textarea::placeholder {
    color: rgba(148, 163, 184, 0.6) !important;
  }
  [data-theme="dark"] .bg-white { background-color: #1e293b; }
  [data-theme="dark"] .text-gray-900 { color: #f1f5f9; }
  [data-theme="dark"] .bg-gray-50 { background-color: #0f172a; }
  [data-theme="dark"] .border-gray-100 { border-color: #334155; }
  [data-theme="dark"] .glassmorphic,
  [data-theme="dark"] [style*="rgba(240, 255, 254"] {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(30, 41, 59, 0.95) 100%) !important;
    border-color: rgba(255,255,255,0.08) !important;
  }
  .btn-cta, [data-cta="true"] {
    background: var(--accent) !important;
    color: #fff !important;
    box-shadow: 0 4px 20px var(--accent-shadow);
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--primary), #2dd4bf) !important;
    color: #fff !important;
    box-shadow: 0 4px 20px var(--primary-shadow);
  }
  .card-info {
    background: #ffffff !important;
    border: 1px solid var(--primary-border) !important;
    color: var(--color-secondary) !important;
  }
  .game-header {
    background: var(--color-secondary) !important;
    color: #ffffff !important;
  }
  .bg-gradient-to-l, .bg-gradient-to-r {
    background: linear-gradient(135deg, var(--primary) 0%, #2dd4bf 100%);
  }
`;

// Inject static CSS once on module load — never again
if (typeof document !== 'undefined' && !document.getElementById('layout-static-style')) {
  const tag = document.createElement('style');
  tag.id = 'layout-static-style';
  tag.textContent = STATIC_STYLE;
  document.head.appendChild(tag);
}

const FONT_SIZE_MAP = { sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' };
const ANIMATION_SPEED = { slow: '0.5s', normal: '0.3s', fast: '0.15s' };

function getStoredJSON(key, fallback = null) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function Layout({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'light');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('app_font_size') || 'base');
  const [customColors, setCustomColors] = useState(() => getStoredJSON('app_theme_colors'));
  const [customFonts, setCustomFonts] = useState(() => getStoredJSON('app_theme_fonts'));
  const [customAnimations, setCustomAnimations] = useState(
    () => getStoredJSON('app_theme_animations') || { enabled: true, speed: 'normal' }
  );
  const [bgImage, setBgImage] = useState(() => localStorage.getItem('app_bg_image') || '');
  const [bgPosition, setBgPosition] = useState(
    () => getStoredJSON('app_bg_position') || { x: 0, y: 0, zoom: 1 }
  );

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('app_theme', theme); document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('app_font_size', fontSize); document.documentElement.setAttribute('data-font-size', fontSize); }, [fontSize]);
  useEffect(() => {
    if (customColors) localStorage.setItem('app_theme_colors', JSON.stringify(customColors));
    else localStorage.removeItem('app_theme_colors');
  }, [customColors]);
  useEffect(() => {
    if (customFonts) localStorage.setItem('app_theme_fonts', JSON.stringify(customFonts));
    else localStorage.removeItem('app_theme_fonts');
  }, [customFonts]);
  useEffect(() => { localStorage.setItem('app_theme_animations', JSON.stringify(customAnimations)); }, [customAnimations]);

  // Background image sync across tabs
  useEffect(() => {
    const handler = () => {
      setBgImage(localStorage.getItem('app_bg_image') || '');
      setBgPosition(getStoredJSON('app_bg_position') || { x: 0, y: 0, zoom: 1 });
    };
    window.addEventListener('storage', handler);
    window.addEventListener('bgImageUpdate', handler);
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('bgImageUpdate', handler); };
  }, []);

  // Update CSS variables directly — no style re-injection, no reflow
  useEffect(() => {
    const root = document.documentElement;
    const primary = customColors?.primary || '#40C4C4';
    const secondary = customColors?.secondary || '#2C3E50';
    const accent = customColors?.accent || '#FF7F50';
    const duration = ANIMATION_SPEED[customAnimations?.speed] || '0.3s';
    const animEnabled = customAnimations?.enabled ?? true;

    root.style.setProperty('--primary', primary);
    root.style.setProperty('--primary-dark', primary + 'dd');
    root.style.setProperty('--primary-border', primary + '30');
    root.style.setProperty('--primary-shadow', primary + '50');
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-shadow', accent + '60');
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-cta', accent);
    root.style.setProperty('--animation-duration', animEnabled ? duration : '0s');
    root.style.fontSize = FONT_SIZE_MAP[fontSize] || '1rem';
    document.body.style.fontFamily = customFonts?.family || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  }, [customColors, customAnimations, customFonts, fontSize]);

  // Favicon update
  useEffect(() => {
    const primary = customColors?.primary || '#40C4C4';
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:${primary};stop-opacity:1'/><stop offset='100%' style='stop-color:%238b5cf6;stop-opacity:1'/></linearGradient></defs><rect width='100' height='100' rx='20' fill='url(%23g)'/><text x='50' y='70' font-size='60' font-weight='900' text-anchor='middle' fill='white' font-family='Arial'>💬</text></svg>`;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [customColors?.primary]);

  const themeBg = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    : theme === 'colorful'
      ? 'bg-gradient-to-br from-cyan-100 via-teal-50 to-sky-100'
      : 'bg-gradient-to-br from-white to-cyan-50';

  return (
    <div
      className={`${!bgImage ? themeBg : ''}`}
      style={{
        transition: 'background-color 0.5s ease, opacity 0.2s ease',
        color: theme === 'dark' ? 'white' : theme === 'light' ? '#1f2937' : 'inherit',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...(bgImage ? {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: `calc(100% * ${bgPosition.zoom})`,
          backgroundPosition: `${bgPosition.x}px ${bgPosition.y}px`,
          backgroundRepeat: 'no-repeat',
        } : {})
      }}
    >
      <BackgroundBubbles />
      {children}
    </div>
  );
}
