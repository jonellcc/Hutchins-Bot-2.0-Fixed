const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  name: "removebg",
  usedby: 0,
  onPrefix: false,
  dev: "Jonell Magallanes",
  cooldowns: 2,

onLaunch: async function ({ api, event, target })  {
  const pathie = './cmds/cache/removed_bg.png';
  const { threadID, messageID } = event;

  const photoLink = event.messageReply.attachments[0].url || target.join(" ");

  try {
    api.sendMessage("⏳ | Removing background from your image...", threadID, messageID);

    const response = await axios.get(`https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/rbg?imageUrl=${encodeURIComponent(photoLink)}`);
    const removedBgImageUrl = response.data.image_data;

    const imgResponse = await axios.get(removedBgImageUrl, { responseType: "stream" });

    const writeStream = fs.createWriteStream(pathie);
    imgResponse.data.pipe(writeStream);

    writeStream.on('finish', () => {
      api.sendMessage({
        body: "✅ | Background removed successfully",
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);
    });
  } catch (error) {
    api.sendMessage(`❎ | Error removing background: ${error}`, threadID, messageID);
  }
}
}
