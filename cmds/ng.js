const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
  name: "ng",
  usedby: 0,
  info: "Get music from Newgrounds",
  onPrefix: true,
  dev: "Jonell Magallanes",
  cooldowns: 10,

onLaunch: async function ({ api, event, target}) {
  if (!target[0]) {
    return api.sendMessage(`❌ Please enter a music name!`, event.threadID);
  }

  try {
    const song = target.join(" ");
    const findingMessage = await api.sendMessage(`🔍 | Finding "${song}". Please wait...`, event.threadID);

    const titlesResponse = await axios.get(`https://jonellprojectccapisexplorer.onrender.com/api/newgrounds?query=${song}`);
    const titlesData = titlesResponse.data;

    if (!titlesData.length) {
      await api.sendMessage(`❌ | No results found for "${song}".`, event.threadID);
      return;
    }

    const firstResult = titlesData[0];
    const { title, link } = firstResult;

    const audioResponse = await axios.get(`https://ccprojectexplorexapisjonellmagallanes.onrender.com/api/ng?play=${song}`);
    const audioData = audioResponse.data;

    if (!audioData || !audioData.url) {
      await api.sendMessage(`❌ | No audio found for "${song}".`, event.threadID);
      return;
    }

    const { url: audioUrl } = audioData;

    await api.editMessage(`⏱️ | Music Title has been Found: "${title}". Downloading...`, findingMessage.messageID);

    const responseStream = await axios.get(audioUrl, {
      responseType: 'stream',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const filePath = path.resolve(__dirname, 'cache', `${Date.now()}-${title}.mp3`);
    const fileStream = fs.createWriteStream(filePath);

    responseStream.data.pipe(fileStream);

    fileStream.on('finish', async () => {
      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 25) {
        await api.sendMessage(`❌ | The file size exceeds 25MB limit. Unable to send "${title}".`, event.threadID);
        fs.unlinkSync(filePath);
        return;
      }

      await api.sendMessage({
        body: `🎵 | Here is your music: "${title}"\n\nTitle: ${title}\nNewgrounds Link: ${link}\nDownload Link: ${audioUrl}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID);

      fs.unlinkSync(filePath);
      api.unsendMessage(findingMessage.messageID);
    });

    responseStream.data.on('error', async (error) => {
      console.error(error);
      await api.sendMessage(`❌ | Sorry, there was an error downloading the music: ${error.message}`, event.threadID);
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error(error);
    await api.sendMessage(`❌ | Sorry, there was an error getting the music: ${error.message}`, event.threadID);
  }
}
}