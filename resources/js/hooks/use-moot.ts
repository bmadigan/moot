import * as React from 'react';
import echo from '@/lib/echo';
import type { AdvisorResponse, Message, Thread } from '@/types/moot';

interface UseMootReturn {
    messages: Message[];
    isProcessing: boolean;
}

export function useMoot(thread: Thread): UseMootReturn {
    const [messages, setMessages] = React.useState<Message[]>(
        thread.messages ?? [],
    );

    // Sync with server-provided data when thread changes
    React.useEffect(() => {
        setMessages(thread.messages ?? []);
    }, [thread.id, thread.messages]);

    const isProcessing = messages.some(
        (m) =>
            m.status === 'pending' ||
            m.status === 'running' ||
            m.status === 'synthesizing',
    );

    React.useEffect(() => {
        const channel = echo.private(`thread.${thread.id}`);

        channel.listen(
            '.App\\Events\\AdvisorResponded',
            (e: { advisor_response: AdvisorResponse }) => {
                setMessages((prev) =>
                    prev.map((msg) => {
                        if (msg.id !== e.advisor_response.message_id) return msg;
                        const existing = msg.advisor_responses ?? [];
                        // Avoid duplicates
                        if (existing.some((r) => r.id === e.advisor_response.id))
                            return msg;
                        return {
                            ...msg,
                            status: 'running',
                            advisor_responses: [
                                ...existing,
                                e.advisor_response,
                            ],
                        };
                    }),
                );
            },
        );

        channel.listen(
            '.App\\Events\\MootCompleted',
            (e: {
                message: {
                    id: string;
                    status: Message['status'];
                    synthesis: string | null;
                    synthesis_structured: Message['synthesis_structured'];
                    synthesis_format: Message['synthesis_format'];
                };
            }) => {
                setMessages((prev) =>
                    prev.map((msg) => {
                        if (msg.id !== e.message.id) return msg;
                        return {
                            ...msg,
                            status: e.message.status,
                            synthesis: e.message.synthesis,
                            synthesis_structured: e.message.synthesis_structured,
                            synthesis_format: e.message.synthesis_format,
                        };
                    }),
                );
            },
        );

        return () => {
            echo.leave(`thread.${thread.id}`);
        };
    }, [thread.id]);

    return { messages, isProcessing };
}
