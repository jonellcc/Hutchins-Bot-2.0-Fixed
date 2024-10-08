const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = {
    name: "ss",
    usedby: 0,
    info: "Takes a screenshot of the provided URL, provides status code, and checks SSL certificate validity.",
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 6,
    dmUser: false,

onLaunch: async function ({ api, event, target }) {
    const url = target[0];
    const device = target[1] || 'iphone';

    if (!url) {
        return api.sendMessage("Please provide a URL.", event.threadID, event.messageID);
    }
      const check = await api.sendMessage("Capturing.....", event.threadID, event.messageID);
    const filePath = path.join(__dirname, 'cache', `screenshot-${Date.now()}.png`);

    try {
        const screenshotResponse = await axios({
            method: 'get',
            url: `https://render-puppeteer-test-sspb.onrender.com/ss?url=${url}&device=${device}`,
            responseType: 'arraybuffer',
        });

        const statusCode = screenshotResponse.status;

        const certCheck = new Promise((resolve, reject) => {
            const req = https.get(url, (res) => {
                const certificate = res.socket.getPeerCertificate();
                if (Object.keys(certificate).length === 0) {
                    resolve('No SSL certificate found.');
                } else {
                    const validFrom = new Date(certificate.valid_from);
                    const validTo = new Date(certificate.valid_to);
                    const currentDate = new Date();
                    if (currentDate >= validFrom && currentDate <= validTo) {
                        resolve('SSL Certificate is valid.');
                    } else {
                        resolve('SSL Certificate is invalid.');
                    }
                }
            });

            req.on('error', (error) => reject('Error checking certificate.'));
            req.end();
        });

        fs.writeFileSync(filePath, Buffer.from(screenshotResponse.data, 'binary'));
      api.unsendMessage(check.messageID);
        const certStatus = await certCheck;

        api.sendMessage({
            body: `Screenshot of ${url} on ${device}\nStatus Code: ${statusCode}\nCertificate Status: ${certStatus}`,
            attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
            fs.unlinkSync(filePath);
        }, event.messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage(error.message, event.threadID, event.messageID);
    }
}
}
