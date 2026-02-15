import * as React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ProviderBadge } from '@/components/moot/provider-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { AdvisorResponse } from '@/types/moot';

interface AdvisorCardProps {
    response: AdvisorResponse;
    defaultOpen?: boolean;
    className?: string;
}

export function AdvisorCard({
    response,
    defaultOpen = false,
    className,
}: AdvisorCardProps) {
    const [open, setOpen] = React.useState(defaultOpen);

    React.useEffect(() => {
        setOpen(defaultOpen);
    }, [defaultOpen]);

    const durationSec = response.duration_ms
        ? (response.duration_ms / 1000).toFixed(1)
        : null;

    const costDisplay = response.estimated_cost
        ? `$${response.estimated_cost.toFixed(4)}`
        : null;

    return (
        <Collapsible open={open} onOpenChange={setOpen} className={className}>
            <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-accent/30">
                <ProviderBadge provider={response.provider} size="sm" />
                {response.model && (
                    <span className="text-xs text-muted-foreground">
                        {response.model}
                    </span>
                )}
                <span className="flex-1" />
                {response.error && (
                    <span className="text-xs text-destructive">Error</span>
                )}
                {durationSec && (
                    <span className="text-xs text-muted-foreground">
                        {durationSec}s
                    </span>
                )}
                {costDisplay && (
                    <span className="text-xs text-muted-foreground">
                        {costDisplay}
                    </span>
                )}
                <ChevronDown
                    className={cn(
                        'size-4 text-muted-foreground transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="rounded-b-lg border border-t-0 bg-card px-4 py-3">
                    {response.error ? (
                        <p className="text-sm text-destructive">
                            {response.error}
                        </p>
                    ) : response.content ? (
                        <div className="prose prose-sm max-w-none text-foreground">
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {response.content}
                            </Markdown>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            No response content.
                        </p>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export function AdvisorCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card px-4 py-3">
            <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <span className="flex-1" />
                <Skeleton className="h-4 w-10" />
            </div>
        </div>
    );
}
