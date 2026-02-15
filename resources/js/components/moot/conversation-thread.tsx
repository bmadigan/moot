import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AdvisorCard, AdvisorCardSkeleton } from '@/components/moot/advisor-card';
import { SynthesisPanel } from '@/components/moot/synthesis-panel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Message } from '@/types/moot';

interface ConversationThreadProps {
    messages: Message[];
    className?: string;
}

export function ConversationThread({
    messages,
    className,
}: ConversationThreadProps) {
    const bottomRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, messages[messages.length - 1]?.status]);

    return (
        <div className={cn('flex-1 space-y-6 overflow-y-auto p-6', className)}>
            {messages.map((message) => (
                <MessageGroup key={message.id} message={message} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

function MessageGroup({ message }: { message: Message }) {
    const [allExpanded, setAllExpanded] = React.useState(false);
    const responses = message.advisor_responses ?? [];
    const isLoading =
        message.status === 'pending' || message.status === 'running';

    return (
        <div className="space-y-3">
            {/* User prompt */}
            <div className="rounded-lg bg-accent/40 px-4 py-3">
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <span className="mt-1 block text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleTimeString()}
                </span>
            </div>

            {/* Advisor responses */}
            {responses.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Advisor Responses ({responses.length})
                        </span>
                        {responses.length > 1 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
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
                    </div>
                    {responses.map((response) => (
                        <AdvisorCard
                            key={response.id}
                            response={response}
                            defaultOpen={allExpanded}
                        />
                    ))}
                </div>
            )}

            {/* Loading skeletons */}
            {isLoading && responses.length === 0 && (
                <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">
                        Consulting advisors...
                    </span>
                    <AdvisorCardSkeleton />
                    <AdvisorCardSkeleton />
                    <AdvisorCardSkeleton />
                </div>
            )}

            {/* Synthesis */}
            <SynthesisPanel message={message} />
        </div>
    );
}
