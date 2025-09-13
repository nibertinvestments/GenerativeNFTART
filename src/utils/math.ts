/**
 * Mathematical utilities for generative art
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * 2D Vector class
 */
export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  static from(v: Vector2D): Vec2 {
    return new Vec2(v.x, v.y);
  }

  static fromAngle(angle: number, magnitude: number = 1): Vec2 {
    return new Vec2(
      Math.cos(angle) * magnitude,
      Math.sin(angle) * magnitude
    );
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  multiply(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vec2 {
    return new Vec2(this.x / scalar, this.y / scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vec2 {
    const mag = this.magnitude();
    return mag > 0 ? this.divide(mag) : new Vec2(0, 0);
  }

  distance(v: Vec2): number {
    return this.subtract(v).magnitude();
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  rotate(angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  lerp(v: Vec2, t: number): Vec2 {
    return this.add(v.subtract(this).multiply(t));
  }
}

/**
 * Mathematical functions
 */
export class MathUtils {
  /**
   * Linear interpolation
   */
  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /**
   * Map value from one range to another
   */
  static map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  /**
   * Constrain value between min and max
   */
  static constrain(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Convert degrees to radians
   */
  static radians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  /**
   * Convert radians to degrees
   */
  static degrees(radians: number): number {
    return radians * 180 / Math.PI;
  }

  /**
   * Distance between two points
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**
   * Smooth step interpolation
   */
  static smoothstep(edge0: number, edge1: number, x: number): number {
    const t = this.constrain((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  /**
   * Smoother step interpolation
   */
  static smootherstep(edge0: number, edge1: number, x: number): number {
    const t = this.constrain((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Ease in cubic
   */
  static easeInCubic(t: number): number {
    return t * t * t;
  }

  /**
   * Ease out cubic
   */
  static easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Ease in-out cubic
   */
  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Gaussian distribution
   */
  static gaussian(x: number, mu: number = 0, sigma: number = 1): number {
    return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI));
  }

  /**
   * Generate Fibonacci sequence
   */
  static fibonacci(n: number): number[] {
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
      fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib.slice(0, n);
  }

  /**
   * Golden ratio
   */
  static get goldenRatio(): number {
    return (1 + Math.sqrt(5)) / 2;
  }

  /**
   * Check if point is inside circle
   */
  static pointInCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
    return this.distance(px, py, cx, cy) <= radius;
  }

  /**
   * Check if point is inside rectangle
   */
  static pointInRect(px: number, py: number, rx: number, ry: number, rw: number, rh: number): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }
}

/**
 * Improved Perlin Noise implementation
 */
export class PerlinNoise {
  private permutation: number[];
  private p: number[];

  constructor(seed?: number) {
    this.permutation = Array.from({ length: 256 }, (_, i) => i);
    
    if (seed !== undefined) {
      this.seedShuffle(seed);
    } else {
      this.shuffle();
    }

    this.p = [...this.permutation, ...this.permutation];
  }

  private shuffle(): void {
    for (let i = this.permutation.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
  }

  private seedShuffle(seed: number): void {
    let currentSeed = seed;
    const seededRandom = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };

    for (let i = this.permutation.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private grad(hash: number, x: number, y: number, z: number = 0): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * 1D Perlin noise
   */
  noise1D(x: number): number {
    const X = Math.floor(x) & 255;
    x -= Math.floor(x);
    const u = this.fade(x);
    return MathUtils.lerp(
      this.grad(this.p[X], x, 0),
      this.grad(this.p[X + 1], x - 1, 0),
      u
    ) * 2;
  }

  /**
   * 2D Perlin noise
   */
  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const a = this.p[X] + Y;
    const aa = this.p[a];
    const ab = this.p[a + 1];
    const b = this.p[X + 1] + Y;
    const ba = this.p[b];
    const bb = this.p[b + 1];
    
    return MathUtils.lerp(
      MathUtils.lerp(
        this.grad(this.p[aa], x, y),
        this.grad(this.p[ba], x - 1, y),
        u
      ),
      MathUtils.lerp(
        this.grad(this.p[ab], x, y - 1),
        this.grad(this.p[bb], x - 1, y - 1),
        u
      ),
      v
    );
  }

  /**
   * 3D Perlin noise
   */
  noise3D(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);
    
    const a = this.p[X] + Y;
    const aa = this.p[a] + Z;
    const ab = this.p[a + 1] + Z;
    const b = this.p[X + 1] + Y;
    const ba = this.p[b] + Z;
    const bb = this.p[b + 1] + Z;
    
    return MathUtils.lerp(
      MathUtils.lerp(
        MathUtils.lerp(
          this.grad(this.p[aa], x, y, z),
          this.grad(this.p[ba], x - 1, y, z),
          u
        ),
        MathUtils.lerp(
          this.grad(this.p[ab], x, y - 1, z),
          this.grad(this.p[bb], x - 1, y - 1, z),
          u
        ),
        v
      ),
      MathUtils.lerp(
        MathUtils.lerp(
          this.grad(this.p[aa + 1], x, y, z - 1),
          this.grad(this.p[ba + 1], x - 1, y, z - 1),
          u
        ),
        MathUtils.lerp(
          this.grad(this.p[ab + 1], x, y - 1, z - 1),
          this.grad(this.p[bb + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    );
  }

  /**
   * Fractal noise (multiple octaves)
   */
  fractalNoise2D(
    x: number,
    y: number,
    octaves: number = 4,
    persistence: number = 0.5,
    scale: number = 0.01
  ): number {
    let value = 0;
    let amplitude = 1;
    let frequency = scale;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return value / maxValue;
  }
}

/**
 * Simple 2D Simplex Noise implementation
 */
export class SimplexNoise {
  private perm: number[];
  private permMod12: number[];

  private static grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
  ];

  private static F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  private static G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

  constructor(seed?: number) {
    const p = Array.from({ length: 256 }, (_, i) => i);
    
    if (seed !== undefined) {
      this.seedShuffle(p, seed);
    } else {
      this.shuffle(p);
    }

    this.perm = [...p, ...p];
    this.permMod12 = this.perm.map(val => val % 12);
  }

  private shuffle(array: number[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private seedShuffle(array: number[], seed: number): void {
    let currentSeed = seed;
    const seededRandom = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private dot2D(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
  }

  /**
   * 2D Simplex noise
   */
  noise2D(xin: number, yin: number): number {
    let n0, n1, n2;

    const s = (xin + yin) * SimplexNoise.F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * SimplexNoise.G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + SimplexNoise.G2;
    const y1 = y0 - j1 + SimplexNoise.G2;
    const x2 = x0 - 1.0 + 2.0 * SimplexNoise.G2;
    const y2 = y0 - 1.0 + 2.0 * SimplexNoise.G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.permMod12[ii + this.perm[jj]];
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) {
      n0 = 0.0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot2D(SimplexNoise.grad3[gi0], x0, y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) {
      n1 = 0.0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot2D(SimplexNoise.grad3[gi1], x1, y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) {
      n2 = 0.0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot2D(SimplexNoise.grad3[gi2], x2, y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }
}