import * as React from 'react';
import { Settings } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ProviderConfig } from '@/types/moot';

interface ProviderConfigPopoverProps {
    provider: string;
    label: string;
    color: string;
    models?: string[];
    defaultModel?: string;
    config: ProviderConfig;
    onChange: (config: ProviderConfig) => void;
}

export function ProviderConfigPopover({
    provider,
    label,
    color,
    models,
    defaultModel,
    config,
    onChange,
}: ProviderConfigPopoverProps) {
    const modelList = models ?? [];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                    title={`Configure ${label}`}
                >
                    <Settings className="size-3" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-3">
                <DropdownMenuLabel className="px-0 text-xs" style={{ color }}>
                    {label} Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {modelList.length > 0 && (
                    <div className="space-y-1.5 py-1">
                        <Label className="text-xs">Model</Label>
                        <select
                            value={config.model ?? defaultModel ?? ''}
                            onChange={(e) =>
                                onChange({ ...config, model: e.target.value })
                            }
                            className="w-full rounded border bg-background px-2 py-1 text-xs"
                        >
                            {modelList.map((id) => (
                                <option key={id} value={id}>
                                    {id}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="space-y-1.5 py-1">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Temperature</Label>
                        <span className="text-xs text-muted-foreground">
                            {config.temperature ?? 0.7}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={config.temperature ?? 0.7}
                        onChange={(e) =>
                            onChange({
                                ...config,
                                temperature: parseFloat(e.target.value),
                            })
                        }
                        className="w-full accent-primary"
                    />
                </div>

                <div className="space-y-1.5 py-1">
                    <Label className="text-xs">Max Tokens</Label>
                    <input
                        type="number"
                        min={256}
                        max={16384}
                        step={256}
                        value={config.max_tokens ?? 4096}
                        onChange={(e) =>
                            onChange({
                                ...config,
                                max_tokens: parseInt(e.target.value, 10),
                            })
                        }
                        className="w-full rounded border bg-background px-2 py-1 text-xs"
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
