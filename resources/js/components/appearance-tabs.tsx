import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('text-muted-foreground text-sm', className)} {...props}>
            Moot uses a light theme with earth-tone colors. No appearance settings to configure.
        </div>
    );
}
