import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import { ChatInput } from '@/components/moot/chat-input';
import { ProviderSelector } from '@/components/moot/provider-selector';
import MootLayout from '@/layouts/moot-layout';
import type { BreadcrumbItem } from '@/types';
import type { ConsultationMode, MootConfig, Thread } from '@/types/moot';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Moot', href: '/moot' },
];

interface Props {
    threads: Thread[];
    mootConfig: MootConfig;
}

export default function MootIndex({ threads, mootConfig }: Props) {
    const [prompt, setPrompt] = React.useState('');
    const [mode, setMode] = React.useState<ConsultationMode>('quick');
    const [selectedProviders, setSelectedProviders] = React.useState<string[]>(
        mootConfig.default_providers,
    );
    const [submitting, setSubmitting] = React.useState(false);

    const availableProviders = React.useMemo(() => {
        const modeProviders = mootConfig.providers[mode] ?? {};
        const result: Record<string, { label: string; color: string }> = {};
        for (const [key, config] of Object.entries(modeProviders)) {
            result[key] = { label: config.label, color: config.color };
        }
        return result;
    }, [mootConfig.providers, mode]);

    // Reset providers when mode changes
    React.useEffect(() => {
        const available = Object.keys(mootConfig.providers[mode] ?? {});
        setSelectedProviders(available);
    }, [mode, mootConfig.providers]);

    function handleSubmit() {
        if (!prompt.trim() || submitting) return;

        setSubmitting(true);
        router.post(
            '/moot',
            {
                prompt: prompt.trim(),
                mode,
                providers: selectedProviders,
            },
            {
                onFinish: () => setSubmitting(false),
            },
        );
    }

    return (
        <MootLayout threads={threads} breadcrumbs={breadcrumbs}>
            <Head title="Moot" />
            <div className="flex flex-1 flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl space-y-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Start a new Moot
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ask multiple AI advisors and get a synthesized
                            recommendation.
                        </p>
                    </div>

                    <ProviderSelector
                        mode={mode}
                        onModeChange={setMode}
                        selectedProviders={selectedProviders}
                        onProvidersChange={setSelectedProviders}
                        availableProviders={availableProviders}
                        className="justify-center"
                    />

                    <ChatInput
                        value={prompt}
                        onChange={setPrompt}
                        onSubmit={handleSubmit}
                        disabled={submitting}
                    />

                    <p className="text-center text-xs text-muted-foreground">
                        Press{' '}
                        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                            Cmd+Enter
                        </kbd>{' '}
                        to submit
                    </p>
                </div>
            </div>
        </MootLayout>
    );
}
