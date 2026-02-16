import * as React from 'react';
import { ChevronDown, ChevronUp, Columns2, LayoutList } from 'lucide-react';
import { AdvisorCard, AdvisorCardOpen, AdvisorCardSkeleton } from '@/components/moot/advisor-card';
import { ErrorBanner } from '@/components/moot/error-banner';
import { MessageFooter } from '@/components/moot/message-footer';
import { SynthesisPanel } from '@/components/moot/synthesis-panel';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { Message } from '@/types/moot';

interface ConversationThreadProps {
    messages: Message[];
    threadId?: string;
    className?: string;
}

export function ConversationThread({
    messages,
    threadId,
    className,
}: ConversationThreadProps) {
    const bottomRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, messages[messages.length - 1]?.status]);

    return (
        <div className={cn('flex-1 space-y-6 overflow-y-auto p-6', className)}>
            {messages.map((message) => (
                <MessageGroup
                    key={message.id}
                    message={message}
                    threadId={threadId}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

function MessageGroup({
    message,
    threadId,
}: {
    message: Message;
    threadId?: string;
}) {
    const [layout, setLayout] = React.useState<'columns' | 'list'>('columns');
    const [allExpanded, setAllExpanded] = React.useState(false);
    const responses = message.advisor_responses ?? [];
    const isLoading =
        message.status === 'pending' || message.status === 'running';

    const gridCols =
        responses.length === 2
            ? 'md:grid-cols-2'
            : 'md:grid-cols-2 lg:grid-cols-3';

    return (
        <div className="space-y-3">
            {/* User prompt */}
            <div className="rounded-lg bg-accent/40 px-4 py-3">
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <span className="mt-1 block text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleString(undefined, {
                        month: 'short', day: 'numeric',
                        hour: 'numeric', minute: '2-digit',
                    })}
                </span>
            </div>

            {/* Error banner */}
            {threadId && (
                <ErrorBanner
                    message={message}
                    threadId={threadId}
                />
            )}

            {/* Advisor responses */}
            {responses.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Advisor Responses ({responses.length})
                        </span>
                        {responses.length > 1 && (
                            <div className="flex items-center gap-1">
                                {layout === 'list' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mr-1 h-6 text-xs"
                                        onClick={() => setAllExpanded((v) => !v)}
                                    >
                                        {allExpanded ? (
                                            <>
                                                <ChevronUp className="mr-1 size-3" />
                                                Collapse All
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="mr-1 size-3" />
                                                Expand All
                                            </>
                                        )}
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn('size-6', layout === 'columns' && 'bg-accent')}
                                    onClick={() => setLayout('columns')}
                                >
                                    <Columns2 className="size-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn('size-6', layout === 'list' && 'bg-accent')}
                                    onClick={() => setLayout('list')}
                                >
                                    <LayoutList className="size-3.5" />
                                </Button>
                            </div>
                        )}
                    </div>
                    {layout === 'columns' && responses.length > 1 ? (
                        <div className={cn('grid grid-cols-1 gap-3', gridCols)}>
                            {responses.map((response) => (
                                <AdvisorCardOpen
                                    key={response.id}
                                    response={response}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {responses.map((response) => (
                                <AdvisorCard
                                    key={response.id}
                                    response={response}
                                    defaultOpen={allExpanded}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <LoadingIndicator message={message} responseCount={responses.length} />
            )}

            {/* Cost footer */}
            {responses.length > 0 && <MessageFooter responses={responses} />}

            {/* Synthesis */}
            <SynthesisPanel message={message} />
        </div>
    );
}

function useElapsed(active: boolean): number {
    const [elapsed, setElapsed] = React.useState(0);

    React.useEffect(() => {
        if (!active) {
            setElapsed(0);
            return;
        }
        const start = Date.now();
        const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [active]);

    return elapsed;
}

function LoadingIndicator({
    message,
    responseCount,
}: {
    message: Message;
    responseCount: number;
}) {
    const elapsed = useElapsed(true);

    const label =
        message.status === 'pending'
            ? 'Queuing request...'
            : responseCount === 0
              ? 'Consulting advisors...'
              : 'Waiting for remaining advisors...';

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Spinner className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                    {label}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground/60">
                    {elapsed}s
                </span>
            </div>
            {responseCount === 0 && (
                <>
                    <AdvisorCardSkeleton />
                    <AdvisorCardSkeleton />
                </>
            )}
        </div>
    );
}
