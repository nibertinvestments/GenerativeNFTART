/**
 * Main entry point for the Generative NFT Art project
 */

// Export core modules
export * from './core/Generator';
export * from './core/Color';

// Export utilities
export * from './utils/math';

// Export algorithms
export * from './algorithms/noise/PerlinFlowField';

// Re-export registry for convenience
export { registry as GeneratorRegistry } from './core/Generator';

// Initialize and register default generators
import { registry } from './core/Generator';
import { PerlinFlowFieldGenerator } from './algorithms/noise/PerlinFlowField';

// Register default generators
registry.register(new PerlinFlowFieldGenerator());

/**
 * Simple generation function for HIGHLIGHT.XYZ compatibility
 */
export function generate(seed: string, algorithmName: string = 'Perlin Flow Field'): HTMLCanvasElement {
  const generator = registry.get(algorithmName);
  if (!generator) {
    throw new Error(`Generator "${algorithmName}" not found`);
  }
  
  const result = generator.generate(seed);
  return result.canvas;
}

/**
 * Get available generators
 */
export function getAvailableGenerators(): string[] {
  return registry.getNames();
}

/**
 * Get generator information
 */
export function getGeneratorInfo(name: string) {
  const generator = registry.get(name);
  return generator ? generator.getInfo() : null;
}

/**
 * Generate with custom parameters
 */
export function generateWithParameters(
  seed: string,
  algorithmName: string,
  parameters: Record<string, any> = {},
  width: number = 1000,
  height: number = 1000
) {
  const generator = registry.get(algorithmName);
  if (!generator) {
    throw new Error(`Generator "${algorithmName}" not found`);
  }
  
  // Apply custom parameters
  Object.entries(parameters).forEach(([key, value]) => {
    generator.setParameter(key, value);
  });
  
  return generator.generate(seed, width, height);
}