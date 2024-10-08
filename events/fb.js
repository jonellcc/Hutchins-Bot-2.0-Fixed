const getFBInfo = require("@xaviabot/fb-downloader");
const axios = require('axios');
const fs = require('fs');
const gradient = require('gradient-string');
module.exports = {
    name: 'fbauto',
    ver: '1.0',
    prog: 'Jonell Magallanes',

    onEvents: async function ({ api, event }) {
        if (event.type === 'message') {
            const message = event.body.trim();
            const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S*/;

            if (facebookLinkRegex.test(message)) {
                await downloadAndSendFBContent(message, api, event);
                console.log(gradient.morning(`Facebook Downloader Executed`));
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
