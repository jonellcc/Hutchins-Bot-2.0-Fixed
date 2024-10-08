const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  name: "upscale",
  usedby: 0,
  onPrefix: false,
  dev: "Jonell Magallanes",
  cooldowns: 2,

  onLaunch: async function ({ api, event, target }) {
    const pathie = './cmds/cache/enhanced.jpg';
    const { threadID, messageID } = event;

    const james = event.messageReply.attachments[0].url || target.join(" ");

    try {
      const hshs = await api.sendMessage("⏱️ | Your Photo is Enhancing. Please Wait....", threadID, messageID);

      const response = await axios.get(`https://hiroshi-api.onrender.com/image/upscale?url=${encodeURIComponent(james)}`);
      const processedImageURL = response.data; 

      const imgResponse = await axios.get(processedImageURL, { responseType: 'stream' });
      const writer = fs.createWriteStream(pathie);
      imgResponse.data.pipe(writer);

      writer.on('finish', () => {
        api.unsendMessage(hshs.messageID);
        api.sendMessage({
          body: "🖼️ | Your Photo has been Enhanced!",
          attachment: fs.createReadStream(pathie)
        }, threadID, () => fs.unlinkSync(pathie), messageID);
      });

      writer.on('error', (error) => {
        api.sendMessage(`❎ | Error writing image to file: ${error}`, threadID, messageID);
      });

    } catch (error) {
      api.sendMessage(`❎ | Error processing image: ${error}`, threadID, messageID);
    }
  }
};
