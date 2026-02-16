# Moot — Product Requirements Document

> **moot** _(noun)_ — An Anglo-Saxon assembly of wise advisors convened to deliberate and render judgment. Also means "debatable" — perfect for a tool that lets AI models debate your questions.

**Version:** 0.1.0-alpha
**Date:** February 15, 2026
**Status:** Pre-release
**Repository:** `github.com/[your-handle]/moot`
**License:** MIT

---

## 1. What Is Moot?

Moot is an open-source Laravel 12 application that fans out your prompts to multiple AI providers simultaneously, presents their responses side-by-side, and synthesizes a unified recommendation. It supports persistent multi-turn conversations, letting you drill deeper with your council of AI advisors across sessions.

Built on the **Laravel AI SDK** (`laravel/ai`, released February 5, 2026).

### The Problem

Every AI provider has blind spots. Claude excels at nuanced analysis, GPT at practical implementation, Gemini at cross-ecosystem breadth. Today, getting multiple perspectives means manually copying prompts between tabs, losing context, and mentally synthesizing the results yourself.

### The Solution

Moot automates the entire workflow: one prompt, multiple advisors, real-time streaming responses, and an AI-generated synthesis that identifies consensus, highlights disagreements, and recommends next steps — all within a persistent conversation you can continue over time.

### Why Now?

The Laravel AI SDK shipped on February 5, 2026. It provides a unified, first-party interface for Anthropic, OpenAI, Gemini, and more. No one has built a multi-agent fan-out application on it yet. Moot is the first.

---

## 2. Competitive Landscape

| Tool | Multi-Provider | Fan-Out | Synthesis | Open Source | Laravel | Multi-Turn |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Moot** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| laravel/larachat | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| LibreChat | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| MultipleChat | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| LMSYS Chatbot Arena | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| LarAgent | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| pushpak1300/ai-chat | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |

**Moot is the only open-source, Laravel-native tool that combines fan-out, synthesis, and multi-turn conversations.**

---

## 3. Goals

### Primary

1. Ship a working multi-agent fan-out application with synthesis on the Laravel AI SDK
2. Support persistent multi-turn conversations where users can drill deeper with their council
3. Become the reference application for the Laravel AI SDK ecosystem

### Secondary

4. Provide a foundation others can extend (custom agents, providers, synthesis strategies)
5. Showcase modern Laravel 12 patterns: AI SDK agents, Concurrency, Reverb broadcasting, queues
6. Provide a foundation others can extend (custom agents, providers, synthesis strategies)

### Non-Goals

- Not a production SaaS (no billing, teams, or multi-tenancy)
- Not a model benchmarking or blind comparison tool
- Not a general-purpose chat application

---

## 4. Architecture

```
User submits prompt (or follow-up)
        │
        ▼
┌────────────────────┐
│   Laravel Backend   │
│                     │
│  ┌───────────────┐  │     ┌──────────────┐
│  │ AI SDK Agents ├──┼────►│  Anthropic    │
│  │               ├──┼────►│  OpenAI       │
│  │               ├──┼────►│  Gemini       │
│  └───────────────┘  │     └──────────────┘
│                     │
│  Synthesizer Agent  │◄── Reads all responses,
│  (markdown or JSON) │    produces unified
│                     │    recommendation
└─────────┬──────────┘
          │
          ▼
    React Frontend
    (real-time via Reverb)
    (persistent threads)
```

### Request Flow

1. User submits prompt (new thread or follow-up) via React UI → `POST /api/threads/{id}/messages`
2. `MessageController` creates a `Message` record within the `Thread`
3. `DispatchAdvisors` job is queued
4. Job fans out to selected agents using `Illuminate\Support\Facades\Concurrency`
5. Each agent receives the full conversation history via `RemembersConversations`
6. Each response is saved as an `AdvisorResponse` and broadcast via Reverb
7. After all agents respond, the Synthesizer produces a summary (markdown or structured JSON)
8. `MootCompleted` event is broadcast; React UI updates in real-time
9. User can continue the conversation — all agents retain context

