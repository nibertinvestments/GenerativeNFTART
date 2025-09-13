# Copilot Instructions for Generative NFT Art Project

## Project Overview
This repository contains a comprehensive generative art engine designed to create unique NFT artwork using algorithmic approaches. The project follows industry best practices for code organization, data structures, and development workflows.

## Coding Best Practices

### Code Style and Standards
- **Language**: Primary development in JavaScript/TypeScript for web compatibility, with Python support for advanced algorithms
- **Formatting**: Use Prettier for JavaScript/TypeScript, Black for Python
- **Linting**: ESLint for JavaScript/TypeScript, flake8 for Python
- **Naming Conventions**:
  - Functions: camelCase (JavaScript) / snake_case (Python)
  - Classes: PascalCase
  - Constants: UPPER_SNAKE_CASE
  - Files: kebab-case for scripts, PascalCase for classes

### Data Structure Best Practices
- **Immutability**: Prefer immutable data structures where possible
- **Type Safety**: Use TypeScript interfaces and Python type hints
- **Memory Management**: Implement proper cleanup for large image data
- **Performance**: Use appropriate data structures (Maps for lookups, Sets for unique collections)

### Architecture Patterns
- **Modular Design**: Separate algorithms into distinct modules
- **Factory Pattern**: For creating different art generators
- **Strategy Pattern**: For interchangeable algorithms
- **Observer Pattern**: For real-time generation updates
- **Command Pattern**: For undoable operations

## Environment Best Practices

### Development Environment
- **Node.js**: v18+ for modern JavaScript features
- **Python**: 3.9+ for advanced mathematical operations
- **Package Management**: npm/yarn for JS, pip with virtual environments for Python
- **Version Control**: Git with conventional commits

### Environment Variables
```bash
# Development
NODE_ENV=development
PYTHON_ENV=development
LOG_LEVEL=debug

# Production
NODE_ENV=production
PYTHON_ENV=production
LOG_LEVEL=info
HIGHLIGHT_API_KEY=your_api_key_here
```

### Configuration Management
- Use environment-specific config files
- Separate secrets from code
- Implement configuration validation

## Directory Structure Best Practices

```
/
├── Copilot-instructions.md     # This file
├── README.md                   # Project documentation
├── LICENSE                     # MIT license
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js dependencies
├── requirements.txt            # Python dependencies
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
├── docs/                      # Documentation
│   ├── project-plan.md        # Comprehensive project plan
│   ├── deployment.md          # HIGHLIGHT.XYZ deployment guide
│   ├── api-reference.md       # API documentation
│   └── generative-art-research.md
├── src/                       # Source code
│   ├── core/                  # Core engine
│   │   ├── Canvas.ts          # Canvas abstraction
│   │   ├── Color.ts           # Color utilities
│   │   ├── Generator.ts       # Base generator class
│   │   └── index.ts          # Core exports
│   ├── algorithms/            # Art generation algorithms
│   │   ├── fractals/         # Fractal generators
│   │   ├── noise/            # Noise-based patterns
│   │   ├── cellular/         # Cellular automata
│   │   ├── flow-fields/      # Flow field algorithms
│   │   └── geometric/        # Geometric patterns
│   ├── utils/                 # Utility functions
│   │   ├── math.ts           # Mathematical utilities
│   │   ├── random.ts         # Random number generation
│   │   └── export.ts         # Export utilities
│   └── examples/              # Example implementations
├── assets/                    # Static assets
│   ├── palettes/             # Color palette definitions
│   └── templates/            # Art template configurations
├── output/                    # Generated artwork (gitignored)
├── tests/                     # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── __mocks__/           # Test mocks
├── config/                    # Configuration files
│   ├── development.json      # Development config
│   ├── production.json       # Production config
│   └── test.json            # Test config
└── scripts/                   # Build and utility scripts
    ├── build.js              # Build script
    ├── generate-art.js       # Art generation script
    └── deploy.js             # Deployment script
```

## Development Workflow

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install && pip install -r requirements.txt`
3. Set up environment variables
4. Run tests: `npm test`
5. Start development server: `npm run dev`

### Creating New Algorithms
1. Create algorithm file in appropriate `src/algorithms/` subdirectory
2. Implement the base `Generator` interface
3. Add comprehensive tests
4. Update documentation
5. Add example usage

### Code Quality Checks
- Run linter: `npm run lint`
- Run tests: `npm test`
- Check types: `npm run type-check`
- Format code: `npm run format`

## Art Generation Guidelines

### Algorithm Design
- **Deterministic**: Use seeded random number generators
- **Parameterizable**: Allow customization through configuration
- **Scalable**: Support multiple output resolutions
- **Exportable**: Generate standard image formats (PNG, SVG)

### Performance Considerations
- **Memory Usage**: Monitor memory for large canvases
- **Rendering Speed**: Optimize hot paths in generation loops
- **Batch Processing**: Support generating multiple variants
- **Progressive Rendering**: Show generation progress for long operations

### Quality Assurance
- **Visual Testing**: Automated screenshot comparison
- **Mathematical Validation**: Verify algorithm correctness
- **Performance Benchmarks**: Track generation speed
- **Cross-browser Testing**: Ensure web compatibility

## Deployment Best Practices

### HIGHLIGHT.XYZ Integration
- Follow HIGHLIGHT.XYZ documentation for code upload
- Ensure deterministic generation for consistent results
- Implement proper metadata generation
- Test with HIGHLIGHT.XYZ preview tools

### Version Management
- Use semantic versioning
- Tag releases appropriately
- Maintain changelog
- Document breaking changes

## Security Considerations

### Code Security
- Validate all inputs
- Sanitize user-provided seeds
- Avoid eval() and similar dynamic execution
- Use secure random number generation

### Deployment Security
- Never commit API keys
- Use environment variables for secrets
- Implement proper CORS policies
- Validate uploaded code before execution

## Contributing Guidelines

### Code Contributions
1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Add tests for new features
5. Update documentation
6. Submit pull request

### Bug Reports
- Use provided issue template
- Include reproduction steps
- Provide environment details
- Attach example outputs if applicable

## Resources and References

### Generative Art Resources
- "The Nature of Code" by Daniel Shiffman
- "Generative Design" by Hartmut Bohnacker
- P5.js documentation and examples
- Processing.org tutorials

### Technical Documentation
- Canvas API reference
- WebGL documentation
- Mathematical function libraries
- Color theory resources

### Community and Support
- GitHub Discussions for questions
- Issue tracker for bugs
- Wiki for additional documentation
- Discord/Slack for real-time discussion