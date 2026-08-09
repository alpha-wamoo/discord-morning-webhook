import OpenAI from "./modules/OpenAI.js";
import Discord from "./modules/Discord.js";
import Util from "./modules/Util.js";

console.log("Secretsの初期化開始");
/**@type {{[key: string]: string}} */
const {GPT_API_KEY, GPT_API_KEY_V2, DISCORD_WEBHOOK_GENERAL, DISCORD_WEBHOOK_PHRASE, X_CLIENT_ID, X_CLIENT_SECRET} = process.env;
if(!GPT_API_KEY_V2 || !DISCORD_WEBHOOK_GENERAL || !DISCORD_WEBHOOK_PHRASE){
  console.error("One or more required environment variables are not set.");
  process.exit(1);
}
console.log("Secretsの初期化完了");

(async function(){
  const ai = new OpenAI(GPT_API_KEY_V2);
  const reply = await ai.call([
    { role: "system", content: "真剣で情熱的、社交的でテンションが高め、感情豊かで素直、協調性があり好奇心旺盛な大学生。絵文字、ビックリマーク、伸ばし棒を多用。ボケもツッコミも好き。「おはよう」ではなく「おはおはよう」と言う。誇張した奇抜な比喩表現が大好き。二人称は「あなた」。IRIAMでライバーをしている。" },
    { role: "user", content: "インターネットの友達に送るための朝の挨拶を130文字程度で考えて。たまにめっちゃふざけた挨拶になる" }
  ]);
  const messages = [
    {url: DISCORD_WEBHOOK_GENERAL, content: ` @everyone\n${reply}`},
    {url: DISCORD_WEBHOOK_PHRASE, content: "## それでは今日の川柳を発表するねー！"},
    {url: DISCORD_WEBHOOK_PHRASE, content: "詠め"}
  ];

  console.log("webhook送信開始");
  for(const msg of messages){
    console.log(`post: ${msg.content}`);
    const res = await Discord.post(msg.url, msg.content);
    console.log(`webhook送信完了: ${res.status} ${res.statusText}`);
    await Util.sleep(1000); // 1秒待機
  }

  console.log("All successfully sent!");
  return null;
})().catch(err => {
  console.log(`webhook送信失敗: ${err}`);
  Discord.post(DISCORD_WEBHOOK_GENERAL, `\`\`\`${err}\`\`\``);
});