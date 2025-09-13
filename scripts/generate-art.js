#!/usr/bin/env node

/**
 * Art Generation Script
 * 
 * Generates artwork using available algorithms
 */

import { registry, generate, generateWithParameters } from '../src/index.js';
import fs from 'fs';
import path from 'path';

// Ensure output directory exists
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Generate single artwork
 */
function generateSingle(seed, algorithm = 'Perlin Flow Field', parameters = {}) {
  try {
    console.log(`Generating artwork with seed: ${seed}, algorithm: ${algorithm}`);
    
    const result = generateWithParameters(seed, algorithm, parameters);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `artwork-${algorithm.replace(/\s+/g, '-')}-${seed}-${timestamp}.png`;
    const filepath = path.join(outputDir, filename);
    
    // Convert canvas to buffer and save
    const canvas = result.canvas;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);
    
    console.log(`Artwork saved to: ${filepath}`);
    console.log('Features:', result.features);
    
    return filepath;
  } catch (error) {
    console.error('Error generating artwork:', error.message);
    process.exit(1);
  }
}

/**
 * Generate batch of artworks
 */
function generateBatch(count = 5, algorithm = 'Perlin Flow Field') {
  console.log(`Generating batch of ${count} artworks...`);
  
  const results = [];
  for (let i = 0; i < count; i++) {
    const seed = `batch-${Date.now()}-${i}`;
    const filepath = generateSingle(seed, algorithm);
    results.push({ seed, filepath });
  }
  
  console.log(`Batch generation complete. Generated ${results.length} artworks.`);
  return results;
}

/**
 * List available algorithms
 */
function listAlgorithms() {
  console.log('Available algorithms:');
  registry.getAll().forEach(generator => {
    const info = generator.getInfo();
    console.log(`- ${info.name}: ${info.description}`);
  });
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'single':
    const seed = args[1] || `single-${Date.now()}`;
    const algorithm = args[2] || 'Perlin Flow Field';
    generateSingle(seed, algorithm);
    break;
    
  case 'batch':
    const count = parseInt(args[1]) || 5;
    const batchAlgorithm = args[2] || 'Perlin Flow Field';
    generateBatch(count, batchAlgorithm);
    break;
    
  case 'list':
    listAlgorithms();
    break;
    
  default:
    console.log('Usage:');
    console.log('  node scripts/generate-art.js single [seed] [algorithm]');
    console.log('  node scripts/generate-art.js batch [count] [algorithm]');
    console.log('  node scripts/generate-art.js list');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/generate-art.js single "my-unique-seed"');
    console.log('  node scripts/generate-art.js batch 10');
    console.log('  node scripts/generate-art.js list');
}