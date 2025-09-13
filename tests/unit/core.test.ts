/**
 * Basic tests for the Generative NFT Art framework
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Generator, SeededRandom, GeneratorRegistry } from '../../src/core/Generator';
import { Color, PaletteGenerator } from '../../src/core/Color';
import { PerlinNoise, MathUtils, Vec2 } from '../../src/utils/math';

describe('SeededRandom', () => {
  test('should produce deterministic results', () => {
    const rng1 = new SeededRandom('test-seed');
    const rng2 = new SeededRandom('test-seed');
    
    // Generate same sequence
    const sequence1 = Array.from({ length: 10 }, () => rng1.next());
    const sequence2 = Array.from({ length: 10 }, () => rng2.next());
    
    expect(sequence1).toEqual(sequence2);
  });

  test('should produce different results for different seeds', () => {
    const rng1 = new SeededRandom('seed1');
    const rng2 = new SeededRandom('seed2');
    
    const value1 = rng1.next();
    const value2 = rng2.next();
    
    expect(value1).not.toBe(value2);
  });

  test('should generate values in range', () => {
    const rng = new SeededRandom('test');
    
    for (let i = 0; i < 100; i++) {
      const value = rng.range(10, 20);
      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThan(20);
    }
  });

  test('should generate integers correctly', () => {
    const rng = new SeededRandom('test');
    
    for (let i = 0; i < 100; i++) {
      const value = rng.integer(1, 6);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    }
  });
});

describe('Color', () => {
  test('should create color from RGB values', () => {
    const color = new Color(255, 128, 0);
    expect(color.r).toBe(255);
    expect(color.g).toBe(128);
    expect(color.b).toBe(0);
  });

  test('should convert to hex correctly', () => {
    const color = new Color(255, 128, 0);
    expect(color.toHex()).toBe('#ff8000');
  });

  test('should create from hex string', () => {
    const color = Color.fromHex('#ff8000');
    expect(color.r).toBe(255);
    expect(color.g).toBe(128);
    expect(color.b).toBe(0);
  });

  test('should convert HSV correctly', () => {
    const color = Color.fromHSV(0, 1, 1); // Pure red
    expect(color.r).toBe(255);
    expect(color.g).toBe(0);
    expect(color.b).toBe(0);
  });

  test('should generate complement', () => {
    const red = new Color(255, 0, 0);
    const complement = red.complement();
    const hsl = complement.toHSL();
    
    // Complement should be cyan-ish (180 degrees from red)
    expect(Math.abs(hsl.h - 180)).toBeLessThan(1);
  });
});

describe('PaletteGenerator', () => {
  test('should generate complementary palette', () => {
    const baseColor = new Color(255, 0, 0); // Red
    const palette = PaletteGenerator.complementary(baseColor);
    
    expect(palette.colors).toHaveLength(2);
    expect(palette.name).toBe('Complementary');
  });

  test('should generate triadic palette', () => {
    const baseColor = new Color(255, 0, 0);
    const palette = PaletteGenerator.triadic(baseColor);
    
    expect(palette.colors).toHaveLength(3);
    expect(palette.name).toBe('Triadic');
  });

  test('should generate deterministic random palette', () => {
    const palette1 = PaletteGenerator.random(5, 'test-seed');
    const palette2 = PaletteGenerator.random(5, 'test-seed');
    
    expect(palette1.colors).toEqual(palette2.colors);
  });
});

describe('MathUtils', () => {
  test('should interpolate correctly', () => {
    expect(MathUtils.lerp(0, 10, 0.5)).toBe(5);
    expect(MathUtils.lerp(0, 10, 0)).toBe(0);
    expect(MathUtils.lerp(0, 10, 1)).toBe(10);
  });

  test('should map values correctly', () => {
    expect(MathUtils.map(5, 0, 10, 0, 100)).toBe(50);
    expect(MathUtils.map(0, 0, 10, 0, 100)).toBe(0);
    expect(MathUtils.map(10, 0, 10, 0, 100)).toBe(100);
  });

  test('should constrain values', () => {
    expect(MathUtils.constrain(15, 0, 10)).toBe(10);
    expect(MathUtils.constrain(-5, 0, 10)).toBe(0);
    expect(MathUtils.constrain(5, 0, 10)).toBe(5);
  });

  test('should calculate distance', () => {
    expect(MathUtils.distance(0, 0, 3, 4)).toBe(5);
    expect(MathUtils.distance(0, 0, 0, 0)).toBe(0);
  });
});

describe('Vec2', () => {
  test('should perform vector operations', () => {
    const v1 = new Vec2(3, 4);
    const v2 = new Vec2(1, 2);
    
    const sum = v1.add(v2);
    expect(sum.x).toBe(4);
    expect(sum.y).toBe(6);
    
    const diff = v1.subtract(v2);
    expect(diff.x).toBe(2);
    expect(diff.y).toBe(2);
  });

  test('should calculate magnitude', () => {
    const v = new Vec2(3, 4);
    expect(v.magnitude()).toBe(5);
  });

  test('should normalize correctly', () => {
    const v = new Vec2(3, 4);
    const normalized = v.normalize();
    expect(Math.abs(normalized.magnitude() - 1)).toBeLessThan(0.0001);
  });
});

describe('PerlinNoise', () => {
  test('should generate deterministic noise', () => {
    const noise1 = new PerlinNoise(12345);
    const noise2 = new PerlinNoise(12345);
    
    const value1 = noise1.noise2D(1, 1);
    const value2 = noise2.noise2D(1, 1);
    
    expect(value1).toBe(value2);
  });

  test('should generate different values for different inputs', () => {
    const noise = new PerlinNoise(12345);
    
    const value1 = noise.noise2D(1, 1);
    const value2 = noise.noise2D(2, 2);
    
    expect(value1).not.toBe(value2);
  });

  test('should generate values in reasonable range', () => {
    const noise = new PerlinNoise();
    
    for (let i = 0; i < 100; i++) {
      const value = noise.noise2D(i * 0.1, i * 0.1);
      expect(value).toBeGreaterThan(-2);
      expect(value).toBeLessThan(2);
    }
  });
});

describe('GeneratorRegistry', () => {
  let registry: GeneratorRegistry;

  beforeEach(() => {
    registry = new GeneratorRegistry();
  });

  test('should register and retrieve generators', () => {
    // Create a mock generator
    class MockGenerator extends Generator {
      constructor() {
        super('Test Generator', 'A test generator');
      }
      
      protected generateFeatures() {
        return { test: 'feature' };
      }
      
      protected render() {
        // Mock render
      }
    }

    const mockGen = new MockGenerator();
    registry.register(mockGen);
    
    expect(registry.has('Test Generator')).toBe(true);
    expect(registry.get('Test Generator')).toBe(mockGen);
    expect(registry.getNames()).toContain('Test Generator');
  });
});