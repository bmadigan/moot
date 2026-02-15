import { Link, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Thread } from '@/types/moot';

interface ThreadSidebarProps {
    threads: Thread[];
    activeThreadId?: string;
}

export function ThreadSidebar({ threads, activeThreadId }: ThreadSidebarProps) {
    function handleDelete(e: React.MouseEvent, thread: Thread) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Delete this thread?')) {
            router.delete(`/moot/${thread.id}`);
        }
    }

    return (
        <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border/50 bg-sidebar">
            <div className="flex items-center justify-between border-b border-sidebar-border/50 px-4 py-3">
                <span className="text-sm font-semibold">Threads</span>
                <Button variant="ghost" size="icon" asChild className="size-7">
                    <Link href="/moot">
                        <Plus className="size-4" />
                    </Link>
                </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
                {threads.length === 0 && (
                    <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                        No threads yet. Start a new Moot!
                    </p>
                )}
                {threads.map((thread) => (
                    <Link
                        key={thread.id}
                        href={`/moot/${thread.id}`}
                        className={cn(
                            'group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50',
                            activeThreadId === thread.id &&
                                'bg-accent/70 font-medium',
                        )}
                    >
                        <span className="min-w-0 flex-1 truncate">
                            {thread.title || 'New Thread'}
                        </span>
                        <button
                            onClick={(e) => handleDelete(e, thread)}
                            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
