const capcutLinkRegex = /https:\/\/www\.capcut\.com\/t\/\S*/;
const axios = require('axios');
const fs = require('fs');
const gradient = require('gradient-string');
module.exports = {
    name: 'ccauto',
    ver: '1.0',
    prog: 'Jonell Magallanes',

    onEvents: async function ({ api, event }) {
        if (event.type === 'message') {
            const message = event.body.trim();

            if (capcutLinkRegex.test(message)) {
                await downloadAndSendCapcutContent(message, api, event);
                console.log(gradient.morning(`Capcut Downloader Executed`));
            }
        }
    }
};

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
