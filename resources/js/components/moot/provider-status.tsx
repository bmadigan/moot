import { getProviderLabel } from '@/lib/providers';
import type { ProviderStatus } from '@/types/moot';

interface ProviderStatusPanelProps {
    providerStatus: Record<string, ProviderStatus>;
    className?: string;
}

export function ProviderStatusPanel({ providerStatus, className }: ProviderStatusPanelProps) {
    const entries = Object.entries(providerStatus);
    const configuredCount = entries.filter(([, s]) => s.configured).length;

    if (configuredCount === entries.length) return null;

    return (
        <div className={className}>
            {configuredCount === 0 ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
                    <p className="font-medium text-destructive">No providers configured</p>
                    <p className="mt-1 text-muted-foreground">
                        Add at least one API key to your{' '}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code> file
                        to get started:
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {entries.map(([key]) => (
                            <li key={key} className="flex items-center gap-2">
                                <StatusDot configured={false} />
                                <code>{envKeyForProvider(key)}</code>
                                <span className="text-muted-foreground/60">
                                    ({getProviderLabel(key)})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {entries.map(([key, status]) => (
                        <span key={key} className="flex items-center gap-1.5">
                            <StatusDot configured={status.configured} />
                            {getProviderLabel(key)}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatusDot({ configured }: { configured: boolean }) {
    return (
        <span
            className={`inline-block size-2 rounded-full ${
                configured ? 'bg-green-500' : 'bg-red-400'
            }`}
        />
    );
}

function envKeyForProvider(provider: string): string {
    const map: Record<string, string> = {
        anthropic: 'ANTHROPIC_API_KEY',
        openai: 'OPENAI_API_KEY',
        gemini: 'GEMINI_API_KEY',
    };
    return map[provider] ?? `${provider.toUpperCase()}_API_KEY`;
}
