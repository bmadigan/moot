import * as React from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ShortcutsHelp } from '@/components/moot/shortcuts-help';
import { ThreadSidebar } from '@/components/moot/thread-sidebar';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import type { BreadcrumbItem } from '@/types';
import type { Thread } from '@/types/moot';

interface MootLayoutProps {
    children: React.ReactNode;
    threads: Thread[];
    activeThreadId?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function MootLayout({
    children,
    threads,
    activeThreadId,
    breadcrumbs = [],
}: MootLayoutProps) {
    const [showShortcuts, setShowShortcuts] = React.useState(false);

    useKeyboardShortcuts({
        onToggleHelp: () => setShowShortcuts((v) => !v),
    });

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                    <ThreadSidebar
                        threads={threads}
                        activeThreadId={activeThreadId}
                    />
                    <main className="flex flex-1 flex-col overflow-hidden">
                        {children}
                    </main>
                </div>
            </AppContent>
            <ShortcutsHelp
                open={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </AppShell>
    );
}
