import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import { ChatInput } from '@/components/moot/chat-input';
import { ConversationThread } from '@/components/moot/conversation-thread';
import { useMoot } from '@/hooks/use-moot';
import MootLayout from '@/layouts/moot-layout';
import type { BreadcrumbItem } from '@/types';
import type { MootConfig, Thread } from '@/types/moot';

interface Props {
    thread: Thread;
    threads: Thread[];
    mootConfig: MootConfig;
}

export default function MootShow({ thread, threads, mootConfig }: Props) {
    const { messages, isProcessing } = useMoot(thread);
    const [content, setContent] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Moot', href: '/moot' },
        { title: thread.title || 'Thread', href: `/moot/${thread.id}` },
    ];

    function handleSendMessage() {
        if (!content.trim() || submitting) return;

        setSubmitting(true);
        router.post(
            `/moot/${thread.id}/messages`,
            { content: content.trim() },
            {
                preserveScroll: true,
                onSuccess: () => setContent(''),
                onFinish: () => setSubmitting(false),
            },
        );
    }

    return (
        <MootLayout
            threads={threads}
            activeThreadId={thread.id}
            breadcrumbs={breadcrumbs}
        >
            <Head title={thread.title || 'Moot Thread'} />

            <ConversationThread messages={messages} className="flex-1" />

            <div className="border-t border-sidebar-border/50 p-4">
                <ChatInput
                    value={content}
                    onChange={setContent}
                    onSubmit={handleSendMessage}
                    disabled={submitting || isProcessing}
                    placeholder="Send a follow-up..."
                />
            </div>
        </MootLayout>
    );
}
