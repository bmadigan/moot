<?php

namespace App\Enums;

enum MessageStatus: string
{
    case Pending = 'pending';
    case Running = 'running';
    case Synthesizing = 'synthesizing';
    case Completed = 'completed';
    case Failed = 'failed';
}
