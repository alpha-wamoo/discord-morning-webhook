/**
 * @import {AIRequestMsg} from '../types/AIRequestMsg'
 * @import {Payload} from '../types/Payload'
 * @import {OpenAIResponse} from '../types/OpenAIResponse'
 */

/**
 * - OpenAI APIを呼び出すためのクラス
 * @class AI
 * @example
 * const ai = new AI(OPENAI_API_KEY);
 * const reply = await ai.call("Hello, how are you?");
 */
export default class OpenAI{
    /**@type {string} */
    _OPENAI_API_KEY;
    _ENDPOINT = 'https://api.openai.com/v1/chat/completions';

    /**
     * @constructor
     * @param {string} openAiApiKey 
     */
    constructor(openAiApiKey){
        this._OPENAI_API_KEY = openAiApiKey;
    }

    /**
     * @method
     * @param {AIRequestMsg[]} messages
     * @return {Payload}
     */
    createPayload(messages){
        const normalizedMessages = Array.isArray(messages) ? messages : [messages];
        return {
            model: "gpt-3.5-turbo",
            messages: normalizedMessages,
            temperature: 0.7
        };
    }

    /**
     * @method
     * @returns {RequestInit}
     */
    createOptions(payload){
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._OPENAI_API_KEY}`
            },
            body: JSON.stringify(payload)
        };
    }

    /**
     * @method
     * @param {AIRequestMsg[]} messages
     * @returns {Promise<string>}
     */
    async call(messages){
        console.log("OpenAI API呼び出し開始");
        const payload = this.createPayload(messages);
        const options = this.createOptions(payload);

        const response = await fetch(this._ENDPOINT, options);
        console.log(`OpenAI API 応答: ${response.status} ${response.statusText}`);
        const responseText = await response.text();

        let json;
        try {
            json = /**@type {OpenAIResponse} */(JSON.parse(responseText));
        } catch (error) {
            throw new Error(`OpenAI API returned invalid JSON: ${responseText}`);
        }

        if (!response.ok) {
            const errorMessage = json.error?.message || responseText;
            throw new Error(`OpenAI API error ${response.status}: ${errorMessage}`);
        }

        const reply = json.choices?.[0]?.message?.content;
        if (!reply) {
            throw new Error(`OpenAI API response did not include a reply: ${responseText}`);
        }

        console.log("OpenAI API呼び出し完了");
        return reply;
    }
}