const axios = require('axios');

const fonts = {

    mathsans: {
        a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
    J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
    S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
    }
};
const stickers = [
  "254594546003916", "254595732670464", "254593389337365",
  "37117808696806", "254597316003639", "254598806003490",
  "254596219337082", "2379537642070973", "2379545095403561",
  "2379551785402892", "254597059336998"
];
const rolePlay = "quand tu répond à cette question ajoutes des emojis convenable :\n\n";

const Prefixes = [
  'ae',
  'ai',
  'mitama',
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "𝐄𝐯𝐚𝐫𝐢𝐬𝐭𝐞",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {

      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
      if (!prompt) {
      const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
        await api.sendMessage({ sticker: randomSticker }, event.threadID);
api.setMessageReaction("📚", event.messageID, () => {}, true);
        return;
      }
      const senderID = event.senderID;
      const senderInfo = await api.getUserInfo([senderID]);
      const senderName = senderInfo[senderID].name;
      const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(rolePlay + prompt)}`);
      const answer = `📚 𝐄𝐕𝐀𝐑𝐈𝐒𝐓𝐄 📚 :\n\n${response.data.answer} `;
api.setMessageReaction("🌱", event.messageID, () => {}, true);

      //apply const font to each letter in the answer
      let formattedAnswer = "";
      for (let letter of answer) {
        formattedAnswer += letter in fonts.mathsans ? fonts.mathsans[letter] : letter;
      }

      await message.reply(formattedAnswer);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
