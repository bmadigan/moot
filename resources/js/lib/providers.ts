export const PROVIDER_COLORS: Record<string, string> = {
    anthropic: '#D97706',
    openai: '#10B981',
    gemini: '#3B82F6',
    claude_code: '#D97706',
    codex: '#10B981',
    gemini_cli: '#3B82F6',
    amp: '#8B5CF6',
};

export const PROVIDER_LABELS: Record<string, string> = {
    anthropic: 'Claude',
    openai: 'GPT',
    gemini: 'Gemini',
    claude_code: 'Claude Code',
    codex: 'Codex',
    gemini_cli: 'Gemini CLI',
    amp: 'Amp',
};

export const PROVIDER_SHORT_LABELS: Record<string, string> = {
    anthropic: 'ANT',
    openai: 'OAI',
    gemini: 'GEM',
    claude_code: 'CC',
    codex: 'CDX',
    gemini_cli: 'GCL',
    amp: 'AMP',
};

export function getProviderColor(provider: string): string {
    return PROVIDER_COLORS[provider] ?? '#8A7252';
}

export function getProviderLabel(provider: string): string {
    return PROVIDER_LABELS[provider] ?? provider;
}

export function getProviderShortLabel(provider: string): string {
    return PROVIDER_SHORT_LABELS[provider] ?? provider.substring(0, 3).toUpperCase();
}
