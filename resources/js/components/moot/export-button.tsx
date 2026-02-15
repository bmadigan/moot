import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
    threadId: string;
    className?: string;
}

export function ExportButton({ threadId, className }: ExportButtonProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            asChild
            className={className}
        >
            <a href={`/moot/${threadId}/export`} download>
                <Download className="mr-1.5 size-3.5" />
                Export
            </a>
        </Button>
    );
}
