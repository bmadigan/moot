import * as React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export function ChatInput({
    value,
    onChange,
    onSubmit,
    disabled = false,
    placeholder = 'Ask your Moot...',
    className,
}: ChatInputProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [value]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!disabled && value.trim()) {
                onSubmit();
            }
        }
    }

    return (
        <div
            className={cn(
                'relative rounded-lg border bg-card shadow-sm',
                disabled && 'opacity-60',
                className,
            )}
        >
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder={placeholder}
                rows={1}
                className="w-full resize-none bg-transparent px-4 py-3 pr-12 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
            <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onSubmit}
                disabled={disabled || !value.trim()}
                className="absolute right-2 bottom-2 size-8"
            >
                <Send className="size-4" />
            </Button>
        </div>
    );
}
