/**
 * Base Generator Interface
 * 
 * All generative art algorithms must implement this interface
 * to ensure consistent behavior and HIGHLIGHT.XYZ compatibility.
 */

export interface GeneratorParameters {
  [key: string]: {
    value: number | string | boolean;
    min?: number;
    max?: number;
    options?: string[];
    description: string;
    type: 'number' | 'string' | 'boolean' | 'select';
  };
}

export interface ArtworkMetadata {
  name: string;
  description: string;
  features: Record<string, string | number>;
  algorithm: string;
  seed: string;
  timestamp: number;
  parameters: GeneratorParameters;
}

export interface GenerationContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  seed: string;
  random: SeededRandom;
}

export interface GenerationResult {
  canvas: HTMLCanvasElement;
  metadata: ArtworkMetadata;
  features: Record<string, string | number>;
}

/**
 * Seeded Random Number Generator
 * Ensures deterministic generation for the same seed
 */
export class SeededRandom {
  private seed: number;
  private originalSeed: string;

  constructor(seed: string) {
    this.originalSeed = seed;
    this.seed = this.hashSeed(seed);
  }

  private hashSeed(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get next random number between 0 and 1
   */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Get random number in range [min, max)
   */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Get random integer in range [min, max]
   */
  integer(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /**
   * Get random boolean with given probability
   */
  boolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Choose random element from array
   */
  choice<T>(array: T[]): T {
    return array[this.integer(0, array.length - 1)];
  }

  /**
   * Shuffle array in place
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.integer(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Get the original seed string
   */
  getSeed(): string {
    return this.originalSeed;
  }
}

/**
 * Abstract Base Generator Class
 * 
 * Extend this class to create new generative art algorithms
 */
export abstract class Generator {
  protected name: string;
  protected description: string;
  protected parameters: GeneratorParameters;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.parameters = {};
  }

  /**
   * Get generator information
   */
  getInfo(): { name: string; description: string } {
    return {
      name: this.name,
      description: this.description
    };
  }

  /**
   * Get available parameters
   */
  getParameters(): GeneratorParameters {
    return { ...this.parameters };
  }

  /**
   * Set parameter value
   */
  setParameter(key: string, value: number | string | boolean): void {
    if (this.parameters[key]) {
      this.parameters[key].value = value;
    }
  }

  /**
   * Create generation context
   */
  protected createContext(
    seed: string,
    width: number = 1000,
    height: number = 1000
  ): GenerationContext {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }

    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const random = new SeededRandom(seed);

    return {
      canvas,
      ctx,
      width,
      height,
      seed,
      random
    };
  }

  /**
   * Generate features based on seed and parameters
   */
  protected abstract generateFeatures(context: GenerationContext): Record<string, string | number>;

  /**
   * Main generation method - must be implemented by subclasses
   */
  protected abstract render(context: GenerationContext): void;

  /**
   * Generate complete artwork
   */
  generate(
    seed: string,
    width: number = 1000,
    height: number = 1000
  ): GenerationResult {
    const context = this.createContext(seed, width, height);
    
    // Generate features first (affects rendering)
    const features = this.generateFeatures(context);
    
    // Render the artwork
    this.render(context);

    // Create metadata
    const metadata: ArtworkMetadata = {
      name: this.name,
      description: this.description,
      features,
      algorithm: this.name,
      seed,
      timestamp: Date.now(),
      parameters: this.getParameters()
    };

    return {
      canvas: context.canvas,
      metadata,
      features
    };
  }

  /**
   * Generate preview (smaller, faster version)
   */
  generatePreview(seed: string, size: number = 256): HTMLCanvasElement {
    const result = this.generate(seed, size, size);
    return result.canvas;
  }

  /**
   * Export canvas as data URL
   */
  exportAsDataURL(canvas: HTMLCanvasElement, format: string = 'image/png'): string {
    return canvas.toDataURL(format);
  }

  /**
   * Export canvas as blob
   */
  exportAsBlob(canvas: HTMLCanvasElement, format: string = 'image/png'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        format
      );
    });
  }
}

/**
 * Generator Registry
 * Manages available generators
 */
export class GeneratorRegistry {
  private generators: Map<string, Generator> = new Map();

  /**
   * Register a generator
   */
  register(generator: Generator): void {
    const info = generator.getInfo();
    this.generators.set(info.name, generator);
  }

  /**
   * Get generator by name
   */
  get(name: string): Generator | undefined {
    return this.generators.get(name);
  }

  /**
   * Get all registered generators
   */
  getAll(): Generator[] {
    return Array.from(this.generators.values());
  }

  /**
   * Get generator names
   */
  getNames(): string[] {
    return Array.from(this.generators.keys());
  }

  /**
   * Check if generator exists
   */
  has(name: string): boolean {
    return this.generators.has(name);
  }
}

// Global registry instance
export const registry = new GeneratorRegistry();