const axios = require('axios');
const fs = require('fs');
const getFBInfo = require("@xaviabot/fb-downloader");

module.exports = {
    name: 'adown',
    ver: '1.0',
    prog: 'Jonell Magallanes',

    onEvents: async function ({ api, event }) {
        if (event.type === 'message') {
            const message = event.body.trim();
            const tiktokLinkRegex = /https:\/\/(www\.|vt\.)?tiktok\.com\/\S*/;
            const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S*/;
            const capcutLinkRegex = /https:\/\/www\.capcut\.com\/t\/\S*/;

            if (tiktokLinkRegex.test(message)) {
                downloadAndSendTikTokContent(message, api, event);
            } else if (facebookLinkRegex.test(message)) {
                downloadAndSendFBContent(message, api, event);
            } else if (capcutLinkRegex.test(message)) {
                downloadAndSendCapcutContent(message, api, event);
            }
        }
    }
};



async function downloadAndSendFBContent(url, api, event) {
    const fbvid = `./FBVideo-${Date.now()}.mp4`;
    try {
        const result = await getFBInfo(url);
        let videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
        fs.writeFileSync(fbvid, Buffer.from(videoData.data, "utf-8"));

        api.sendMessage({
            body: "𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 𝗔𝘂𝘁𝗼\n━━━━━━━━━━━━━━━━━━",
            attachment: fs.createReadStream(fbvid)
        }, event.threadID, () => {
            fs.unlinkSync(fbvid);
        });
    } catch (e) {
        console.log(e);
    }
}

async function downloadAndSendCapcutContent(url, api, event) {
    try {
        const response = await axios.get(`https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/capcut?url=${url}`);
        const { result } = response.data;

        const capcutFileName = `Capcut-${Date.now()}.mp4`;
        const capcutFilePath = `./${capcutFileName}`;

        const videoResponse = await axios({
            method: 'get',
            url: result.video_ori,
            responseType: 'arraybuffer'
        });

        fs.writeFileSync(capcutFilePath, Buffer.from(videoResponse.data, 'binary'));

        api.sendMessage({
            body: `𝗖𝗮𝗽𝗰𝘂𝘁 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 𝗔𝘂𝘁𝗼\n━━━━━━━━━━━━━━━━━━\n\n𝗧𝗶𝘁𝗹𝗲: ${result.title}\n\n𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${result.description}`,
            attachment: fs.createReadStream(capcutFilePath)
        }, event.threadID, () => {
            fs.unlinkSync(capcutFilePath);
        });
    } catch (e) {
        console.log(e);
    }
}
