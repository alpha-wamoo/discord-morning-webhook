import LLM from "./modules/LLM.js";
// import OpenAI from "./modules/OpenAI.js";
import Discord from "./modules/Discord.js";
import Util from "./modules/Util.js";
import Logger from "./modules/Logger.js";

Logger.fcall("initialize Secrets");
/**@type {{[key: string]: string}} */
const {DISCORD_WEBHOOK_TEST, DISCORD_WEBHOOK_GENERAL, DISCORD_WEBHOOK_PHRASE, IS_DEBUG} = process.env;
if(!DISCORD_WEBHOOK_GENERAL || !DISCORD_WEBHOOK_PHRASE || !DISCORD_WEBHOOK_TEST){
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
  const AI_REQUESTS = loadAIRequests();

  if(isDebug) Logger.info("debug: Discordへのメッセージはテストチャンネルに送信されます");
  const reply = (await ai.talk(AI_REQUESTS, false))?.message?.content;
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

/**
 * @async @method
 * @returns {import("./json/Config.json")}
 */
async function loadConfig(){
  const response = await fetch("./json/Config.json");
  const data = await response.json();
  return data;
}

/**
 * @async @method
 * @returns {import("./json/AIRequestMessages.json")}
 */
async function loadAIRequests(){
  const response = await fetch("./json/AIRequestMessages.json");
  const data = await response.json();
  return data;
}