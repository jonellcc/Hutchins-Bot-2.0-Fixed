const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  name: "lyrics",
  usedby: 0,
  onPrefix: true,
  dev: "Jonell Magallanes",
  cooldowns: 2,
  dmUser: false,

  onLaunch: async function ({ api, event, target }) {
    const pathie = './cmds/cache/song_image.jpg';
    const { threadID, messageID } = event;
    const song = target.join(" ");

    try {
      const hshs = await api.sendMessage("🎵 | Searching Song lyrics. Please wait...", threadID, messageID);

      const response = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(song)}`);
      const data = response.data;

      const imgResponse = await axios.get(data.image, { responseType: 'stream' });
      const writer = fs.createWriteStream(pathie);
      imgResponse.data.pipe(writer);

      writer.on('finish', () => {
        const bold = global.fonts.bold("🎤 Lyrics");
        api.unsendMessage(hshs.messageID);
        api.sendMessage({
          body: `${bold}\n${global.line}\n🎶 | Song Information:\n\n` +
                `Title: ${data.title}\n` +
                `Artist: ${data.artist}\n\n` +
                `Lyrics:\n${data.lyrics}`,
          attachment: fs.createReadStream(pathie)
        }, threadID, () => fs.unlinkSync(pathie), messageID);
      });

      writer.on('error', (error) => {
        api.sendMessage(`❎ | ${error}`, threadID, messageID);
      });

    } catch (error) {
      api.sendMessage(`❎ | ${error}`, threadID, messageID);
    }
  }
};
