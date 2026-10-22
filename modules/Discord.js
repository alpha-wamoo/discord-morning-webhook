import Logger from "./Logger.js";
/**
 * - DiscordのWebhookにメッセージを送信するためのクラス
 * @class Discord
 * @example
 * Discord.post("https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN", "Hello, Discord!");
 */
export default class Discord{
  /**@public @type {boolean} */
  static isDebug = false;
  /**
   * @static @method
   * @param {string} webhookUrl
   * @param {string} msg
   * @returns {Promise<Response>}
   */
  static async post(webhookUrl, msg){
    Logger.fcall(`Discord.post: ${msg}`);
    const dstUrl = this.isDebug ? DISCORD_WEBHOOK_TEST : webhookUrl;
    const res = await fetch(dstUrl, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({content: msg})
    });
    Logger.fexit(`Discord.post: ${msg}`);
    return res;
  }
}