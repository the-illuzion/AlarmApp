# Contributing to AlarmApp

Thank you for your interest in contributing to AlarmApp! This document provides guidelines for contributing to the project.

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the issue has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment info (OS, React Native version, etc.)

### Suggesting Features

1. Check existing [Issues](../../issues) for similar requests
2. Create a new issue with:
   - Feature description
   - Use case
   - Benefits

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "Add feature: description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Coding Standards

### JavaScript/TypeScript

- Use TypeScript for new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive variable/function names
- Add JSDoc comments for functions

### React Native

- Use functional components with hooks
- Follow React best practices
- Test on both Android and iOS

### Android (Kotlin/Java)

- Follow Kotlin coding conventions
- Use meaningful package names
- Handle permissions properly
- Test on multiple Android versions

### iOS (Swift/Objective-C)

- Follow Swift style guidelines
- Use meaningful class names
- Handle permissions properly

## Testing

- Write unit tests for new features
- Test UI components
- Test on physical devices when possible
- Ensure builds pass on CI/CD

## Commit Messages

Use clear, descriptive commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

## Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bugfix branches: `fix/bug-description`
- Release branches: `release/v1.0.0`

## Review Process

1. All PRs require review
2. Address review comments
3. Ensure CI passes
4. Squash commits if needed
5. Merge using "Squash and merge"

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Open an issue or contact the maintainers.
