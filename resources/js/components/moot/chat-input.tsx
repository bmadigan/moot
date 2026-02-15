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
    synthesisFormat?: 'markdown' | 'structured';
    onSynthesisFormatChange?: (format: 'markdown' | 'structured') => void;
}

export function ChatInput({
    value,
    onChange,
    onSubmit,
    disabled = false,
    placeholder = 'Ask your Moot...',
    className,
    synthesisFormat,
    onSynthesisFormatChange,
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
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {synthesisFormat && onSynthesisFormatChange && (
                    <button
                        type="button"
                        onClick={() =>
                            onSynthesisFormatChange(
                                synthesisFormat === 'markdown'
                                    ? 'structured'
                                    : 'markdown',
                            )
                        }
                        disabled={disabled}
                        className="rounded px-1.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                        title={`Synthesis: ${synthesisFormat}`}
                    >
                        {synthesisFormat === 'markdown' ? 'MD' : 'JSON'}
                    </button>
                )}
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={onSubmit}
                    disabled={disabled || !value.trim()}
                    className="size-8"
                >
                    <Send className="size-4" />
                </Button>
            </div>
        </div>
    );
}
