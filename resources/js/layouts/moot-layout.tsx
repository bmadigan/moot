import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { BreadcrumbItem } from '@/types';
import type { Thread } from '@/types/moot';
import { ThreadSidebar } from '@/components/moot/thread-sidebar';

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
        </AppShell>
    );
}
