const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const simpleYT = require('simple-youtube-api');
const gradient = require('gradient-string');
const youtube = new simpleYT('AIzaSyCMWAbuVEw0H26r94BhyFU4mTaP5oUGWRw');

const youtubeLinkPattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

module.exports = {
    name: 'ytauto',
    ver: '1.0',
    prog: 'Jonell Magallanes',

    onEvents: async function ({ api, event }) {
        if (event.type === 'message') {
            const videoUrl = event.body;

            if (youtubeLinkPattern.test(videoUrl)) {
                console.log(gradient.morning(`Youtube Downloader Executed`));
                try {
                    const video = await youtube.getVideo(videoUrl);
                    const stream = ytdl(videoUrl, { quality: 'highest' });

                    const fileName = `${event.threadID}.mp4`;
                    const filePath = path.join(__dirname, `./cache/${fileName}`);
                    const file = fs.createWriteStream(filePath);

                    stream.pipe(file);

                    file.on('finish', () => {
                        file.close(() => {
                            api.sendMessage({
                                body: `𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 𝗔𝘂𝘁𝗼\n━━━━━━━━━━━━━━━━━━\nTitle: ${video.title}`,
                                attachment: fs.createReadStream(filePath)
                            }, event.threadID, () => fs.unlinkSync(filePath));
                        });
                    });
                } catch (error) {
                    console.error('Error downloading video:', error);
                }
            }
        }
    }
};
