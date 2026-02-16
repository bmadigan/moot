<p align="center">
  <img src="public/logo.png" alt="Moot" height="80">
</p>

<p align="center">
  An open-source Laravel application that fans out prompts to multiple AI providers, shows responses side-by-side, and synthesizes a unified recommendation.
</p>

## Features

- **Multi-Provider Consultation** — Send prompts to Claude, GPT, and Gemini simultaneously
- **Side-by-Side Responses** — Collapsible advisor cards with markdown rendering
- **AI Synthesis** — Unified analysis identifying consensus, differences, and actionable recommendations
- **Multi-Turn Conversations** — Follow-up messages with full conversation context per provider
- **Real-Time Updates** — WebSocket broadcasting via Laravel Reverb for live response streaming
- **Provider Configuration** — Per-provider model selection, temperature, and token limits
- **Cost Tracking** — Per-response and aggregate cost estimates
- **Export** — Download threads as formatted Markdown files
- **CLI Interface** — `moot:ask` artisan command for terminal-based consultations

## Tech Stack

- **Backend:** Laravel 12, PHP 8.3, Laravel AI SDK (`laravel/ai`)
- **Frontend:** React 19, TypeScript, Inertia.js, Tailwind CSS 4
- **Real-Time:** Laravel Reverb, Laravel Echo
- **Auth:** Laravel Fortify (login, register, 2FA, password reset)
- **Components:** Radix UI primitives, Lucide icons
- **Queue:** Database (default), Redis (recommended for production)

## Requirements

- PHP 8.3+
- Node.js 20+
- Composer
- At least one AI provider API key (Anthropic, OpenAI, or Google)

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/moot.git
cd moot

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Interactive setup (API keys, queue, broadcasting)
php artisan moot:install

# Or manually configure .env with your API keys:
# ANTHROPIC_API_KEY=sk-ant-...
# OPENAI_API_KEY=sk-...
# GEMINI_API_KEY=...

# Run migrations
php artisan migrate

# Optional: seed demo data
php artisan db:seed

# Start the development server
composer dev
```

## Development

```bash
# Start all services (app, queue worker, Vite, Reverb)
composer dev

# Run tests
php artisan test

# Type check
npm run types

# Lint & format
npm run lint
npm run format
```

## CLI Usage

```bash
# Ask a question from the terminal
php artisan moot:ask "What is the best approach for database indexing?"

# Specify providers
php artisan moot:ask "Review this architecture" --providers=anthropic,openai

# Use structured synthesis
php artisan moot:ask "Compare REST vs GraphQL" --format=structured
```

## Docker

```bash
# Start with Docker Compose
docker compose up -d

# The app will be available at http://localhost:8000
```

## Architecture

```
app/
  Ai/
    Agents/          # AI advisor agents (Claude, GPT, Gemini, Synthesizer)
  Console/Commands/  # Artisan commands (moot:install, moot:ask)
  Enums/             # ConsultationMode, MessageStatus, SynthesisFormat
  Events/            # AdvisorResponded, MootCompleted (broadcast)
  Http/Controllers/  # Inertia + API controllers
  Jobs/              # DispatchAdvisors (concurrent fan-out + synthesis)
  Models/            # Thread, Message, AdvisorResponse
  Policies/          # ThreadPolicy (ownership authorization)
config/
  moot.php           # Provider metadata, pricing, timeouts
resources/js/
  components/moot/   # React components (advisor cards, chat input, etc.)
  hooks/             # useMoot (real-time), useKeyboardShortcuts
  layouts/           # MootLayout (two-panel with thread sidebar)
  pages/moot/        # Index (new thread) and Show (conversation) pages
  types/             # TypeScript interfaces
```

## Configuration

Key settings in `config/moot.php`:

| Setting | Description | Default |
|---------|-------------|---------|
| `default_providers` | Providers used for new threads | `['anthropic', 'openai', 'gemini']` |
| `default_synthesis_format` | Synthesis output format | `'markdown'` |
| `agent_timeout` | Max seconds per advisor call | `120` |
| `synthesis_timeout` | Max seconds for synthesis | `60` |

## License

MIT
