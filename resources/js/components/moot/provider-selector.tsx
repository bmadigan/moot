import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ProviderConfigPopover } from '@/components/moot/provider-config-popover';
import { cn } from '@/lib/utils';
import type { ConsultationMode, MootProviderMeta, ProviderConfig } from '@/types/moot';

interface ProviderSelectorProps {
    mode: ConsultationMode;
    onModeChange: (mode: ConsultationMode) => void;
    selectedProviders: string[];
    onProvidersChange: (providers: string[]) => void;
    availableProviders: Record<string, MootProviderMeta>;
    providerConfig?: Record<string, ProviderConfig>;
    onProviderConfigChange?: (config: Record<string, ProviderConfig>) => void;
    className?: string;
}

export function ProviderSelector({
    mode,
    onModeChange,
    selectedProviders,
    onProvidersChange,
    availableProviders,
    providerConfig = {},
    onProviderConfigChange,
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
        <div className={cn('flex flex-wrap items-center gap-3', className)}>
            {/* Mode toggle */}
            <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(v) => {
                    if (v) onModeChange(v as ConsultationMode);
                }}
                variant="outline"
                size="sm"
            >
                <ToggleGroupItem value="quick">Quick</ToggleGroupItem>
                <ToggleGroupItem value="code">Code</ToggleGroupItem>
            </ToggleGroup>

            <span className="text-muted-foreground">|</span>

            {/* Provider pills */}
            <div className="flex flex-wrap gap-1.5">
                {Object.entries(availableProviders).map(
                    ([key, meta]) => {
                        const isSelected = selectedProviders.includes(key);
                        return (
                            <div key={key} className="group relative flex items-center gap-0.5">
                                <button
                                    type="button"
                                    onClick={() => handleProviderToggle(key)}
                                    className={cn(
                                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                                        isSelected
                                            ? 'border-current/30 text-white'
                                            : 'border-border text-muted-foreground hover:border-current/20',
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
                                    {meta.label}
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
        </div>
    );
}
