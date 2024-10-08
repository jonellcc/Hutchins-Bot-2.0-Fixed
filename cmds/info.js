const fs = require('fs');
const path = require('path');
const request = require('request');
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));

module.exports = {
  name: "info",
  usedby: 0,
  dev: "Jonell Magallanes",
  info: "Show the info of owner",  onPrefix: true,
  cooldowns: 8,

    onLaunch: async function ({ api, event }) {
    const imageUrl = "https://i.postimg.cc/vZPSvwrj/KsBpoIu.png";
    const imagePath = path.join(__dirname, 'cache', 'ownerInfo.png');

    fs.mkdirSync(path.dirname(imagePath), { recursive: true });
    const imageStream = fs.createWriteStream(imagePath);
    request(imageUrl).pipe(imageStream).on('close', () => {
      api.sendMessage(
        {
          body: `𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗼𝗳 𝗔𝗱𝗺𝗶𝗻𝗕𝗼𝘁\n━━━━━━━━━━━━━━━━━━\nName Owner: ${adminConfig.ownerName}\nBotname: ${adminConfig.botName}\nSystem Prefix: ${adminConfig.prefix}\nOwnerFB: ${adminConfig.facebookLink}`,
          attachment: fs.createReadStream(imagePath),
        },
        event.threadID
      );
    });
  },
};