const fs = require('fs');
const path = require('path');
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
const THREADS_FILE = path.resolve(__dirname, 'cache', 'inbox_threads.json');

function saveInboxThreads(threads) {
    fs.writeFileSync(THREADS_FILE, JSON.stringify(threads, null, 2));
}

function loadInboxThreads() {
    if (fs.existsSync(THREADS_FILE)) {
        const data = fs.readFileSync(THREADS_FILE);
        return JSON.parse(data);
    }
    return [];
}

module.exports = {
    name: "inbox",
    usedby: 2,
    info: "Manage inbox threads",
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 1,

    onLaunch: async function ({ api, event, target, actions }) {
        try {
            const hs = await actions.send("Loading inbox threads....");
            let inboxThreads = loadInboxThreads();

            if (target.length > 0 && target[0] === "out") {
                let index = parseInt(target[1], 10) - 1;
                if (!isNaN(index) && index >= 0 && index < inboxThreads.length) {
                    let threadToLeave = inboxThreads[index];

                    await api.sendMessage("☁️ 𝗕𝗼𝘁 𝗟𝗲𝗳𝘁 𝗚𝗿𝗼𝘂𝗽 𝗖𝗵𝗮𝘁\n━━━━━━━━━━━━━━━━━━\nThis group chat bot left from the group decided by adminbot to left this group chat....", threadToLeave.id);
                    await api.removeUserFromGroup(api.getCurrentUserID(), threadToLeave.id);

                    inboxThreads.splice(index, 1);
                    saveInboxThreads(inboxThreads);
                } else {
                    await api.sendMessage("Invalid index provided. Please reply with a valid number from the list.", event.threadID);
                }
            } else {
                var inbox = await api.getThreadList(100, null, ['INBOX']);
                let inboxGroups = [...inbox].filter(group => group.isSubscribed && group.isGroup);

                var inboxThreadData = [];
                for (var groupInfo of inboxGroups) {
                    let threadInfo = await api.getThreadInfo(groupInfo.threadID);
                    inboxThreadData.push({
                        id: groupInfo.threadID,
                        name: groupInfo.name,
                        memberCount: threadInfo.userInfo.length
                    });
                }

                var sortedInboxThreads = inboxThreadData.sort((a, b) => b.memberCount - a.memberCount);

                let msg = '', i = 1;
                var groupIds = [];
                for (var group of sortedInboxThreads) {
                    msg += `\n━━━━━━━━━━━━━━━━━━\n${i++}. ${group.name}\nTID: ${group.id}\nMember: ${group.memberCount}\n━━━━━━━━━━━━━━━━━━\n\n`;
                    groupIds.push(group.id);
                }

                await api.editMessage(`📒 𝗚𝗿𝗼𝘂𝗽 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁 𝗠𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁\n━━━━━━━━━━━━━━━━━━\n${msg}\nPlease command ${adminConfig.prefix}inbox out <number list of group chat>`, hs.messageID, event.threadID);
                saveInboxThreads(sortedInboxThreads);
            }

        } catch (error) {
            console.error("Error managing inbox threads:", error);
            await api.sendMessage("An error occurred while managing inbox threads.", event.threadID);
        }
    }
};
