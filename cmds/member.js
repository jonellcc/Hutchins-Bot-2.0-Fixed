const fs = require('fs');
const path = require('path');

const bannedUsersDir = path.join(__dirname, 'cache');
const warn = {};

if (!fs.existsSync(bannedUsersDir)) {
    fs.mkdirSync(bannedUsersDir, { recursive: true });
}

module.exports = {
    name: "member",
    usedby: 1,
    info: "Manage group members",
    onPrefix: true,
    usages: "",
    cooldowns: 2,
    dev: "Jonell Magallanes",

    noPrefix: async function ({ api, event, actions }) {
        const botId = api.getCurrentUserID();
        const threadId = event.threadID.toString();

        if (event.body && event.isGroup) {
            const userId = event.senderID.toString();
            const bannedUsersFilePath = path.join(bannedUsersDir, `${threadId}.json`);

            let bannedUsers = [];
            if (fs.existsSync(bannedUsersFilePath)) {
                bannedUsers = JSON.parse(fs.readFileSync(bannedUsersFilePath));
            }

            if (bannedUsers.includes(userId)) {
                try {
                    api.removeUserFromGroup(userId, threadId);
                    const userInfo = await api.getUserInfo(userId);
                    const userName = userInfo[userId].name;
                    api.sendMessage(`👤 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝗚𝗿𝗼𝘂𝗽\n━━━━━━━━━━━━━━━━━━\nUser ${userName} is banned from this group and has been removed.`, threadId);
                } catch (error) {
                    console.error(`Failed to handle banned user removal: ${error}`);
                }
            }
        }

        if (event.logMessageType === 'log:subscribe' && event.logMessageData.addedParticipants.some(participant => participant.userFbId)) {
            const addedUserId = event.logMessageData.addedParticipants[0].userFbId.toString();
            const adderUserId = event.author.toString();
            const bannedUsersFilePath = path.join(bannedUsersDir, `${threadId}.json`);

            let bannedUsers = [];
            if (fs.existsSync(bannedUsersFilePath)) {
                bannedUsers = JSON.parse(fs.readFileSync(bannedUsersFilePath));
            }

            if (bannedUsers.includes(addedUserId)) {
                try {
                    api.removeUserFromGroup(addedUserId, threadId);
                    const addedUserInfo = await api.getUserInfo(addedUserId);
                    const addedUserName = addedUserInfo[addedUserId].name;
                    api.sendMessage(`👤 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝗚𝗿𝗼𝘂𝗽\n━━━━━━━━━━━━━━━━━━\nUser ${addedUserName} is banned from this group and has been removed.`, threadId);

                    if (!warn[adderUserId]) {
                        warn[adderUserId] = 1;
                        const adderUserInfo = await api.getUserInfo(adderUserId);
                        const adderUserName = adderUserInfo[adderUserId].name;
                        api.sendMessage(`⚠️ 𝗪𝗮𝗿𝗻𝗶𝗻𝗴\n━━━━━━━━━━━━━━━━━━\n${adderUserName}, you attempted to re-add a banned user. This is your first warning.`, threadId);
                    } else {
                        warn[adderUserId]++;
                        if (warn[adderUserId] >= 2) {
                            api.removeUserFromGroup(adderUserId, threadId);
                            const adderUserInfo = await api.getUserInfo(adderUserId);
                            const adderUserName = adderUserInfo[adderUserId].name;
                            api.sendMessage(`👤 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝗚𝗿𝗼𝘂𝗽\n━━━━━━━━━━━━━━━━━━\n${adderUserName}, you have been removed for repeatedly attempting to re-add banned users.`, threadId);
                        } else {
                            const adderUserInfo = await api.getUserInfo(adderUserId);
                            const adderUserName = adderUserInfo[adderUserId].name;
                            api.sendMessage(`⚠️ 𝗪𝗮𝗿𝗻𝗶𝗻𝗴\n━━━━━━━━━━━━━━━━━━\n${adderUserName}, you attempted to re-add a banned user again. This is your final warning.`, threadId);
                        }
                    }
                } catch (error) {
                    console.error(`Failed to handle user re-addition: ${error}`);
                }
            }
        }
    },

    onLaunch: async ({ api, event, target }) => {
        const botId = api.getCurrentUserID();
        const threadId = event.threadID.toString();

        try {
            const threadInfo = await api.getThreadInfo(threadId);
            const adminIds = threadInfo.adminIDs.map(admin => admin.id);
            if (!adminIds.includes(botId)) {
                api.sendMessage("Need Admin Privilege to perform administrative actions.", threadId);
                return;
            }
        } catch (error) {
            console.error(`Failed to check admin privileges: ${error}`);
            api.sendMessage("Failed to check admin privileges.", threadId);
            return;
        }

        const command = target[0];
        const bannedUsersFilePath = path.join(bannedUsersDir, `${threadId}.json`);

        let bannedUsers = [];
        if (fs.existsSync(bannedUsersFilePath)) {
            bannedUsers = JSON.parse(fs.readFileSync(bannedUsersFilePath));
        }

        const userId = event.senderID;

        // Fetch thread info to check if the user is an admin
        const threadInfo = await api.getThreadInfo(threadId);
        const isAdmin = threadInfo.adminIDs.some(admin => admin.id === userId);

        if (!isAdmin) {
            api.sendMessage(`🚫 You're not an admin in this group. You cannot execute this command.`, threadId);
            return;
        }

        if (command === 'ban') {
            const targetUserId = Object.keys(event.mentions)[0] || target[1];
            if (targetUserId) {
                if (!bannedUsers.includes(targetUserId)) {
                    bannedUsers.push(targetUserId);
                    updateBannedUsersFile(bannedUsers, bannedUsersFilePath);
                    try {
                        api.removeUserFromGroup(targetUserId, threadId);
                        const userInfo = await api.getUserInfo(targetUserId);
                        const userName = userInfo[targetUserId].name;
                        api.sendMessage(`👤 𝗕𝗮𝗻𝗻𝗲𝗱 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝗚𝗿𝗼𝘂𝗽\n━━━━━━━━━━━━━━━━━━\nUser ${userName} has been banned and removed from this group.`, threadId);
                    } catch (error) {
                        console.error(`Failed to ban user: ${error}`);
                    }
                } else {
                    try {
                        const userInfo = await api.getUserInfo(targetUserId);
                        const userName = userInfo[targetUserId].name;
                        api.sendMessage(`⚠️ 𝗔𝗹𝗿𝗲𝗮𝗱𝘆 𝗕𝗮𝗻𝗻𝗲𝗱\n━━━━━━━━━━━━━━━━━━\nUser ${userName} is already banned from this group.`, threadId);
                    } catch (error) {
                        console.error(`Failed to get user info: ${error}`);
                    }
                }
            } else {
                api.sendMessage(`❗ 𝗘𝗿𝗿𝗼𝗿\n━━━━━━━━━━━━━━━━━━\nPlease mention a user or provide a user ID to ban.`, threadId);
            }
        } else if (command === 'unban') {
            const targetUserId = Object.keys(event.mentions)[0] || target[1];
            if (targetUserId) {
                const index = bannedUsers.findIndex(ban => ban === targetUserId);
                if (index !== -1) {
                    bannedUsers.splice(index, 1);
                    updateBannedUsersFile(bannedUsers, bannedUsersFilePath);
                    try {
                        const userInfo = await api.getUserInfo(targetUserId);
                        const userName = userInfo[targetUserId].name;
                        api.sendMessage(`✅ 𝗨𝗻𝗯𝗮𝗻𝗻𝗲𝗱\n━━━━━━━━━━━━━━━━━━\nUser ${userName} has been unbanned from this group.`, threadId);
                    } catch (error) {
                        console.error(`Failed to unban user: ${error}`);
                    }
                } else {
                    try {
                        const userInfo = await api.getUserInfo(targetUserId);
                        const userName = userInfo[targetUserId].name;
                        api.sendMessage(`⚠️ 𝗡𝗼𝘁 𝗕𝗮𝗻𝗻𝗲𝗱\n━━━━━━━━━━━━━━━━━━\nUser ${userName} is not banned from this group.`, threadId);
                    } catch (error) {
                        console.error(`Failed to get user info: ${error}`);
                    }
                }
            } else {
                api.sendMessage(`❗ 𝗘𝗿𝗿𝗼𝗿\n━━━━━━━━━━━━━━━━━━\nPlease mention a user or provide a user ID to unban.`, threadId);
            }
        } else if (command === 'list') {
            if (bannedUsers.length > 0) {
                try {
                    const userInfo = await api.getUserInfo(bannedUsers);
                    const bannedList = bannedUsers.map(ban => userInfo[ban].name).join(', ');
                    api.sendMessage(`📝 𝗟𝗶𝘀𝘁 𝗼𝗳 𝗕𝗮𝗻𝗻𝗲𝗱 𝗨𝘀𝗲𝗿𝘀\n━━━━━━━━━━━━━━━━━━\n${bannedList}`, threadId);
                } catch (error) {
                    console.error(`Failed to get banned user info: ${error}`);
                }
            } else {
                api.sendMessage(`ℹ️ 𝗡𝗼 𝗕𝗮𝗻𝗻𝗲𝗱 𝗨𝘀𝗲𝗿𝘀\n━━━━━━━━━━━━━━━━━━\nThere are currently no banned users in this group.`, threadId);
            }
        }
    }
};

function updateBannedUsersFile(bannedUsers, filePath) {
    fs.writeFileSync(filePath, JSON.stringify(bannedUsers, null, 2));
}
 