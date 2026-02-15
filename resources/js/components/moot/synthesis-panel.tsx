import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Message, SynthesisStructured } from '@/types/moot';

interface SynthesisPanelProps {
    message: Message;
    className?: string;
}

export function SynthesisPanel({ message, className }: SynthesisPanelProps) {
    const hasSynthesis = message.synthesis || message.synthesis_structured;
    const isSynthesizing = message.status === 'synthesizing';
    const isPending =
        message.status === 'pending' || message.status === 'running';

    if (isPending) return null;

    return (
        <div
            className={cn(
                'rounded-lg border-2 border-primary/20 bg-card px-5 py-4',
                className,
            )}
        >
            <div className="mb-3 flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                    Synthesis
                </span>
            </div>

            {isSynthesizing && <SynthesisSkeleton />}

            {hasSynthesis && message.synthesis_format === 'structured' && message.synthesis_structured ? (
                <StructuredView data={message.synthesis_structured} />
            ) : hasSynthesis && message.synthesis ? (
                <div className="prose prose-sm max-w-none text-foreground">
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {message.synthesis}
                    </Markdown>
                </div>
            ) : (
                !isSynthesizing && (
                    <p className="text-sm text-muted-foreground italic">
                        No synthesis available.
                    </p>
                )
            )}
        </div>
    );
}

function StructuredView({ data }: { data: SynthesisStructured }) {
    return (
        <div className="space-y-4 text-sm">
            {data.consensus.length > 0 && (
                <div>
                    <h4 className="mb-1 font-semibold">Consensus</h4>
                    <ul className="list-disc space-y-1 pl-5">
                        {data.consensus.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {data.differences.length > 0 && (
                <div>
                    <h4 className="mb-1 font-semibold">Key Differences</h4>
                    {data.differences.map((diff, i) => (
                        <div key={i} className="mb-2 rounded border p-3">
                            <p className="font-medium">{diff.topic}</p>
                            <div className="mt-1 space-y-0.5 text-muted-foreground">
                                {Object.entries(diff.positions).map(
                                    ([provider, position]) => (
                                        <p key={provider}>
                                            <span className="font-medium text-foreground">
                                                {provider}:
                                            </span>{' '}
                                            {position}
                                        </p>
                                    ),
                                )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground italic">
                                {diff.trade_off}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {data.recommendation && (
                <div>
                    <h4 className="mb-1 font-semibold">Recommendation</h4>
                    <p>{data.recommendation}</p>
                </div>
            )}

            {data.confidence > 0 && (
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Confidence:</span>
                    <span>{Math.round(data.confidence * 100)}%</span>
                </div>
            )}

            {data.action_items.length > 0 && (
                <div>
                    <h4 className="mb-1 font-semibold">Action Items</h4>
                    <ul className="list-disc space-y-1 pl-5">
                        {data.action_items.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function SynthesisSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
        </div>
    );
}
