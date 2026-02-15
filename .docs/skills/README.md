# Moot Skills Tracker

> Track implementation progress across all 42 skills.

---

## Phase 0: Foundation

- [x] **Skill 1** — Moot Configuration · `config/moot.php`, `.env.example`
- [x] **Skill 2** — Enums · `app/Enums/ConsultationMode.php`, `MessageStatus.php`, `SynthesisFormat.php`
- [ ] **Skill 3** — Database Migrations · `database/migrations/` (threads, messages, advisor_responses)
- [ ] **Skill 4** — Eloquent Models · `app/Models/Thread.php`, `Message.php`, `AdvisorResponse.php`
- [ ] **Skill 5** — Factories & Seeders · `database/factories/`, `DatabaseSeeder.php`
- [x] **Skill 6** — Laravel AI SDK · `laravel/ai` v0.1.5 installed

## Phase 1: Design System

- [ ] **Skill 7** — Earth-Tone Theme & JetBrains Mono · `resources/css/app.css`, `app.blade.php`
- [ ] **Skill 8** — Provider Color Utility & Badge · `resources/js/lib/providers.ts`, `provider-badge.tsx`

## Phase 2: Backend Core

- [ ] **Skill 9** — AI Advisor Agents · `app/Ai/Agents/` (Claude, GPT, Gemini, Registry)
- [ ] **Skill 10** — Synthesizer Agent · `app/Ai/Agents/Synthesizer.php`
- [ ] **Skill 11** — Broadcasting Events & Reverb · `app/Events/`, `routes/channels.php`
- [ ] **Skill 12** — DispatchAdvisors Job · `app/Jobs/DispatchAdvisors.php`
- [ ] **Skill 13** — Thread Controller & API Routes · `routes/api.php`, `ThreadController.php`
- [ ] **Skill 14** — Message Controller · `MessageController.php`
- [ ] **Skill 15** — Inertia Web Routes · `routes/moot.php`, `MootController.php`

## Phase 3: Frontend Core

- [ ] **Skill 16** — TypeScript Types · `resources/js/types/moot.ts`
- [ ] **Skill 17** — Moot Layout & Sidebar Nav · `moot-layout.tsx`, `app-sidebar.tsx`
- [ ] **Skill 18** — Chat Input Component · `chat-input.tsx`
- [ ] **Skill 19** — Advisor Card Component · `advisor-card.tsx`
- [ ] **Skill 20** — Synthesis Panel Component · `synthesis-panel.tsx`
- [ ] **Skill 21** — Conversation Thread Component · `conversation-thread.tsx`
- [ ] **Skill 22** — Provider Selector Component · `provider-selector.tsx`
- [ ] **Skill 23** — Moot Pages (Index & Show) · `pages/moot/index.tsx`, `show.tsx`

## Phase 4: Real-Time

- [ ] **Skill 24** — Laravel Echo + Reverb Frontend · `resources/js/lib/echo.ts`
- [ ] **Skill 25** — useMoot Hook · `resources/js/hooks/use-moot.ts`
- [ ] **Skill 26** — Wire Real-Time into Show Page

## Phase 5: Multi-Turn

- [ ] **Skill 27** — Conversation History in Agent Prompts
- [ ] **Skill 28** — Thread Sidebar (Full) · `thread-sidebar.tsx`
- [ ] **Skill 29** — Collapsed/Expanded Cards

## Phase 6: Configuration & Polish

- [ ] **Skill 30** — Synthesis Format Toggle
- [ ] **Skill 31** — Provider Config Popover · `provider-config-popover.tsx`
- [ ] **Skill 32** — Cost Tracking Display · `message-footer.tsx`
- [ ] **Skill 33** — `moot:install` Artisan Command · `MootInstall.php`
- [ ] **Skill 34** — `moot:ask` Artisan Command · `MootAsk.php`
- [ ] **Skill 35** — Redis Queue Config
- [ ] **Skill 36** — Counselors CLI Integration · `RunCounselorsCli.php`
- [ ] **Skill 37** — Error Handling UI · `error-banner.tsx`

## Phase 7: Distribution

- [ ] **Skill 38** — Export Thread as Markdown · `ThreadExportController.php`
- [ ] **Skill 39** — Docker Compose · `docker-compose.yml`
- [ ] **Skill 40** — Keyboard Shortcuts · `use-keyboard-shortcuts.ts`
- [ ] **Skill 41** — Test Suite · `tests/Feature/`, `tests/Unit/`
- [ ] **Skill 42** — README & Documentation · `README.md`, `CONTRIBUTING.md`
