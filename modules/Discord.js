/**
 * - DiscordのWebhookにメッセージを送信するためのクラス
 * @class Discord
 * @example
 * Discord.post("https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN", "Hello, Discord!");
 */
export default class Discord{
  /**
   * @static @method
   * @param {string} webhookUrl
   * @param {string} msg
   * @returns {Promise<Response>}
   */
  static async post(webhookUrl, msg){
    const msgObj = {content: msg};
    return fetch(webhookUrl, {
      "method": "POST",
      "headers": {'Content-type': "application/json"},
      "payload": JSON.stringify(msgObj)
    });
  }
}