const fs = require('fs');

let bannedUsers = {};

try {
    bannedUsers = JSON.parse(fs.readFileSync('./database/ban/users.json'));
} catch (err) {
    console.error("Error reading banned users data file:", err);
}

const saveBannedData = () => {
    fs.writeFileSync('./database/ban/users.json', JSON.stringify(bannedUsers, null, 2));
};

module.exports = {
    name: "users",
    usedby: 4,
    info: "Ban or unban users",
    onPrefix: true,
    cooldowns: 20,

    onLaunch: async function ({ event, target, api }) {
        let action = target[0];
        let targetID;

        if (event.type === 'message_reply') {
            targetID = event.messageReply.senderID;
        } else {
            return api.sendMessage("𝗕𝗮𝗻 𝗦𝘆𝘀𝘁𝗲𝗺 𝗨𝘀𝗲𝗿 𝗠𝗮𝗻𝗮𝗴𝗲𝗿\n━━━━━━━━━━━━━━━━━━\nPlease reply to a message to ban or unban the user.", event.threadID);
        }

        let userName;
        try {
            const userInfo = await api.getUserInfo(targetID);
            userName = userInfo[targetID].name;
        } catch (err) {
            console.error("Error fetching user info:", err);
            return api.sendMessage("𝗕𝗮𝗻 𝗦𝘆𝘀𝘁𝗲𝗺 𝗨𝘀𝗲𝗿 𝗠𝗮𝗻𝗮𝗴𝗲𝗿\n━━━━━━━━━━━━━━━━━━\nFailed to retrieve user information.", event.threadID);
        }

        const reason = target.slice(1).join(' ') || "No reason provided";

        if (!action || !targetID) {
            return api.sendMessage("𝗕𝗮𝗻 𝗦𝘆𝘀𝘁𝗲𝗺 𝗨𝘀𝗲𝗿 𝗠𝗮𝗻𝗮𝗴𝗲𝗿\n━━━━━━━━━━━━━━━━━━\nUsage: Reply to a message with the command `!ban` or `!unban` followed by [reason] to ban/unban a user.", event.threadID);
        }

        if (action.toLowerCase() === 'ban') {
            bannedUsers[targetID] = { reason };
            saveBannedData();
            api.sendMessage(`𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 𝗕𝗮𝗻𝗻𝗲𝗱 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━━━━━━━━━\nUser ${userName} has been banned. Reason: ${reason}`, event.threadID, () => {
                process.exit(1);
            });
        } else if (action.toLowerCase() === 'unban') {
            if (bannedUsers[targetID]) {
                delete bannedUsers[targetID];
                saveBannedData();
                api.sendMessage(`𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱 𝗨𝗻𝗯𝗮𝗻𝗻𝗲𝗱 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━━━━━━━━━\nUser ${userName} has been unbanned.`, event.threadID, () => {
                    process.exit(1);  
                });
            } else {
                api.sendMessage("𝗕𝗮𝗻 𝗦𝘆𝘀𝘁𝗲𝗺 𝗨𝗻𝗯𝗮𝗻𝗻𝗲𝗱 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━━━━━━━━━\nThis user is not banned.", event.threadID);
            }
        } else {
            return api.sendMessage("𝗕𝗮𝗻 𝗦𝘆𝘀𝘁𝗲𝗺 𝗨𝘀𝗲𝗿 𝗠𝗮𝗻𝗮𝗴𝗲𝗿\n━━━━━━━━━━━━━━━━━━\nInvalid action. Use 'ban' to ban a user or 'unban' to unban a user.", event.threadID);
        }
    }
};
