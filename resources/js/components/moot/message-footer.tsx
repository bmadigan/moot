import type { AdvisorResponse } from '@/types/moot';

interface MessageFooterProps {
    responses: AdvisorResponse[];
    className?: string;
}

export function MessageFooter({ responses, className }: MessageFooterProps) {
    const successful = responses.filter((r) => r.content && !r.error);

    if (successful.length === 0) return null;

    const durations = successful
        .map((r) => r.duration_ms)
        .filter((d): d is number => d !== null);

    const avgDuration =
        durations.length > 0
            ? (durations.reduce((a, b) => a + b, 0) / durations.length / 1000).toFixed(1)
            : null;

    const totalCost = successful
        .map((r) => r.estimated_cost)
        .filter((c): c is number => c !== null)
        .reduce((a, b) => a + b, 0);

    return (
        <div className={className}>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>
                    {successful.length} advisor{successful.length !== 1 ? 's' : ''}
                </span>
                {avgDuration && (
                    <>
                        <span>&middot;</span>
                        <span>{avgDuration}s avg</span>
                    </>
                )}
                {totalCost > 0 && (
                    <>
                        <span>&middot;</span>
                        <span>~${totalCost.toFixed(4)} total</span>
                    </>
                )}
            </div>
        </div>
    );
}
