import * as React from 'react';
import { router } from '@inertiajs/react';

interface ShortcutHandlers {
    onNewThread?: () => void;
    onToggleHelp?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers = {}) {
    React.useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const meta = e.metaKey || e.ctrlKey;

            // Cmd+N — New thread
            if (meta && e.key === 'n') {
                e.preventDefault();
                if (handlers.onNewThread) {
                    handlers.onNewThread();
                } else {
                    router.visit('/moot');
                }
            }

            // Cmd+? — Toggle help overlay
            if (meta && e.key === '/') {
                e.preventDefault();
                handlers.onToggleHelp?.();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
}

export const SHORTCUTS = [
    { keys: ['Cmd', 'Enter'], description: 'Submit prompt' },
    { keys: ['Cmd', 'N'], description: 'New thread' },
    { keys: ['Cmd', '/'], description: 'Toggle shortcuts help' },
] as const;
