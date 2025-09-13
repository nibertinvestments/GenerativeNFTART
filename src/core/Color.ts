/**
 * Color Utilities for Generative Art
 * 
 * Provides color manipulation, palette generation, and color theory utilities
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface ColorPalette {
  name: string;
  colors: RGB[];
  description?: string;
}

/**
 * Color utility class with conversion and manipulation methods
 */
export class Color {
  private _r: number;
  private _g: number;
  private _b: number;
  private _a: number;

  constructor(r: number, g: number, b: number, a: number = 1) {
    this._r = Math.max(0, Math.min(255, Math.round(r)));
    this._g = Math.max(0, Math.min(255, Math.round(g)));
    this._b = Math.max(0, Math.min(255, Math.round(b)));
    this._a = Math.max(0, Math.min(1, a));
  }

  // Getters
  get r(): number { return this._r; }
  get g(): number { return this._g; }
  get b(): number { return this._b; }
  get a(): number { return this._a; }

  /**
   * Create Color from hex string
   */
  static fromHex(hex: string): Color {
    const cleaned = hex.replace('#', '');
    const r = parseInt(cleaned.substr(0, 2), 16);
    const g = parseInt(cleaned.substr(2, 2), 16);
    const b = parseInt(cleaned.substr(4, 2), 16);
    return new Color(r, g, b);
  }

  /**
   * Create Color from HSV
   */
  static fromHSV(h: number, s: number, v: number): Color {
    h = h % 360;
    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return new Color(
      (r + m) * 255,
      (g + m) * 255,
      (b + m) * 255
    );
  }

  /**
   * Create Color from HSL
   */
  static fromHSL(h: number, s: number, l: number): Color {
    h = h % 360;
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return new Color(
      (r + m) * 255,
      (g + m) * 255,
      (b + m) * 255
    );
  }

  /**
   * Convert to hex string
   */
  toHex(): string {
    const r = this._r.toString(16).padStart(2, '0');
    const g = this._g.toString(16).padStart(2, '0');
    const b = this._b.toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  /**
   * Convert to RGB string
   */
  toRGB(): string {
    return `rgb(${this._r}, ${this._g}, ${this._b})`;
  }

  /**
   * Convert to RGBA string
   */
  toRGBA(): string {
    return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
  }

  /**
   * Convert to HSV
   */
  toHSV(): HSV {
    const r = this._r / 255;
    const g = this._g / 255;
    const b = this._b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = 60 * (((g - b) / delta) % 6);
      } else if (max === g) {
        h = 60 * ((b - r) / delta + 2);
      } else {
        h = 60 * ((r - g) / delta + 4);
      }
    }

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return { h: h < 0 ? h + 360 : h, s, v };
  }

  /**
   * Convert to HSL
   */
  toHSL(): HSL {
    const r = this._r / 255;
    const g = this._g / 255;
    const b = this._b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = 60 * (((g - b) / delta) % 6);
      } else if (max === g) {
        h = 60 * ((b - r) / delta + 2);
      } else {
        h = 60 * ((r - g) / delta + 4);
      }
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h: h < 0 ? h + 360 : h, s, l };
  }

  /**
   * Lighten color by percentage
   */
  lighten(amount: number): Color {
    const hsl = this.toHSL();
    return Color.fromHSL(hsl.h, hsl.s, Math.min(1, hsl.l + amount));
  }

  /**
   * Darken color by percentage
   */
  darken(amount: number): Color {
    const hsl = this.toHSL();
    return Color.fromHSL(hsl.h, hsl.s, Math.max(0, hsl.l - amount));
  }

  /**
   * Saturate color by percentage
   */
  saturate(amount: number): Color {
    const hsl = this.toHSL();
    return Color.fromHSL(hsl.h, Math.min(1, hsl.s + amount), hsl.l);
  }

  /**
   * Desaturate color by percentage
   */
  desaturate(amount: number): Color {
    const hsl = this.toHSL();
    return Color.fromHSL(hsl.h, Math.max(0, hsl.s - amount), hsl.l);
  }

  /**
   * Get complementary color
   */
  complement(): Color {
    const hsl = this.toHSL();
    return Color.fromHSL((hsl.h + 180) % 360, hsl.s, hsl.l);
  }

  /**
   * Mix with another color
   */
  mix(other: Color, ratio: number = 0.5): Color {
    const r = this._r * (1 - ratio) + other._r * ratio;
    const g = this._g * (1 - ratio) + other._g * ratio;
    const b = this._b * (1 - ratio) + other._b * ratio;
    const a = this._a * (1 - ratio) + other._a * ratio;
    return new Color(r, g, b, a);
  }
}

/**
 * Color Palette Generator
 */
export class PaletteGenerator {
  /**
   * Generate complementary palette
   */
  static complementary(baseColor: Color): ColorPalette {
    const complement = baseColor.complement();
    return {
      name: 'Complementary',
      colors: [
        { r: baseColor.r, g: baseColor.g, b: baseColor.b },
        { r: complement.r, g: complement.g, b: complement.b }
      ]
    };
  }

