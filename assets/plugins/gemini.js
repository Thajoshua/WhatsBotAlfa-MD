const fs = require("fs");
const { command, isPrivate } = require("../../lib");
const gemini = require("../../lib/Gemini");
const config = require("../../config"); 

command(
  {
    pattern: "ai",
    fromMe: isPrivate,
    desc: "Generate text with gemini",
  },
  async (message, match, m) => {
    if(config.GEMINI_API === false) return console.log("Please add GEMINI_API in config.js or Config Variables")
    match = match || message.reply_message.text;
    const id = message.participant;
    if (!match) return await message.reply("Provide a prompt");
    if (message.reply_message && message.reply_message.video)
      return await message.reply("I can't generate text from video");
    if (
      message.reply_message &&
      (message.reply_message.image || message.reply_message.sticker)
    ) {
      const image = await m.quoted.download();

      fs.writeFileSync("image.jpg", image);
      const text = await gemini(match, image, {
        id,
      });
      return await message.reply(text);
    }
    match = message.reply_message
      ? message.reply_message.text + `\n\n${match || ""}`
      : match;
    const text = await gemini(match, null, { id });
    return await message.reply(text);
  }
);
