<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Providers
    |--------------------------------------------------------------------------
    */

    'default_providers' => ['anthropic', 'openai', 'gemini'],

    'default_synthesis_format' => 'markdown',

    /*
    |--------------------------------------------------------------------------
    | Provider Display Metadata
    |--------------------------------------------------------------------------
    */

    'providers' => [
        'quick' => [
            'anthropic' => [
                'label' => 'Claude',
                'color' => '#D97706',
                'pill' => 'ANT',
                'models' => ['claude-sonnet-4-5-20250929', 'claude-haiku-4-5-20251001'],
                'default_model' => 'claude-sonnet-4-5-20250929',
            ],
            'openai' => [
                'label' => 'GPT',
                'color' => '#10B981',
                'pill' => 'OAI',
                'models' => ['gpt-4o', 'gpt-4o-mini'],
                'default_model' => 'gpt-4o',
            ],
            'gemini' => [
                'label' => 'Gemini',
                'color' => '#3B82F6',
                'pill' => 'GEM',
                'models' => ['gemini-2.5-pro', 'gemini-2.5-flash'],
                'default_model' => 'gemini-2.5-pro',
            ],
        ],
        'code' => [
            'claude' => [
                'label' => 'Claude Code',
                'color' => '#D97706',
                'pill' => 'CC',
            ],
            'codex' => [
                'label' => 'Codex',
                'color' => '#10B981',
                'pill' => 'CDX',
            ],
            'gemini' => [
                'label' => 'Gemini CLI',
                'color' => '#3B82F6',
                'pill' => 'GCL',
            ],
            'amp' => [
                'label' => 'Amp',
                'color' => '#8B5CF6',
                'pill' => 'AMP',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cost Tracking (USD per 1M tokens)
    |--------------------------------------------------------------------------
    */

    'pricing' => [
        'claude-sonnet-4-5-20250929' => ['input' => 3.00, 'output' => 15.00],
        'claude-haiku-4-5-20251001' => ['input' => 0.80, 'output' => 4.00],
        'gpt-4o' => ['input' => 2.50, 'output' => 10.00],
        'gpt-4o-mini' => ['input' => 0.15, 'output' => 0.60],
        'gemini-2.5-pro' => ['input' => 1.25, 'output' => 10.00],
        'gemini-2.5-flash' => ['input' => 0.15, 'output' => 0.60],
    ],

    /*
    |--------------------------------------------------------------------------
    | Timeouts (seconds)
    |--------------------------------------------------------------------------
    */

    'agent_timeout' => env('MOOT_AGENT_TIMEOUT', 120),

    'synthesis_timeout' => env('MOOT_SYNTHESIS_TIMEOUT', 60),

    /*
    |--------------------------------------------------------------------------
    | Counselors CLI (optional)
    |--------------------------------------------------------------------------
    */

    'counselors_binary' => env('COUNSELORS_BINARY', 'counselors'),

    'counselors_output_dir' => env('COUNSELORS_OUTPUT_DIR', './agents/counselors'),

];