---

## 5. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Laravel 12.x |
| AI | Laravel AI SDK (`laravel/ai`) beta |
| Frontend | React 19 + Inertia.js (Laravel starter kit) |
| Styling | Tailwind CSS |
| Typography | JetBrains Mono (monospace throughout) |
| WebSockets | Laravel Reverb |
| Queue | Redis + Laravel Horizon |
| Database | SQLite (dev) / PostgreSQL (prod) |
| CLI | Laravel Prompts (bundled with Laravel 12) |

---

## 6. Design System

### Visual Identity

Earth-tone light theme inspired by Claude Code's aesthetic. Monospace typography throughout. **Light mode only** — no dark theme toggle.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F5EFE6` warm cream | Page background |
| Sidebar | `#EDEADF` | Navigation panel |
| Card | `#ECE5D9` | Advisor response cards |
| Primary | `#C15F3C` rust-orange | Actions, links, active states |
| Secondary | `#5A7A50` muted olive | Success, confirmations |
| Accent | `#8A7252` warm clay | Borders, muted text |
| Foreground | `#2C2418` espresso | Body text |

### Provider Colors

| Provider | Color | Pill Label |
|----------|-------|-----------|
| Anthropic | `#D97706` amber | ANT |
| OpenAI | `#10B981` emerald | OAI |
| Gemini | `#3B82F6` blue | GEM |

### Typography

All text uses **JetBrains Mono**. Headings at 600 weight with tight letter-spacing. Body at 400 weight with relaxed line-height. Code blocks use the same font at a slightly smaller size with a warm-tinted background.

---

## 7. Data Model

### Multi-Turn Conversation Architecture

The data model supports persistent, multi-turn conversations. Each thread can contain many messages, and each message fans out to multiple advisors.

```
Thread (1) ──► (N) Message (1) ──► (N) AdvisorResponse
                                  (1) ──► (0-1) Synthesis
```

### `threads`

| Column | Type | Description |
|--------|------|-------------|
| `id` | ulid | Primary key |
| `user_id` | foreignId | Owner |
| `title` | string, nullable | Auto-generated from first prompt |
| `mode` | enum(quick, code) | Dispatch method |
| `providers` | json | Array of provider keys |
| `provider_config` | json, nullable | Per-provider overrides (model, temperature) |
| `context_paths` | json, nullable | Reserved for future use |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### `messages`

| Column | Type | Description |
|--------|------|-------------|
| `id` | ulid | Primary key |
| `thread_id` | foreignId | Parent thread |
| `role` | enum(user, system) | Who sent it |
| `content` | text | The prompt or system message |
| `status` | enum(pending, running, synthesizing, completed, failed) | Current state |
| `synthesis` | text, nullable | Synthesized summary (markdown) |
| `synthesis_structured` | json, nullable | Structured output (when toggled) |
| `synthesis_format` | enum(markdown, structured) | Which format was requested |
| `created_at` | timestamp | |

### `advisor_responses`

| Column | Type | Description |
|--------|------|-------------|
| `id` | ulid | Primary key |
| `message_id` | foreignId | Parent message |
| `provider` | string | Provider key |
| `model` | string, nullable | Specific model used |
| `content` | text, nullable | Advisor's response |
| `error` | text, nullable | Error message if failed |
| `duration_ms` | integer, nullable | Response time |
| `tokens_used` | integer, nullable | Token count |
| `input_tokens` | integer, nullable | Prompt tokens |
| `output_tokens` | integer, nullable | Completion tokens |
| `estimated_cost` | decimal(8,6), nullable | Estimated USD cost |
| `created_at` | timestamp | |

---

## 8. File Structure

