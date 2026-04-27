import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BackgroundBubbles from '@/components/BackgroundBubbles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDirection } from '@/components/translations';
import { Globe, Settings } from 'lucide-react';
import { createPageUrl } from './utils';
import '@/layout-static.css';

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

export default function Layout({ children, currentPageName }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'he');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
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

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.dir = getDirection(language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handler = () => {
      setBgImage(localStorage.getItem('app_bg_image') || '');
      setBgPosition(getStoredJSON('app_bg_position') || { x: 0, y: 0, zoom: 1 });
    };
    window.addEventListener('storage', handler);
    window.addEventListener('bgImageUpdate', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('bgImageUpdate', handler);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app_font_size', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (customColors) localStorage.setItem('app_theme_colors', JSON.stringify(customColors));
    else localStorage.removeItem('app_theme_colors');
  }, [customColors]);

  useEffect(() => {
    if (customFonts) localStorage.setItem('app_theme_fonts', JSON.stringify(customFonts));
    else localStorage.removeItem('app_theme_fonts');
  }, [customFonts]);

  useEffect(() => {
    localStorage.setItem('app_theme_animations', JSON.stringify(customAnimations));
  }, [customAnimations]);

  const primaryColor = customColors?.primary || '#40C4C4';
  const secondaryColor = customColors?.secondary || '#2C3E50';
  const accentColor = customColors?.accent || '#FF7F50';
  const animDuration = ANIMATION_SPEED[customAnimations?.speed] || '0.3s';
  const animEnabled = customAnimations?.enabled ?? true;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--app-primary', primaryColor);
    root.style.setProperty('--app-primary-dark', primaryColor + 'dd');
    root.style.setProperty('--app-primary-border', primaryColor + '30');
    root.style.setProperty('--app-primary-shadow', primaryColor + '50');
    root.style.setProperty('--app-accent', accentColor);
    root.style.setProperty('--app-accent-shadow', accentColor + '60');
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    root.style.setProperty('--color-cta', accentColor);
    root.style.setProperty('--animation-duration', animEnabled ? animDuration : '0s');
    root.style.fontSize = FONT_SIZE_MAP[fontSize] || '1rem';
    document.body.style.fontFamily = customFonts?.family || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }, [primaryColor, secondaryColor, accentColor, animDuration, animEnabled, customFonts, fontSize]);

  useEffect(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:${primaryColor};stop-opacity:1'/><stop offset='100%' style='stop-color:%238b5cf6;stop-opacity:1'/></linearGradient></defs><rect width='100' height='100' rx='20' fill='url(%23g)'/><text x='50' y='70' font-size='60' font-weight='900' text-anchor='middle' fill='white' font-family='Arial'>💬</text></svg>`;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [primaryColor]);

  const themeBg = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    : theme === 'colorful'
      ? 'bg-gradient-to-br from-cyan-100 via-teal-50 to-sky-100'
      : 'bg-gradient-to-br from-white to-cyan-50';

  const mainStyle = useMemo(() => ({
    fontSize: FONT_SIZE_MAP[fontSize],
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
  }), [theme, fontSize, bgImage, bgPosition.x, bgPosition.y, bgPosition.zoom]);

  const childrenWithLanguage = React.Children.map(children, child =>
    React.isValidElement(child) ? React.cloneElement(child, { language }) : child
  );

  return (
    <div
      dir={getDirection(language)}
      className={!bgImage ? themeBg : ''}
      style={mainStyle}
    >
      {/* Language selector + navigation — dir="ltr" so it always stays on the left */}
      <div className="fixed top-20 left-4 z-[60] flex gap-2" dir="ltr">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32 bg-white shadow-lg">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="he">עברית</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>

        {currentPageName === 'Home' && (
          <>
            <Link to={createPageUrl('About')}>
              <button className="h-9 px-3 bg-white shadow-lg rounded-md hover:bg-slate-50 transition-colors">
                ℹ️
              </button>
            </Link>
            <Link to={createPageUrl('Settings')}>
              <button className="h-9 px-3 bg-white shadow-lg rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
              </button>
            </Link>
          </>
        )}

        {(currentPageName === 'Settings' || currentPageName === 'About') && (
          <Link to={createPageUrl('Home')}>
            <button className="h-9 px-3 bg-white shadow-lg rounded-md hover:bg-slate-50 transition-colors">
              🏠
            </button>
          </Link>
        )}
      </div>

      <BackgroundBubbles />
      {childrenWithLanguage}
    </div>
  );
}
