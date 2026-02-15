import { Badge } from '@/components/ui/badge';
import { getProviderColor, getProviderLabel } from '@/lib/providers';
import { cn } from '@/lib/utils';

interface ProviderBadgeProps {
    provider: string;
    size?: 'sm' | 'default';
    className?: string;
}

export function ProviderBadge({ provider, size = 'default', className }: ProviderBadgeProps) {
    const color = getProviderColor(provider);
    const label = getProviderLabel(provider);

    return (
        <Badge
            variant="outline"
            className={cn(
                'border-current/20 font-medium',
                size === 'sm' && 'px-1.5 py-0 text-[10px]',
                className,
            )}
            style={{ color, backgroundColor: `${color}15` }}
        >
            {label}
        </Badge>
    );
}
