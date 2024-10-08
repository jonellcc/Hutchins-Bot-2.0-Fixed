const axios = require("axios");
const fs = require("fs");
const path = require("path");
module.exports = {
  name: "tiktok",
  usedby: 0,
  onPrefix: true,
  dev: "Jonell Magallanes",
  cooldowns: 30,

onLaunch: async function({ api, event, target, actions }) {
  try {
    const searchQuery = target.join(" ");
    if (!searchQuery) {
      api.sendMessage("Usage: tiktok <search text>", event.threadID);
      return;
    }

    const s = await actions.reply("Searching");

    const response = await axios.get(`https://ccexplorerapisjonell.vercel.app/api/tiktok/searchvideo?keywords=${encodeURIComponent(searchQuery)}`);
    const videos = response.data.data.videos;

    if (!videos || videos.length === 0) {
      api.sendMessage("No videos found for the given search query.", event.threadID);
      return;
    }
const videoData = videos[0];
    const videoUrl = videoData.play;
    const message = `𝗧𝗶𝗸𝘁𝗼𝗸 𝗩𝗶𝗱𝗲𝗼 𝗥𝗲𝘀𝘂𝗹𝘁━━━━━━━━━━━━━━━━━━\nPosted by: ${videoData.author.nickname}\nUsername: ${videoData.author.unique_id}\n\nTitle: ${videoData.title}`;

    const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
    const writer = fs.createWriteStream(filePath);
    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    videoResponse.data.pipe(writer);

    writer.on('finish', () => { 
      api.unsendMessage(s.messageID);
      api.sendMessage({ body: message, attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          fs.unlinkSync(filePath);
        }
      );
    });
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("An error occurred while processing the request.", event.threadID);
  }
}
}
