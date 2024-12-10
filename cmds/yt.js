const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yts = require('yt-search');

module.exports = {
    name: "yt",
    usedBy: 0,
    version: "1.0.0",
    info: "Get video",
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 10,

    onLaunch: async function ({ api, event, target }) {
        if (!target[0]) {
            return api.sendMessage(`❌ Please enter a video name!`, event.threadID);
        }

        try {
            const videoQuery = target.join(" ");
            const findingMessage = await api.sendMessage(`🔍 | Searching for "${videoQuery}". Please wait...`, event.threadID);

            // Search for the video
            const searchResults = await yts(videoQuery);
            const firstResult = searchResults.videos[0];

            if (!firstResult) {
                await api.editMessage(`❌ | No results found for "${videoQuery}".`, findingMessage.messageID, event.threadID);
                return;
            }

            const { title, url } = firstResult;

            await api.editMessage(`⏱️ | Video Found: "${title}". Fetching download link...`, findingMessage.messageID);

            // Fetch video download link
            const apiResponse = await axios.get(`https://yt-video-production.up.railway.app/ytdl?url=${url}`);
            const videoData = apiResponse.data;

            if (!videoData || !videoData.video) {
                await api.editMessage(`❌ | Failed to fetch the download link for "${title}".`, findingMessage.messageID);
                return;
            }

            const videoStream = await axios({
                url: videoData.video,
                method: 'GET',
                responseType: 'stream',
            });

            const filePath = path.resolve(__dirname, 'cache', `${Date.now()}-${title}.mp4`);
            const fileStream = fs.createWriteStream(filePath);

            videoStream.data.pipe(fileStream);

            fileStream.on('finish', async () => {
                await api.sendMessage({
                    body: `🎥 Here is your video based on your search "${videoQuery}":\n\nTitle: ${title}\nYouTube Link: ${url}`,
                    attachment: fs.createReadStream(filePath),
                }, event.threadID);

                fs.unlinkSync(filePath); // Clean up temporary file
                api.unsendMessage(findingMessage.messageID);
            });

            videoStream.data.on('error', async (error) => {
                console.error(error);
                await api.editMessage(`❌ | Error while downloading the video: ${error.message}`, findingMessage.messageID);
                fs.unlinkSync(filePath);
            });
        } catch (error) {
            console.error(error);
            await api.editMessage(`❌ | An unexpected error occurred: ${error.message}`, findingMessage.messageID);
        }
    }
};
