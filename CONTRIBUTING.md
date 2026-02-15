# Contributing to Moot

Thank you for your interest in contributing to Moot!

## Development Setup

1. Fork and clone the repository
2. Run `composer install && npm install`
3. Copy `.env.example` to `.env` and configure API keys
4. Run `php artisan key:generate && php artisan migrate`
5. Start the dev server with `composer dev`

## Running Tests

```bash
# All tests
php artisan test

# Specific test file
php artisan test tests/Feature/Moot/ThreadTest.php

# With coverage
php artisan test --coverage
```

## Code Style

- **PHP:** Follow Laravel conventions. Run `./vendor/bin/pint` before committing.
- **TypeScript/React:** Run `npm run lint` and `npm run format` before committing.
- **Commits:** Use clear, descriptive commit messages. Focus on "why" not "what".

## Adding a New AI Provider

1. Create an agent class in `app/Ai/Agents/` implementing `Agent` and `Conversational`
2. Register it in `AdvisorRegistry::$agents`
3. Add provider metadata to `config/moot.php` under `providers.quick` and/or `providers.code`
4. Add color/label to `resources/js/lib/providers.ts`
5. Add pricing data to `config/moot.php` under `pricing`

## Pull Requests

- Create a feature branch from `main`
- Include tests for new functionality
- Ensure `php artisan test` and `npm run types` pass
- Keep PRs focused on a single change
