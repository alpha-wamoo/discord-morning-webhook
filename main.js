import LLM from "./modules/LLM.js";
// import OpenAI from "./modules/OpenAI.js";
import Discord from "./modules/Discord.js";
import Util from "./modules/Util.js";
import Logger from "./modules/Logger.js";

Logger.fcall("initialize Secrets");
/**@type {{[key: string]: string}} */
const {DISCORD_WEBHOOK_TEST, DISCORD_WEBHOOK_GENERAL, DISCORD_WEBHOOK_PHRASE, IS_DEBUG} = process.env;
if(!DISCORD_WEBHOOK_GENERAL || !DISCORD_WEBHOOK_PHRASE || !DISCORD_WEBHOOK_TEST || !IS_DEBUG){
  Logger.error("One or more required environment variables are not set.");
  if(!DISCORD_WEBHOOK_GENERAL) Logger.info("gen");
  if(!DISCORD_WEBHOOK_PHRASE) Logger.info("ph");
  if(!DISCORD_WEBHOOK_TEST) Logger.info("tst");
  process.exit(1);
}
Logger.fexit("initialize Secrets");

const ai = new LLM("discord-morning");

(async function main(){
  Logger.fcall("main");
  const isDebug = Boolean(IS_DEBUG);

  if(isDebug) Logger.info("debug: Discordへのメッセージはテストチャンネルに送信されます");
  const reply = (await ai.talk([
    {
      "role": "user",
      "content": "インターネットの友達に送るための朝の挨拶を200文字程度で考えて。たまにめっちゃふざけた挨拶になる"
    }
  ], false))?.message?.content;
  Logger.info(`AIのセリフ: ${reply}`);
  const WEBHOOK_MESSAGES = [
    {url: DISCORD_WEBHOOK_GENERAL, content: ` @everyone\n${reply}`},
    {url: DISCORD_WEBHOOK_PHRASE, content: "## それでは今日の川柳を発表するねー！"},
    {url: DISCORD_WEBHOOK_PHRASE, content: "詠め"}
  ];

  Logger.fcall("webhook送信");
  for(const msg of WEBHOOK_MESSAGES){
    try{
      Logger.info(`post: ${msg.content}`);
      const res = await Discord.post(msg.url, msg.content);
      Logger.info(`送信完了: ${res.status} ${res.statusText}`);
      await Util.sleep(1000); // 1秒待機
    } catch (err) {
      Logger.error(`送信失敗: ${err}`);
    }
  }
  Logger.fexit("webhook送信");

  Logger.fexit("main");
  return null;
})().catch(err => {
  Logger.error(`main | ${err}`);
  Discord.post(DISCORD_WEBHOOK_GENERAL, `\`\`\`${err}\`\`\``);
});