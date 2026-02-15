import { SHORTCUTS } from '@/hooks/use-keyboard-shortcuts';
import { cn } from '@/lib/utils';

interface ShortcutsHelpProps {
    open: boolean;
    onClose: () => void;
    className?: string;
}

export function ShortcutsHelp({ open, onClose, className }: ShortcutsHelpProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className={cn(
                    'w-full max-w-sm rounded-xl border bg-card p-6 shadow-lg',
                    className,
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="mb-4 text-sm font-semibold">
                    Keyboard Shortcuts
                </h3>
                <div className="space-y-2">
                    {SHORTCUTS.map((shortcut) => (
                        <div
                            key={shortcut.description}
                            className="flex items-center justify-between"
                        >
                            <span className="text-sm text-muted-foreground">
                                {shortcut.description}
                            </span>
                            <div className="flex gap-1">
                                {shortcut.keys.map((key) => (
                                    <kbd
                                        key={key}
                                        className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium"
                                    >
                                        {key}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
