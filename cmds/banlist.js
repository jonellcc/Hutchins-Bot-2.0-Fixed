const fs = require('fs');

let bannedThreads = {};
let bannedUsers = {};

try {
    bannedThreads = JSON.parse(fs.readFileSync('./database/ban/threads.json'));
} catch (err) {
    console.error("Error reading banned threads data file:", err);
}

try {
    bannedUsers = JSON.parse(fs.readFileSync('./database/ban/users.json'));
} catch (err) {
    console.error("Error reading banned users data file:", err);
}

module.exports = {
    name: "banlist",
    usedby: 4,
    info: "Get list of all banned threads and users",
    onPrefix: true,
    cooldowns: 20,

    onLaunch: async function ({ event, api }) {
        const getThreadName = async (threadID) => {
            return new Promise((resolve) => {
                api.getThreadInfo(threadID, (err, info) => {
                    if (err) return resolve(`Thread ID: ${threadID}`);
                    resolve(info.threadName || `Thread ID: ${threadID}`);
                });
            });
        };

        const getUserName = async (userID) => {
            return new Promise((resolve) => {
                api.getUserInfo(userID, (err, info) => {
                    if (err || !info[userID]) return resolve(`User ID: ${userID}`);
                    resolve(info[userID].name || `User ID: ${userID}`);
                });
            });
        };

        const bannedThreadList = await Promise.all(
            Object.keys(bannedThreads).map(async (threadID) => {
                const threadName = await getThreadName(threadID);
                return `━━━━━━━━━━━━━━━━━━\n👥 Group Chat: ${threadName}\n📝 Reason: ${bannedThreads[threadID].reason}\n━━━━━━━━━━━━━━━━━━\n`;
            })
        );

        const bannedUserList = await Promise.all(
            Object.keys(bannedUsers).map(async (userID) => {
                const userName = await getUserName(userID);
                return `━━━━━━━━━━━━━━━━━━\n👤 Name: ${userName}\n📝 Reason: ${bannedUsers[userID].reason}\n━━━━━━━━━━━━━━━━━━\n`;
            })
        );

        let message = "𝗕𝗮𝗻 𝗟𝗶𝘀𝘁\n━━━━━━━━━━━━━━━━━━\n";

        if (bannedThreadList.length > 0) {
            message += `Banned Threads:\n${bannedThreadList.join('\n')}\n\n`;
        } else {
            message += "No threads are banned.\n\n";
        }

        if (bannedUserList.length > 0) {
            message += `Banned Users:\n${bannedUserList.join('\n')}`;
        } else {
            message += "No users are banned.";
        }

        return api.sendMessage(message, event.threadID);
    }
};
