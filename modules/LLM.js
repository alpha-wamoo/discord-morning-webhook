/**
 * @import {ChatRequest, ChatResponse, Message} from "ollama"
 */
import { Ollama } from "ollama";
import Logger from "./Logger.js";

/**
 * @class LLM
 */

export default class LLM{
    /**@private @type {string} */
    _modelType = "qwen2.5:7b";
    /**@private @type {Ollama} */
    _ollama = new Ollama();

    /**
     * @constructor
     */
    constructor(model = "qwen2.5:7b"){
        this._modelType = model;
    }

    /**@public @method
     * @param {Message[] | undefined} messages
     * @param {boolean | "high" | "medium" | "low"} think
     * @returns {Promise<ChatResponse>}
    */
    talk(messages, think = false){
        Logger.fcall("LLM.talk");
        const res = this._ollama.chat({
            model: this._modelType,
            messages: messages,
            think
        });
        Logger.fexit("LLM.talk");
        return res;
    }
};