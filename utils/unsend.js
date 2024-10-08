const fs = require("fs");
const axios = require('axios');

const handleUnsend = async (api, event, msgData, getUserName) => {
    const messageID = event.messageID;
    if (msgData.hasOwnProperty(messageID)) {
        const unsentMessage = msgData[messageID].body;

        if (msgData[messageID].attachments.length > 0 && msgData[messageID].attachments[0].type === 'photo') {
            const photo = [];
            const del = [];

            for (const item of msgData[messageID].attachments) {
                try {
                    const { data } = await axios.get(item.url, { responseType: "arraybuffer" });
                    const filePath = `./database/${item.filename}.jpg`;
                    fs.writeFileSync(filePath, Buffer.from(data));
                    photo.push(fs.createReadStream(filePath));
                    del.push(filePath);
                } catch (err) {
                    console.error("Error downloading photo:", err);
                }
            }

            api.sendMessage({
                body: `𝗨𝗻𝘀𝗲𝗻𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲\n━━━━━━━━━━━━━━━━━━\n${await getUserName(api, event.senderID)} Unsent this photo: ${unsentMessage}`,
                attachment: photo
            }, event.threadID, () => {
                for (const item of del) fs.unlinkSync(item);
            });
        } else {
            api.sendMessage(`𝗨𝗻𝘀𝗲𝗻𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲\n━━━━━━━━━━━━━━━━━━\n${await getUserName(api, event.senderID)}  has unsent this message\n\nContent: ${unsentMessage}`, event.threadID);
        }
    }
};

module.exports = { handleUnsend };
