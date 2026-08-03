import type { AIRequestMsg } from './AIRequestMsg';

export interface Payload {
    model: string;
    messages: AIRequestMsg[];
    temperature: number;
}