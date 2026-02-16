import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import { ChatInput } from '@/components/moot/chat-input';
import { ProviderSelector } from '@/components/moot/provider-selector';
import { ProviderStatusPanel } from '@/components/moot/provider-status';
import MootLayout from '@/layouts/moot-layout';
import type { BreadcrumbItem } from '@/types';
import type {
    MootConfig,
    ProviderConfig,
    SynthesisFormat,
    Thread,
} from '@/types/moot';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Moot', href: '/moot' },
];

interface Props {
    threads: Thread[];
    mootConfig: MootConfig;
}

export default function MootIndex({ threads, mootConfig }: Props) {
    const [prompt, setPrompt] = React.useState('');
    const [selectedProviders, setSelectedProviders] = React.useState<string[]>(() => {
        return mootConfig.default_providers.filter(
            (p) => mootConfig.provider_status[p]?.configured,
        );
    });
    const [providerConfig, setProviderConfig] = React.useState<Record<string, ProviderConfig>>({});
    const [synthesisFormat, setSynthesisFormat] = React.useState<SynthesisFormat>(
        mootConfig.default_synthesis_format,
    );
    const [submitting, setSubmitting] = React.useState(false);

    const availableProviders = mootConfig.providers.quick ?? {};

    const hasConfiguredProviders = selectedProviders.some(
        (p) => mootConfig.provider_status[p]?.configured,
    );

    function handleSubmit() {
        if (!prompt.trim() || submitting || !hasConfiguredProviders) return;

        setSubmitting(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
            prompt: prompt.trim(),
            mode: 'quick',
            providers: selectedProviders,
            synthesis_format: synthesisFormat,
        };
        if (Object.keys(providerConfig).length > 0) {
            payload.provider_config = providerConfig;
        }

        router.post('/moot', payload, {
            onFinish: () => setSubmitting(false),
        });
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

                    <ProviderStatusPanel
                        providerStatus={mootConfig.provider_status}
                    />

                    <ProviderSelector
                        selectedProviders={selectedProviders}
                        onProvidersChange={setSelectedProviders}
                        availableProviders={availableProviders}
                        providerConfig={providerConfig}
                        onProviderConfigChange={setProviderConfig}
                        providerStatus={mootConfig.provider_status}
                        className="justify-center"
                    />

                    <ChatInput
                        value={prompt}
                        onChange={setPrompt}
                        onSubmit={handleSubmit}
                        disabled={submitting || !hasConfiguredProviders}
                        synthesisFormat={synthesisFormat}
                        onSynthesisFormatChange={setSynthesisFormat}
                    />

                    {hasConfiguredProviders && (
                        <p className="text-center text-xs text-muted-foreground">
                            Press{' '}
                            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                                Cmd+Enter
                            </kbd>{' '}
                            to submit
                        </p>
                    )}
                </div>
            </div>
        </MootLayout>
    );
}
