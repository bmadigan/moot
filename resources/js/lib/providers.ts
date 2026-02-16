export const PROVIDER_COLORS: Record<string, string> = {
    anthropic: '#D97706',
    openai: '#10B981',
    gemini: '#3B82F6',
};

export const PROVIDER_LABELS: Record<string, string> = {
    anthropic: 'Claude',
    openai: 'GPT',
    gemini: 'Gemini',
};

export const PROVIDER_SHORT_LABELS: Record<string, string> = {
    anthropic: 'ANT',
    openai: 'OAI',
    gemini: 'GEM',
};

export function getProviderColor(provider: string): string {
    return PROVIDER_COLORS[provider] ?? '#8A7252';
}

export function getProviderLabel(provider: string): string {
    return PROVIDER_LABELS[provider] ?? prettifyToolId(provider);
}

export function getProviderShortLabel(provider: string): string {
    return PROVIDER_SHORT_LABELS[provider] ?? provider.substring(0, 3).toUpperCase();
}

export function prettifyToolId(toolId: string): string {
    return toolId
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}
