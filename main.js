import LLM from "./modules/LLM.js";
// import OpenAI from "./modules/OpenAI.js";
import Discord from "./modules/Discord.js";
import Util from "./modules/Util.js";
import Logger from "./modules/Logger.js";

Logger.fcall("initialize Secrets");
/**@type {{[key: string]: string}} */
const {GPT_API_KEY, GPT_API_KEY_V2, DISCORD_WEBHOOK_GENERAL, DISCORD_WEBHOOK_PHRASE, X_CLIENT_ID, X_CLIENT_SECRET} = process.env;
if(!GPT_API_KEY_V2 || !DISCORD_WEBHOOK_GENERAL || !DISCORD_WEBHOOK_PHRASE){
  Logger.error("One or more required environment variables are not set.");
  process.exit(1);
}
Logger.fexit("initialize Secrets");

const AI_MESSAGES = [
  { role: "system", content: "真剣で情熱的、社交的でテンションが高め、感情豊かで素直、協調性があり好奇心旺盛な大学生。絵文字、ビックリマーク、伸ばし棒を多用。ボケもツッコミも好き。「おはよう」ではなく「おはおはよう」と言う。誇張した奇抜な比喩表現が大好き。二人称は「あなた」。IRIAMでライバーをしている。" },
  { role: "user", content: "インターネットの友達に送るための朝の挨拶を130文字程度で考えて。たまにめっちゃふざけた挨拶になる" }
];
const ai = new LLM();

(async function main(){
  Logger.fcall("main");
  const reply = (await ai.talk(AI_MESSAGES, false)).message.content;
  Logger.info(`AIの返信: ${reply}`);
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
      Logger.error(`送信失敗: ${err.message}`);
    }
  }
  Logger.fexit("webhook送信");

  Logger.fexit("main");
  return null;
})().catch(err => {
  Logger.error(`webhook送信失敗: ${err}`);
  Discord.post(DISCORD_WEBHOOK_GENERAL, `\`\`\`${err}\`\`\``);
});