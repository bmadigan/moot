import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getProviderColor, getProviderLabel } from '@/lib/providers';
import { cn } from '@/lib/utils';
import type { ConsultationMode } from '@/types/moot';

interface ProviderSelectorProps {
    mode: ConsultationMode;
    onModeChange: (mode: ConsultationMode) => void;
    selectedProviders: string[];
    onProvidersChange: (providers: string[]) => void;
    availableProviders: Record<string, { label: string; color: string }>;
    className?: string;
}

export function ProviderSelector({
    mode,
    onModeChange,
    selectedProviders,
    onProvidersChange,
    availableProviders,
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
                    ([key, { label, color }]) => {
                        const isSelected = selectedProviders.includes(key);
                        return (
                            <button
                                key={key}
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
                                              backgroundColor: color,
                                              borderColor: color,
                                          }
                                        : { color }
                                }
                            >
                                {label}
                            </button>
                        );
                    },
                )}
            </div>
        </div>
    );
}
