export type ConsultationMode = 'quick' | 'code';

export type MessageStatus = 'pending' | 'running' | 'synthesizing' | 'completed' | 'failed';

export type SynthesisFormat = 'markdown' | 'structured';

export interface Thread {
    id: string;
    user_id: number;
    title: string | null;
    mode: ConsultationMode;
    providers: string[];
    provider_config: Record<string, ProviderConfig> | null;
    context_paths: string[] | null;
    created_at: string;
    updated_at: string;
    messages?: Message[];
    latest_message?: Message | null;
}

export interface MootConfig {
    providers: Record<string, Record<string, { label: string; color: string; pill: string; models: Record<string, string>; default_model: string }>>;
    default_providers: string[];
    default_synthesis_format: SynthesisFormat;
}

export interface Message {
    id: string;
    thread_id: string;
    role: 'user' | 'system';
    content: string;
    status: MessageStatus;
    synthesis: string | null;
    synthesis_structured: SynthesisStructured | null;
    synthesis_format: SynthesisFormat;
    created_at: string;
    advisor_responses?: AdvisorResponse[];
}

export interface AdvisorResponse {
    id: string;
    message_id: string;
    provider: string;
    model: string | null;
    content: string | null;
    error: string | null;
    duration_ms: number | null;
    tokens_used: number | null;
    input_tokens: number | null;
    output_tokens: number | null;
    estimated_cost: number | null;
    created_at: string;
}

export interface ProviderConfig {
    model?: string;
    temperature?: number;
    max_tokens?: number;
}

export interface SynthesisStructured {
    consensus: string[];
    differences: Array<{
        topic: string;
        positions: Record<string, string>;
        trade_off: string;
    }>;
    recommendation: string;
    confidence: number;
    action_items: string[];
}
