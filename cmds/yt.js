const fs = require('fs');
const path = require('path');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    name: "yt",
    usedby: 0,
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
            const findingMessage = await api.sendMessage(`🔍 | Finding "${videoQuery}". Please wait...`, event.threadID);

            const searchResults = await yts(videoQuery);
            const firstResult = searchResults.videos[0];

            if (!firstResult) {
                await api.editMessage(`❌ | No results found for "${videoQuery}".`, findingMessage.messageID, event.threadID);
                return;
            }

            const { title, url } = firstResult;

            await api.editMessage(`⏱️ | Video Title has been Found: "${title}". Downloading...`, findingMessage.messageID);

            const filePath = path.resolve(__dirname, 'cache', `${Date.now()}-${title}.mp4`);

            const videoStream = ytdl(url, {
                filter: format => format.hasAudio && format.hasVideo,
                quality: 'highest', 
                highWaterMark: 1 << 25
            });

            const fileStream = fs.createWriteStream(filePath);
            videoStream.pipe(fileStream);

            fileStream.on('finish', async () => {
                const bold = global.fonts.bold("Video Player");
                await api.sendMessage({
                    body: `🎥 ${bold}\n${global.line}\nHere is your video based on your search "${videoQuery}"\n\nTitle: ${title}\nYoutube Link: ${url}`,
                    attachment: fs.createReadStream(filePath)
                }, event.threadID);

                fs.unlinkSync(filePath);
                api.unsendMessage(findingMessage.messageID);
            });

            videoStream.on('error', async (error) => {
                console.error(error);
                await api.editMessage(`❌ | ${error.message}`, findingMessage.messageID, event.threadID);
                fs.unlinkSync(filePath);
            });
        } catch (error) {
            console.error(error);
            await api.editMessage(`❌ | ${error.message}`, findingMessage.messageID, event.threadID);
        }
    }
};
