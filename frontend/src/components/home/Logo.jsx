import React from 'react';

/**
 * variant:
 * - 'dark'  -> darkbg (for white/light headers)
 * - 'light' -> whitebg (for dark/navy headers)
 * - 'transparent' -> transparent PNG for general use
 */
export default function Logo({ variant = 'transparent', height = 28, alt = 'CIAP' }) {
  const srcMap = {
    dark: '/assets/logo_og_darkbg.png',
    light: '/assets/logo_og_whitebg.png',
    transparent: '/assets/logo_og_transparent.png',
  };
  const src = srcMap[variant] || srcMap.transparent;

  return (
    <img
      src={src}
      alt={alt}
      style={{ height, display: 'block' }}
      draggable={false}
      onError={(e) => {
        console.warn(`Logo failed to load: ${src}. Falling back to transparent.`);
        e.currentTarget.src = '/assets/logo_og_transparent.png';
      }}
    />
  );
}
