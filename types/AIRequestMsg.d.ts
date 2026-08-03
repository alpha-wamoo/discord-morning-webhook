export interface AIRequestMsg {
    role: 'system' | 'user' | 'assistant';
    content: string;
}