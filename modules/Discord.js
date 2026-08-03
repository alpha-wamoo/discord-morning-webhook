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
   */
  static post(webhookUrl, msg){
    const msgObj = {content: msg};
    UrlFetchApp.fetch(webhookUrl, {
      "method": "POST",
      "headers": {'Content-type': "application/json"},
      "payload": JSON.stringify(msgObj)
    });
  }
}