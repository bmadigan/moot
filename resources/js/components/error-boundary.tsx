import { Component, type ErrorInfo, type ReactNode } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('React error boundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-background p-8">
                    <div className="max-w-md space-y-4 text-center">
                        <h2 className="text-lg font-semibold">Something went wrong</h2>
                        <p className="text-sm text-muted-foreground">
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => router.visit('/moot')}
                                className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
