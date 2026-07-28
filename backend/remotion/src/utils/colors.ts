export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Convert RGB to hex
 */
export const rgbToHex = (rgb: RGB): string => {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

/**
 * Convert RGB to HSL
 */
export const rgbToHsl = (rgb: RGB): HSL => {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Convert HSL to RGB
 */
export const hslToRgb = (hsl: HSL): RGB => {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

/**
 * Lighten a color
 */
export const lighten = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  hsl.l = Math.min(100, hsl.l + amount);
  const newRgb = hslToRgb(hsl);
  return rgbToHex(newRgb);
};

/**
 * Darken a color
 */
export const darken = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  hsl.l = Math.max(0, hsl.l - amount);
  const newRgb = hslToRgb(hsl);
  return rgbToHex(newRgb);
};

/**
 * Blend two colors
 */
export const blendColors = (color1: string, color2: string, ratio: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
  
  return rgbToHex({ r, g, b });
};

/**
 * Get contrasting color (black or white)
 */
export const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Generate color palette from base color
 */
export const generatePalette = (baseColor: string, count: number): string[] => {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb);
  const palette: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = (hsl.h + (i / count) * 30) % 360;
    const lightness = Math.max(20, Math.min(80, hsl.l + (i - count / 2) * 10));
    const saturation = Math.max(20, Math.min(80, hsl.s + (i - count / 2) * 10));
    const newRgb = hslToRgb({ h: hue, s: saturation, l: lightness });
    palette.push(rgbToHex(newRgb));
  }

  return palette;
};

/**
 * Predefined color palettes
 */
export const colorPalettes = {
  sunset: ['#FF6B35', '#F7931E', '#FFD93D', '#6BCB77', '#4D96FF'],
  ocean: ['#006994', '#0077BE', '#4A9DFF', '#89CFF0', '#B3E5FC'],
  forest: ['#228B22', '#32CD32', '#7CFC00', '#ADFF2F', '#98FB98'],
  rose: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFF0F5'],
  lavender: ['#7B68EE', '#9370DB', '#BA55D3', '#DDA0DD', '#E6E6FA'],
  warm: ['#D4A373', '#FAEDCD', '#FEFAE0', '#E9EDC9', '#CCD5AE'],
  cool: ['#1A2980', '#26D0CE', '#89CFF0', '#B3E5FC', '#E0F7FA'],
  neon: ['#FF00FF', '#00FF00', '#00FFFF', '#FF0000', '#FFFF00'],
};

/**
 * Get color with opacity
 */
export const withOpacity = (hex: string, opacity: number): string => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};