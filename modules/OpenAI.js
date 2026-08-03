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
        return {
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0.7
        };
    }

    /**
     * @method
     * @returns {RequestInit}
     */
    createOptions(payload){
        return {
            method: 'post',
            contentType: 'application/json',
            headers: {
            Authorization: `Bearer ${this._OPENAI_API_KEY}`
            },
            payload: JSON.stringify(payload)
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
        const json = /**@type {OpenAIResponse} */(JSON.parse(await response.text()));

        const reply = json.choices[0].message.content;
        console.log("OpenAI API呼び出し完了");
        return reply;
    }
}