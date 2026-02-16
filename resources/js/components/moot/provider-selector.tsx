import { ProviderConfigPopover } from '@/components/moot/provider-config-popover';
import { cn } from '@/lib/utils';
import type { MootProviderMeta, ProviderConfig, ProviderStatus } from '@/types/moot';

interface ProviderSelectorProps {
    selectedProviders: string[];
    onProvidersChange: (providers: string[]) => void;
    availableProviders: Record<string, MootProviderMeta>;
    providerConfig?: Record<string, ProviderConfig>;
    onProviderConfigChange?: (config: Record<string, ProviderConfig>) => void;
    providerStatus?: Record<string, ProviderStatus>;
    className?: string;
}

export function ProviderSelector({
    selectedProviders,
    onProvidersChange,
    availableProviders,
    providerConfig = {},
    onProviderConfigChange,
    providerStatus,
    className,
}: ProviderSelectorProps) {
    function handleProviderToggle(provider: string) {
        if (selectedProviders.includes(provider)) {
            if (selectedProviders.length > 1) {
                onProvidersChange(
                    selectedProviders.filter((p) => p !== provider),
                );
            }
        } else {
            onProvidersChange([...selectedProviders, provider]);
        }
    }

    function handleConfigChange(provider: string, config: ProviderConfig) {
        onProviderConfigChange?.({
            ...providerConfig,
            [provider]: config,
        });
    }

    return (
        <div className={cn('flex flex-wrap justify-center gap-1.5', className)}>
            {Object.entries(availableProviders).map(
                ([key, meta]) => {
                    const isSelected = selectedProviders.includes(key);
                    const isConfigured = providerStatus?.[key]?.configured ?? true;
                    return (
                        <div key={key} className="group relative flex items-center gap-0.5">
                            <button
                                type="button"
                                onClick={() => handleProviderToggle(key)}
                                className={cn(
                                    'relative rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                                    isSelected
                                        ? 'border-current/30 text-white'
                                        : 'border-border text-muted-foreground hover:border-current/20',
                                    !isConfigured && 'opacity-50',
                                )}
                                style={
                                    isSelected
                                        ? {
                                              backgroundColor: meta.color,
                                              borderColor: meta.color,
                                          }
                                        : { color: meta.color }
                                }
                            >
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className={`inline-block size-1.5 rounded-full ${
                                            isConfigured ? 'bg-green-400' : 'bg-red-400'
                                        }`}
                                    />
                                    {meta.label}
                                </span>
                            </button>
                            {isSelected && onProviderConfigChange && meta.models && (
                                <ProviderConfigPopover
                                    provider={key}
                                    label={meta.label}
                                    color={meta.color}
                                    models={meta.models}
                                    defaultModel={meta.default_model}
                                    config={providerConfig[key] ?? {}}
                                    onChange={(c) => handleConfigChange(key, c)}
                                />
                            )}
                        </div>
                    );
                },
            )}
        </div>
    );
}