```
moot/
├── app/
│   ├── Ai/
│   │   ├── Agents/
│   │   │   ├── ClaudeAdvisor.php
│   │   │   ├── GptAdvisor.php
│   │   │   ├── GeminiAdvisor.php
│   │   │   └── Synthesizer.php
│   │   └── Middleware/
│   │       └── InjectProjectContext.php
│   ├── Models/
│   │   ├── Thread.php
│   │   ├── Message.php
│   │   └── AdvisorResponse.php
│   ├── Http/Controllers/Api/
│   │   ├── ThreadController.php
│   │   └── MessageController.php
│   ├── Jobs/
│   │   └── DispatchAdvisors.php
│   ├── Events/
│   │   ├── AdvisorResponded.php
│   │   └── MootCompleted.php
│   ├── Enums/
│   │   ├── ConsultationMode.php
│   │   ├── MessageStatus.php
│   │   └── SynthesisFormat.php
│   ├── Console/Commands/
│   │   ├── MootInstall.php
│   │   └── MootAsk.php
│   └── Mcp/                            # v1.0
│       ├── Servers/
│       │   └── MootServer.php
│       └── Tools/
│           └── ConsultMootTool.php
│
├── config/
│   └── moot.php
│
├── database/migrations/
│   ├── 0001_create_threads_table.php
│   ├── 0002_create_messages_table.php
│   └── 0003_create_advisor_responses_table.php
│
├── resources/js/
│   ├── components/
│   │   ├── ChatInput.jsx
│   │   ├── AdvisorCard.jsx
│   │   ├── SynthesisPanel.jsx
│   │   ├── ProviderSelector.jsx
│   │   ├── ProviderConfigModal.jsx
│   │   ├── ThreadSidebar.jsx
│   │   └── ConversationThread.jsx
│   ├── hooks/
│   │   └── useMoot.js
│   ├── layouts/
│   │   └── AppLayout.jsx
│   └── pages/
│       └── Moot.jsx
│
├── resources/css/
│   └── app.css
│
├── routes/
│   ├── api.php
│   └── ai.php                          # MCP server routes (v1.0)
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 9. API Endpoints

### Threads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/threads` | List user's threads (paginated) |
| `POST` | `/api/threads` | Create new thread |
| `GET` | `/api/threads/{id}` | Get thread with messages and responses |
| `PATCH` | `/api/threads/{id}` | Update thread settings (providers, config) |
| `DELETE` | `/api/threads/{id}` | Delete thread |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/threads/{id}/messages` | Send message + dispatch advisors |
| `GET` | `/api/threads/{id}/messages` | Get all messages in thread |

### POST /api/threads (Create)

```json
{
  "prompt": "What's the best auth approach for my Laravel + React SPA?",
  "mode": "quick",
  "providers": ["anthropic", "openai", "gemini"],
  "provider_config": {
    "anthropic": { "model": "claude-sonnet-4-5-20250929", "temperature": 0.7 },
    "openai": { "model": "gpt-4o", "temperature": 0.7 },
    "gemini": { "model": "gemini-2.5-pro" }
  },
  "synthesis_format": "markdown"
}
```

### POST /api/threads/{id}/messages (Follow-Up)

```json
{
  "content": "Can you all elaborate on the CORS configuration specifically?",
  "synthesis_format": "markdown"
}
```

### WebSocket Events (Reverb)

| Event | Channel | Payload |
|-------|---------|---------|
| `AdvisorResponded` | `thread.{id}` | Single advisor response |
| `MootCompleted` | `thread.{id}` | Message with all responses + synthesis |

---

## 10. Core Features

### 10.1 Multi-Turn Conversations

Conversations persist across sessions. Each advisor retains full context of the thread via the AI SDK's `RemembersConversations` trait. Users see a threaded view: their prompt, then advisor cards, then synthesis, then their next prompt, and so on.

**UI layout for multi-turn:**

```
┌──────────────────────────────────────────────┐
│  THREAD SIDEBAR  │  CONVERSATION VIEW        │
│                  │                            │
│  ► Auth strategy │  [User prompt #1]          │
│    DB design     │                            │
│    API review    │  ┌─ Claude ──────────────┐  │
│                  │  │ Sanctum is best...    │  │
│                  │  └───────────────────────┘  │
│                  │  ┌─ GPT ─────────────────┐  │
│                  │  │ I'd go with JWT...    │  │
│                  │  └───────────────────────┘  │
│                  │  ┌─ Gemini ──────────────┐  │
│                  │  │ Three options...      │  │
│                  │  └───────────────────────┘  │
│                  │                            │
│                  │  ┌─ 🏛️ SYNTHESIS ─────────┐  │
│                  │  │ All agree on Sanctum  │  │
│                  │  └───────────────────────┘  │
│                  │                            │
│                  │  [User follow-up #2]       │
│                  │                            │
│                  │  ┌─ Claude ──────────────┐  │
│                  │  │ For CORS config...    │  │
│                  │  └───────────────────────┘  │
│                  │  ...                        │
│                  │                            │
│                  │  ┌─────────────────────┐   │
│                  │  │ Ask your Moot...     │   │
│                  │  └─────────────────────┘   │
└──────────────────────────────────────────────┘
```

Advisor cards are **collapsed by default** (showing provider name, model, response time) and expand on click to show the full response. This keeps the conversation scannable. The synthesis panel is always expanded.

### 10.2 Synthesis — Markdown + Structured Output Toggle

The Synthesizer agent produces two formats. **Markdown is the default.** A toggle in the synthesis panel header switches to structured output.

**Markdown mode** (default):
Free-form analysis following this structure:
1. **Consensus** — Where all advisors agree
2. **Key Differences** — Where they disagree and the trade-offs
3. **Recommendation** — Unified recommendation with reasoning
4. **Action Items** — Numbered next steps

**Structured mode** (toggle):
JSON schema output via the AI SDK's `HasStructuredOutput` interface:

```json
{
  "consensus": ["All recommend Sanctum for SPA auth"],
  "differences": [
    {
      "topic": "Token strategy",
      "positions": {
        "anthropic": "Cookie-based for same-domain",
        "openai": "JWT with refresh rotation",
        "gemini": "Start cookie, add JWT later"
      },
      "trade_off": "Cookies are simpler but less flexible for mobile"
    }
  ],
  "recommendation": "Start with Sanctum cookie-based auth",
  "confidence": 0.92,
  "action_items": [
    "Install Sanctum",
    "Configure session domain and CORS",
    "Add rate limiting to auth routes"
  ]
}
```

The structured format is useful for programmatic consumption, dashboards, or piping into other tools. The toggle is per-message, not per-thread.

### 10.3 Custom Provider Configuration

Users can customize model, temperature, and max tokens per provider. The UI uses a **gear icon** on each provider pill that opens a compact settings popover — not a full modal. Settings persist for the thread but can be changed between messages.

**UI: Provider pill with config**

```
┌──────────────────────────────┐
│ [🧠 Claude ⚙️] [⚡ GPT ⚙️] [✨ Gemini ⚙️]  │
└──────────────────────────────┘
         │
         ▼ (click ⚙️)
    ┌─────────────────────┐
    │ Model               │
    │ [claude-sonnet-4-5 ▼] │
    │                     │
    │ Temperature    0.7  │
    │ ──●──────────────── │
    │                     │
    │ Max tokens   4096   │
    │ ────────────●────── │
    └─────────────────────┘
```

Available models are pulled from `config/moot.php` and validated against the AI SDK's supported models.

### 10.4 Cost Tracking

Each advisor response tracks token usage and estimated cost. A subtle cost indicator appears in the message footer after completion:

```
⚡ Quick Moot · 3 advisors · 2.1s avg · ~$0.034 total
```

Cost estimates use configurable per-token pricing in `config/moot.php`. This is informational only — Moot does not manage billing.

### 10.5 Export

Users can export any thread as a Markdown file. The export includes all prompts, all advisor responses, and all syntheses in a clean, readable format. Accessible via a download button in the thread header.

### 10.6 Artisan Commands (Laravel Prompts)

**`php artisan moot:install`** — Interactive setup wizard using Laravel Prompts. Walks through provider selection, API key entry, and migration running.

**`php artisan moot:ask`** — CLI-based consultation. Prompts for a question, selects providers, shows a spinner while advisors deliberate, then outputs a formatted table of responses and the synthesis.

---

## 11. AI SDK Agent Design

### Advisor Agents

Each provider gets a dedicated Agent class. All implement `Conversational` via `RemembersConversations` so multi-turn context is automatic.

```php
class ClaudeAdvisor implements Agent, Conversational
{
    use Promptable, RemembersConversations;

    public function instructions(): string
    {
        return 'You are a senior technical advisor. Provide thoughtful, '
             . 'nuanced analysis. When you disagree with conventional '
             . 'wisdom, explain why. Always consider edge cases.';
    }

    public function provider(): string
    {
        return Lab::Anthropic->value;
    }
}
```

### Synthesizer Agent

The Synthesizer reads all advisor responses and produces either markdown or structured output depending on the user's toggle.

```php
class Synthesizer implements Agent, HasStructuredOutput
{
    use Promptable;

    public function __construct(
        protected Message $message,
        protected SynthesisFormat $format,
    ) {}

    // Structured output schema (used when format is 'structured')
    public function schema(JsonSchema $schema): array
    {
        return [
            'consensus'    => $schema->array()->items($schema->string())->required(),
            'differences'  => $schema->array()->items($schema->object([
                'topic'     => $schema->string()->required(),
                'positions' => $schema->object()->required(),
                'trade_off' => $schema->string()->required(),
            ]))->required(),
            'recommendation' => $schema->string()->required(),
            'confidence'     => $schema->number()->min(0)->max(1)->required(),
            'action_items'   => $schema->array()->items($schema->string())->required(),
        ];
    }
}
```

### Fan-Out with Concurrency

```php
// In DispatchAdvisors job
Concurrency::run([
    'anthropic' => fn () => $this->runAgent('anthropic', new ClaudeAdvisor(), $prompt),
    'openai'    => fn () => $this->runAgent('openai', new GptAdvisor(), $prompt),
    'gemini'    => fn () => $this->runAgent('gemini', new GeminiAdvisor(), $prompt),
]);
```

---

## 12. Configuration

### config/moot.php

```php
return [
    // Defaults
    'default_providers' => ['anthropic', 'openai', 'gemini'],
    'default_synthesis_format' => 'markdown', // or 'structured'

    // Provider display metadata
    'providers' => [
        'quick' => [
            'anthropic' => [
                'label'   => 'Claude',
                'color'   => '#D97706',
                'models'  => ['claude-sonnet-4-5-20250929', 'claude-haiku-4-5-20251001'],
                'default_model' => 'claude-sonnet-4-5-20250929',
            ],
            'openai' => [
                'label'   => 'GPT',
                'color'   => '#10B981',
                'models'  => ['gpt-4o', 'gpt-4o-mini'],
                'default_model' => 'gpt-4o',
            ],
            'gemini' => [
                'label'   => 'Gemini',
                'color'   => '#3B82F6',
                'models'  => ['gemini-2.5-pro', 'gemini-2.5-flash'],
                'default_model' => 'gemini-2.5-pro',
            ],
        ],
    ],

    // Cost tracking (USD per 1M tokens)
    'pricing' => [
        'claude-sonnet-4-5-20250929' => ['input' => 3.00, 'output' => 15.00],
        'claude-haiku-4-5-20251001'  => ['input' => 0.80, 'output' => 4.00],
        'gpt-4o'                     => ['input' => 2.50, 'output' => 10.00],
        'gpt-4o-mini'                => ['input' => 0.15, 'output' => 0.60],
        'gemini-2.5-pro'             => ['input' => 1.25, 'output' => 10.00],
        'gemini-2.5-flash'           => ['input' => 0.15, 'output' => 0.60],
    ],

    // Timeouts
    'agent_timeout'     => env('MOOT_AGENT_TIMEOUT', 120),
    'synthesis_timeout' => env('MOOT_SYNTHESIS_TIMEOUT', 60),
];
```

### .env

```env
# AI Providers (add whichever you have)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=

# Broadcasting
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=moot
REVERB_APP_KEY=your-key
REVERB_APP_SECRET=your-secret

# Queue
QUEUE_CONNECTION=redis

# Moot
MOOT_AGENT_TIMEOUT=120
MOOT_SYNTHESIS_TIMEOUT=60
```

---

## 13. Installation

### Quick Start

```bash
git clone https://github.com/[handle]/moot.git && cd moot
composer install && npm install
cp .env.example .env
php artisan key:generate

# Interactive setup — walks through provider keys and config
php artisan moot:install

php artisan migrate
npm run dev
```

### Docker Compose (One Command)

```bash
git clone https://github.com/[handle]/moot.git && cd moot
cp .env.example .env
# Add your API keys to .env
docker compose up -d
# Visit http://localhost:8000
```

#### docker-compose.yml Services

| Service | Purpose |
|---------|---------|
| `app` | PHP 8.3 + Laravel (serves the application) |
| `queue` | `php artisan queue:work` (processes advisor jobs) |
| `reverb` | `php artisan reverb:start` (WebSocket server) |
| `redis` | Queue, cache, broadcasting backend |
| `node` | Vite dev server (dev only) |

### Manual (4 Terminals)

```bash
php artisan serve          # Terminal 1: App server
php artisan queue:work     # Terminal 2: Queue worker
php artisan reverb:start   # Terminal 3: WebSocket server
npm run dev                # Terminal 4: Vite
```

---

## 14. MCP Server Integration (v1.0)

**Recommendation: Yes, include as a v1.0 feature.**

Moot's core capability — multi-provider fan-out with synthesis — is exactly the kind of compound tool that other AI agents benefit from calling. With `laravel/mcp` at 7M+ installs and being first-party, the integration cost is low.

### Use Case

A developer using Claude Code, Cursor, or any MCP-compatible agent types:

> *"Ask moot whether I should use Sanctum or Passport for this project's auth."*

The agent calls Moot's MCP tool, which fans out to all configured providers, synthesizes the result, and returns a structured answer — all without the developer leaving their IDE.

### Implementation

```php
// app/Mcp/Tools/ConsultMootTool.php
class ConsultMootTool extends Tool
{
    public function description(): string
    {
        return 'Consult multiple AI advisors simultaneously and get '
             . 'a synthesized recommendation. Use for architecture '
             . 'decisions, code review, or any question that benefits '
             . 'from multiple perspectives.';
    }

    public function handle(Request $request): Response
    {
        $thread = Thread::create([...]);
        $message = $thread->messages()->create([
            'content' => $request['prompt'],
        ]);

        DispatchAdvisors::dispatchSync($message);

        return Response::text($message->fresh()->synthesis);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'prompt'    => $schema->string()->required(),
            'providers' => $schema->array()->items($schema->string()),
            'format'    => $schema->string()->enum(['markdown', 'structured']),
        ];
    }
}
```

### Registration

```php
// routes/ai.php
Mcp::web('/mcp', MootServer::class)->middleware('auth:sanctum');
```

This gives Moot the "three interfaces" pattern Laravel advocates: **web UI**, **JSON API**, and **MCP server**.

---

## 15. Milestones

### v0.1 — Foundation (Current)

- [x] Project scaffold (agents, models, migrations, controllers, React components)
- [x] AI SDK agent classes (Claude, GPT, Gemini, Synthesizer)
- [x] DispatchAdvisors job with Concurrency fan-out
- [x] Reverb broadcasting events
- [x] React UI with mock data
- [x] Earth-tone light theme with JetBrains Mono
- [x] PRD with all decisions documented
- [ ] Rename "Council" → "Moot" across entire codebase
- [ ] Refactor data model from single consultations to threaded conversations
- [ ] Wire React UI to real API endpoints
- [ ] Replace polling with streaming (Reverb + `useStream`)
- [ ] End-to-end test with at least 2 providers

### v0.2 — Multi-Turn + Config

- [ ] Persistent multi-turn conversations with `RemembersConversations`
- [ ] Thread sidebar with conversation history
- [ ] Collapsed/expanded advisor cards in conversation view
- [ ] Synthesis format toggle (markdown ↔ structured)
- [ ] Per-provider configuration popover (model, temperature, max tokens)
- [ ] Cost tracking and display
- [ ] `php artisan moot:install` with Laravel Prompts
- [ ] `php artisan moot:ask` CLI command

### v0.3 — Polish + Distribution

- [ ] Docker Compose with all services
- [ ] Export thread as Markdown
- [ ] Error handling UI (timeout, rate limit, invalid key)
- [ ] Keyboard shortcuts (⌘+Enter to send, ⌘+N new thread, etc.)
- [ ] README with screenshots and animated GIF demo

### v0.4 — Ecosystem

- [ ] Additional providers: xAI (Grok), DeepSeek, Mistral, Ollama (local)
- [ ] Custom agent persona templates (security auditor, code reviewer, architect)
- [ ] Thread search and filtering
- [ ] Publish to Packagist as `moot/moot`

### v1.0 — Stable

- [ ] MCP server integration (`ConsultMootTool`)
- [ ] Comprehensive test suite (Feature + Unit + Dusk)
- [ ] CI/CD pipeline
- [ ] Full documentation site
- [ ] AI SDK streaming support (when SDK graduates from beta)
- [ ] Plugin system for custom synthesis strategies

---

## 16. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI SDK breaking changes (still beta) | High | High | Pin version, monitor changelog, isolate SDK calls behind interfaces |
| Multi-turn context window overflow | Medium | Medium | Truncate oldest messages, track token counts, warn user |
| High API costs from parallel fan-out | Medium | Medium | Cost tracking in UI, per-provider model selection, budget alerts |
| Rate limiting from parallel calls | Medium | Medium | Configurable concurrency limit, per-provider backoff, queue throttling |
| Provider pricing changes | High | Low | Pricing config is user-editable, not hardcoded business logic |

---

## 17. Success Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| GitHub stars | 500+ | 3 months |
| Time to first Moot (from `git clone`) | < 5 minutes | v0.2 |
| Working demo GIF in README | Ship with v0.1 | v0.1 |
| Provider support | 6+ | v0.4 |
| External contributions | 10+ PRs | 6 months |
| Packagist installs | 1,000+ | 6 months |

---

## 18. Decisions Log

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Multi-turn conversations? | **Yes** | Users need to drill deeper. Single-prompt limits utility. AI SDK's `RemembersConversations` makes this straightforward. |
| 2 | Synthesis format? | **Both — markdown default, structured toggle** | Markdown is readable for humans. Structured JSON is useful for programmatic consumption and downstream tooling. Toggle gives users control without complexity. |
| 3 | Blind comparison mode? | **No** | Not building a benchmark tool. Moot's value is synthesis, not evaluation. |
| 4 | Custom provider configs? | **Yes** | Different questions benefit from different models and temperatures. Gear icon popover keeps UI clean. Settings persist per-thread. |
| 5 | MCP server? | **Yes, at v1.0** | Moot's fan-out + synthesis is a natural compound tool for other agents. Low integration cost with first-party `laravel/mcp`. Follows Laravel's "three interfaces" pattern. |
| 6 | Name? | **Moot** | No namespace conflicts in AI or Laravel ecosystems. Anglo-Saxon "assembly of advisors" + "debatable" double meaning. 4 letters, CLI-friendly: `php artisan moot:ask`. |
| 7 | CLI framework? | **Laravel Prompts** | First-party, bundled with Laravel 12. Beautiful interactive forms for `moot:install` setup wizard. |
| 8 | Theme? | **Earth-tone light, JetBrains Mono** | Claude Code-inspired aesthetic. Warm, professional, distinctive. No dark mode toggle. |

---

*Moot — because every important decision deserves more than one perspective.*
