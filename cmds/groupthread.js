const fs = require('fs');

let bannedThreads = {};

try {
    bannedThreads = JSON.parse(fs.readFileSync('./database/ban/threads.json'));
} catch (err) {
    console.error("Error reading banned threads data file:", err);
}

const saveBannedData = () => {
    fs.writeFileSync('./database/ban/threads.json', JSON.stringify(bannedThreads, null, 2));
};

module.exports = {
    name: "groupthread",
    usedby: 4,
    info: "Ban or unban group threads",
    onPrefix: true,
    cooldowns: 20,

    onLaunch: async function ({ event, target, api }) {
        const action = target[0].toLowerCase();
        let targetID = target[1] || event.threadID;
        const reason = target.slice(2).join(' ') || "Violation of group rules";

        if (action === 'ban') {
            bannedThreads[targetID] = { reason };
            saveBannedData();
            return api.sendMessage(`𝗧𝗵𝗿𝗲𝗮𝗱 𝗕𝗮𝗻 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲\n━━━━━━━━━━━━━━━━━━\nThread ${targetID} has been banned. Reason: ${reason}`, event.threadID, () => {
                process.exit(1);
            });

        } else if (action === 'unban') {
            if (bannedThreads[targetID]) {
                delete bannedThreads[targetID];
                saveBannedData();
                return api.sendMessage(`𝗧𝗵𝗿𝗲𝗮𝗱 𝗨𝗻𝗯𝗮𝗻 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱\n━━━━━━━━━━━━━━━━━━\nThread ${targetID} has been unbanned.`, event.threadID, () => {
                    process.exit(1);
                });
            } else {
                return api.sendMessage(`𝗧𝗵𝗿𝗲𝗮𝗱 𝗚𝗰𝗕𝗮𝗻 𝗠𝗮𝗻𝗮𝗴𝗲𝗿\n━━━━━━━━━━━━━━━━━━\nThread ${targetID} is not banned.`, event.threadID);
            }
        } else {
            return api.sendMessage("Invalid action. Use 'ban' to ban a thread or 'unban' to unban a thread.", event.threadID);
        }
    }
};
