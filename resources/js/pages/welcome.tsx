import { Head, Link, usePage } from '@inertiajs/react';
import { login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Moot — Assemble Your AI Council">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=bangers:400"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center">
                            <img src="/logo.png" alt="Moot" className="h-20" />
                        </Link>

                        <div className="flex items-center gap-3">
                            {(auth as { user: unknown }).user ? (
                                <Link
                                    href="/moot"
                                    className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
                                >
                                    Go to App
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
                                >
                                    Log in
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative overflow-hidden px-6 py-20 lg:py-32">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                                <span className="inline-block size-2 rounded-full bg-green-500" />
                                Open source &middot; Self-hosted &middot; Laravel 12
                            </div>

                            <h1
                                className="mb-6 text-6xl leading-none tracking-tight sm:text-7xl lg:text-8xl"
                                style={{ fontFamily: "'Bangers', cursive" }}
                            >
                                <span className="text-foreground">Stop Asking One AI.</span>
                                <br />
                                <span className="text-primary">Ask All of Them.</span>
                            </h1>

                            <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                                Moot sends your prompt to Claude, GPT, and Gemini simultaneously, shows their
                                responses side-by-side, then synthesizes a single recommendation that
                                identifies where they agree, where they differ, and what you should actually do.
                            </p>

                            <p className="mx-auto mb-10 max-w-xl text-sm text-muted-foreground/70">
                                Built on the Laravel AI SDK. Bring your own API keys. Deploy anywhere you run Laravel.
                            </p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {(auth as { user: unknown }).user ? (
                                    <Link
                                        href="/moot"
                                        className="inline-flex h-12 items-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                                    >
                                        Open Moot
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="inline-flex h-12 items-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                                        >
                                            Get Started Free
                                        </Link>
                                        <a
                                            href="https://github.com/bmadigan/moot"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-card px-8 text-base font-semibold text-foreground shadow-xs hover:bg-accent"
                                        >
                                            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            View on GitHub
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* App Screenshot */}
                        <div className="mx-auto mt-16 max-w-5xl">
                            <div className="overflow-hidden rounded-xl border border-border shadow-lg">
                                <img
                                    src="/screenshots/conversation.png"
                                    alt="Moot — side-by-side AI advisor responses with synthesis"
                                    className="w-full"
                                />
                            </div>
                            <p className="mt-3 text-center text-xs text-muted-foreground">
                                Fan out to multiple AI providers, get a synthesized recommendation
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Problem */}
                <section className="border-t border-border bg-card px-6 py-20 lg:py-28">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                                Every AI Has Blind Spots
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Claude excels at nuanced analysis. GPT shines at practical implementation.
                                Gemini brings cross-ecosystem breadth. Today, getting multiple perspectives means
                                manually copying prompts between tabs, losing context, and mentally synthesizing
                                the results yourself.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-6 sm:grid-cols-3">
                            <div className="rounded-xl border border-border bg-background p-6">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#D97706]/10">
                                    <svg className="size-6 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 font-semibold">Claude</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Nuanced reasoning, careful edge-case analysis, and thoughtful architectural recommendations.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-6">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#10B981]/10">
                                    <svg className="size-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 font-semibold">GPT</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Practical implementation focus, strong code generation, and broad training on common patterns.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-6">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#3B82F6]/10">
                                    <svg className="size-6 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.97.633-3.792 1.708-5.272" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 font-semibold">Gemini</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Cross-ecosystem breadth, multimodal capabilities, and deep integration with Google&apos;s knowledge graph.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="border-t border-border px-6 py-20 lg:py-28">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                                How Moot Works
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Ask once, hear from everyone. Moot automates the entire multi-model workflow.
                            </p>
                        </div>

                        <div className="grid gap-12 lg:grid-cols-4">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xl font-bold text-primary">
                                    1
                                </div>
                                <h3 className="mb-2 font-semibold">Ask Your Question</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Type your prompt once. Architecture decisions, code reviews, debugging — anything
                                    that benefits from multiple perspectives.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xl font-bold text-primary">
                                    2
                                </div>
                                <h3 className="mb-2 font-semibold">Fan Out to Advisors</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Moot dispatches your prompt to Claude, GPT, Gemini, and more simultaneously
                                    using Laravel&apos;s Concurrency facade.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xl font-bold text-primary">
                                    3
                                </div>
                                <h3 className="mb-2 font-semibold">Stream in Real-Time</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Watch responses arrive side-by-side via WebSockets (Laravel Reverb).
                                    Each advisor&apos;s answer appears as it streams in.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xl font-bold text-primary">
                                    4
                                </div>
                                <h3 className="mb-2 font-semibold">Get the Synthesis</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    A Synthesizer agent reads all responses, identifies consensus and disagreements,
                                    and delivers a unified recommendation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Helps */}
                <section className="border-t border-border bg-card px-6 py-20 lg:py-28">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                                One Prompt, Three Perspectives
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Ask your question once and get answers from Claude, GPT, and Gemini simultaneously,
                                then a synthesized recommendation that weighs all three perspectives.
                            </p>
                        </div>

                        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-background p-8">
                            <div className="flex flex-wrap justify-center gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm">
                                    <span className="size-2 rounded-full bg-[#D97706]" /> Claude
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm">
                                    <span className="size-2 rounded-full bg-[#10B981]" /> GPT
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm">
                                    <span className="size-2 rounded-full bg-[#3B82F6]" /> Gemini
                                </span>
                            </div>
                            <p className="mt-4 text-center text-sm text-muted-foreground">
                                Bring your own API keys. Select which providers to consult for each question.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Built With */}
                <section className="border-t border-border px-6 py-20 lg:py-28">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                                Built on the Laravel AI SDK
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Moot is the first multi-agent fan-out application built on{' '}
                                <code className="rounded bg-card px-1.5 py-0.5 text-[0.9em]">laravel/ai</code>,
                                Laravel&apos;s official AI SDK released February 5, 2026. It provides a unified,
                                first-party interface for Anthropic, OpenAI, Gemini, and more.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="mb-3 text-sm font-semibold text-primary">Laravel AI SDK</div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Native agent classes with <code className="rounded bg-background px-1 py-0.5 text-[0.85em]">Promptable</code>,{' '}
                                    <code className="rounded bg-background px-1 py-0.5 text-[0.85em]">RemembersConversations</code>,
                                    and <code className="rounded bg-background px-1 py-0.5 text-[0.85em]">HasStructuredOutput</code> for
                                    multi-turn context and structured synthesis.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="mb-3 text-sm font-semibold text-primary">Laravel Reverb</div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    First-party WebSocket server for real-time streaming. Watch advisor responses
                                    arrive side-by-side as they generate, with zero polling.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="mb-3 text-sm font-semibold text-primary">Concurrency Facade</div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Laravel&apos;s <code className="rounded bg-background px-1 py-0.5 text-[0.85em]">Concurrency::run()</code> fans
                                    out to all selected advisors simultaneously. No sequential bottlenecks.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="mb-3 text-sm font-semibold text-primary">Multi-Turn Threads</div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Persistent conversations across sessions. Ask a follow-up and every advisor
                                    retains the full context of the discussion. Drill deeper with your council.
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-6">
                                <div className="mb-3 text-sm font-semibold text-primary">Structured Output</div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Toggle between markdown and structured JSON synthesis. Get consensus, differences,
                                    confidence scores, and action items in a machine-readable format.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Moot */}
                <section className="border-t border-border bg-card px-6 py-20 lg:py-28">
                    <div className="mx-auto max-w-6xl">
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                                Why Moot Exists
                            </h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                The word &ldquo;moot&rdquo; comes from the Anglo-Saxon assembly of wise advisors
                                convened to deliberate and render judgment. It also means &ldquo;debatable&rdquo; —
                                perfect for a tool that lets AI models debate your questions.
                            </p>
                        </div>

                        <div className="mx-auto max-w-4xl">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 pr-4 font-semibold">Feature</th>
                                        <th className="pb-3 px-3 text-center font-semibold text-primary">Moot</th>
                                        <th className="pb-3 px-3 text-center font-semibold text-muted-foreground">Others</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 pr-4">Multi-provider fan-out</td>
                                        <td className="py-3 px-3 text-center text-primary">Yes</td>
                                        <td className="py-3 px-3 text-center">Rare</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 pr-4">AI-powered synthesis</td>
                                        <td className="py-3 px-3 text-center text-primary">Yes</td>
                                        <td className="py-3 px-3 text-center">No</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 pr-4">Multi-turn conversations</td>
                                        <td className="py-3 px-3 text-center text-primary">Yes</td>
                                        <td className="py-3 px-3 text-center">Some</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 pr-4">Open source + Laravel-native</td>
                                        <td className="py-3 px-3 text-center text-primary">Yes</td>
                                        <td className="py-3 px-3 text-center">Rare</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 pr-4">Real-time WebSocket streaming</td>
                                        <td className="py-3 px-3 text-center text-primary">Yes</td>
                                        <td className="py-3 px-3 text-center">Some</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-border bg-card px-6 py-20 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2
                            className="mb-4 text-4xl tracking-tight lg:text-5xl"
                            style={{ fontFamily: "'Bangers', cursive" }}
                        >
                            Every Important Decision Deserves
                            <br />
                            <span className="text-primary">More Than One Perspective</span>
                        </h2>
                        <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
                            Set up Moot in under 5 minutes. Bring your own API keys.
                            Open source, self-hosted, forever free.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {(auth as { user: unknown }).user ? (
                                <Link
                                    href="/moot"
                                    className="inline-flex h-12 items-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                                >
                                    Open Moot
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex h-12 items-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                                    >
                                        Get Started Free
                                    </Link>
                                    <a
                                        href="https://github.com/bmadigan/moot"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-background px-8 text-base font-semibold text-foreground shadow-xs hover:bg-accent"
                                    >
                                        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        Star on GitHub
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border px-6 py-8">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Moot" className="h-7" />
                            <span className="text-sm text-muted-foreground">
                                Open source, MIT licensed
                            </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <a
                                href="https://github.com/bradcush/moot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://laravel.com/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground"
                            >
                                Laravel Docs
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
