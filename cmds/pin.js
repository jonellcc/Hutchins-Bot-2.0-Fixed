const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

module.exports = {
    name: "pin",
    version: "1.0",
    usedby: 0,
    info: "Finding Image from Pinterest",
    dev: "Jonell Magallanes",
    onPrefix: false,
    usages: "[query]",
    cooldowns: 5,


onLaunch: async function ({ api, event, target }) {
    try {
        const keySearch = target.join(" ");

        if (!keySearch.includes("-")) {
            return api.sendMessage(
                `⛔ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝘀𝗲\n━━━━━━━━━━━━━━━\n\nPlease enter the search query and number of images (1-99). Example: ${global.cc.prefix}wallpaper -5`,
                event.threadID,
                event.messageID
            );
        }
 const lod = await api.sendMessage("Please Wait.....", event.threadID, event.messageID);
        const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
        let numberSearch = parseInt(keySearch.split("-").pop().trim()) || 10;

        if (isNaN(numberSearch) || numberSearch < 1 || numberSearch > 10) {
            return api.sendMessage(
                "⛔ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗡𝘂𝗺𝗯𝗲𝗿\n━━━━━━━━━━━━━━━\n\nPlease enter a valid number of images (1-99). Example: wallpaper -5",
                event.threadID,
                event.messageID
            );
        }

        const apiUrl = `https://ccexplorerapisjonell.vercel.app/api/pin?title=${keySearch}&count=${numberSearch}`;
        console.log(`Fetching data from API: ${apiUrl}`);

        const res = await axios.get(apiUrl);
        const data = res.data.data;

        if (!data || data.length === 0) {
            return api.sendMessage(
                `No results found for your query "${keySearchs}". Please try with a different query.`,
                event.threadID,
                event.messageID
            );
        }

        const imgData = [];

        for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
            console.log(`Fetching image ${i + 1} from URL: ${data[i]}`);
            const imgResponse = await axios.get(data[i], { responseType: "arraybuffer" });
            const imgPath = path.join(__dirname, "cache", `${i + 1}.jpg`);
            await fs.outputFile(imgPath, imgResponse.data);
            imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage({
            body: `📸 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁\n━━━━━━━━━━━━━━━\n\nHere are the top ${numberSearch} results for your query "${keySearchs}"`,
            attachment: imgData,
        }, event.threadID, event.messageID);
    api.unsendMessage(lod.messageID);
        console.log(`Images successfully sent to thread ${event.threadID}`);

        await fs.remove(path.join(__dirname, "cache"));
        console.log("Cache directory cleaned up.");

    } catch (error) {
        console.error("Error fetching images from Pinterest:", error);
        return api.sendMessage(
            `An error occurred while fetching images. Please try again later.`,
            event.threadID,
            event.messageID
        );
    }
}
}