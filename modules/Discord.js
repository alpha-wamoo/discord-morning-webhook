import Logger from "./Logger.js";
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
    Logger.fcall(`Discord.post: ${msg}`);
    const msgObj = {content: msg};
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(msgObj)
    });
    Logger.fexit(`Discord.post: ${msg}`);
    return res;
  }
}