/**
 * - OpenAI APIを呼び出すためのクラス
 * @class AI
 * @example
 * const reply = await AI.call("Hello, how are you?");
 */
export default class AI{
  /**
   * @static @method
   * @param {any[]} messages
   */
  static createPayload(messages){
    return {
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7
    };
  }
  /**
   * @static @method
   */
  static createOptions(payload){
    return {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${GPT_API_KEY}`
      },
      payload: JSON.stringify(payload)
    };
  }
  /**
   * @static @method
   * @param {...any} messages
   * @returns {string}
   */
  static async call(...messages){
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const payload = AI.createPayload(messages);
    const options = AI.createOptions(payload);
    
    const response = await UrlFetchApp.fetch(endpoint, options);
    const json = JSON.parse(response.getContentText());
    
    const reply = json.choices[0].message.content;
    return reply;
  }
}