  /**
   * Generate triadic palette
   */
  static triadic(baseColor: Color): ColorPalette {
    const hsl = baseColor.toHSL();
    const color2 = Color.fromHSL((hsl.h + 120) % 360, hsl.s, hsl.l);
    const color3 = Color.fromHSL((hsl.h + 240) % 360, hsl.s, hsl.l);

    return {
      name: 'Triadic',
      colors: [
        { r: baseColor.r, g: baseColor.g, b: baseColor.b },
        { r: color2.r, g: color2.g, b: color2.b },
        { r: color3.r, g: color3.g, b: color3.b }
      ]
    };
  }

  /**
   * Generate analogous palette
   */
  static analogous(baseColor: Color, count: number = 5): ColorPalette {
    const hsl = baseColor.toHSL();
    const colors: RGB[] = [];
    const step = 30; // degrees

    for (let i = 0; i < count; i++) {
      const h = (hsl.h + (i - Math.floor(count / 2)) * step) % 360;
      const color = Color.fromHSL(h < 0 ? h + 360 : h, hsl.s, hsl.l);
      colors.push({ r: color.r, g: color.g, b: color.b });
    }

    return {
      name: 'Analogous',
      colors
    };
  }

  /**
   * Generate monochromatic palette
   */
  static monochromatic(baseColor: Color, count: number = 5): ColorPalette {
    const hsl = baseColor.toHSL();
    const colors: RGB[] = [];
    
    for (let i = 0; i < count; i++) {
      const l = Math.max(0.1, Math.min(0.9, hsl.l + (i - Math.floor(count / 2)) * 0.15));
      const color = Color.fromHSL(hsl.h, hsl.s, l);
      colors.push({ r: color.r, g: color.g, b: color.b });
    }

    return {
      name: 'Monochromatic',
      colors
    };
  }

  /**
   * Generate random palette
   */
  static random(count: number = 5, seed?: string): ColorPalette {
    const colors: RGB[] = [];
    let random = Math.random;
    
    if (seed) {
      // Simple seeded random for consistent results
      let seedValue = 0;
      for (let i = 0; i < seed.length; i++) {
        seedValue += seed.charCodeAt(i);
      }
      random = () => {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        return seedValue / 233280;
      };
    }

    for (let i = 0; i < count; i++) {
      const h = random() * 360;
      const s = 0.5 + random() * 0.5; // 50-100% saturation
      const l = 0.3 + random() * 0.4; // 30-70% lightness
      const color = Color.fromHSL(h, s, l);
      colors.push({ r: color.r, g: color.g, b: color.b });
    }

    return {
      name: 'Random',
      colors
    };
  }
}

/**
 * Predefined color palettes
 */
export const PALETTES: { [key: string]: ColorPalette } = {
  warm: {
    name: 'Warm',
    colors: [
      { r: 255, g: 99, b: 71 },   // Tomato
      { r: 255, g: 140, b: 0 },   // Dark Orange
      { r: 255, g: 215, b: 0 },   // Gold
      { r: 255, g: 69, b: 0 },    // Red Orange
      { r: 139, g: 69, b: 19 }    // Saddle Brown
    ]
  },
  cool: {
    name: 'Cool',
    colors: [
      { r: 0, g: 191, b: 255 },   // Deep Sky Blue
      { r: 30, g: 144, b: 255 },  // Dodger Blue
      { r: 100, g: 149, b: 237 }, // Cornflower Blue
      { r: 123, g: 104, b: 238 }, // Medium Slate Blue
      { r: 72, g: 61, b: 139 }    // Dark Slate Blue
    ]
  },
  earth: {
    name: 'Earth',
    colors: [
      { r: 160, g: 82, b: 45 },   // Sienna
      { r: 210, g: 180, b: 140 }, // Tan
      { r: 222, g: 184, b: 135 }, // Burlywood
      { r: 205, g: 133, b: 63 },  // Peru
      { r: 139, g: 69, b: 19 }    // Saddle Brown
    ]
  },
  ocean: {
    name: 'Ocean',
    colors: [
      { r: 0, g: 105, b: 148 },   // Deep Ocean
      { r: 0, g: 119, b: 190 },   // Ocean Blue
      { r: 0, g: 150, b: 199 },   // Sky Blue
      { r: 0, g: 180, b: 216 },   // Light Blue
      { r: 144, g: 224, b: 239 }  // Powder Blue
    ]
  },
  sunset: {
    name: 'Sunset',
    colors: [
      { r: 255, g: 94, b: 77 },   // Sunset Red
      { r: 255, g: 154, b: 0 },   // Sunset Orange
      { r: 255, g: 206, b: 84 },  // Sunset Yellow
      { r: 255, g: 138, b: 101 }, // Peach
      { r: 161, g: 90, b: 149 }   // Purple
    ]
  }
};