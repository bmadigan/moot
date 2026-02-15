import { AlertTriangle, RefreshCw } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Message } from '@/types/moot';

interface ErrorBannerProps {
    message: Message;
    threadId: string;
    className?: string;
}

export function ErrorBanner({ message, threadId, className }: ErrorBannerProps) {
    if (message.status !== 'failed') return null;

    const failedCount = (message.advisor_responses ?? []).filter(
        (r) => r.error,
    ).length;
    const totalCount = (message.advisor_responses ?? []).length;
    const allFailed = failedCount === totalCount && totalCount > 0;

    function handleRetry() {
        router.post(
            `/moot/${threadId}/messages`,
            { content: message.content },
            { preserveScroll: true },
        );
    }

    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3',
                className,
            )}
        >
            <AlertTriangle className="size-4 shrink-0 text-destructive" />
            <p className="flex-1 text-sm text-destructive">
                {allFailed
                    ? 'All advisors failed to respond.'
                    : `${failedCount} of ${totalCount} advisor${totalCount !== 1 ? 's' : ''} failed.`}
            </p>
            <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
                <RefreshCw className="mr-1.5 size-3" />
                Retry
            </Button>
        </div>
    );
}
