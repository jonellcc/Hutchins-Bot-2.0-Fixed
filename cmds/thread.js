const fs = require('fs');
const path = require('path');
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
const THREADS_FILE = path.resolve(__dirname, 'cache', 'threads.json');

function savePendingThreads(pending) {
    fs.writeFileSync(THREADS_FILE, JSON.stringify(pending, null, 2));
}

function loadPendingThreads() {
    if (fs.existsSync(THREADS_FILE)) {
        const data = fs.readFileSync(THREADS_FILE);
        return JSON.parse(data);
    }
    return [];
}

module.exports = {
    name: "thread",
    usedby: 2,
    info: "Manage thread approvals",
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 1,

    onReply: async function ({ reply, api, event }) {
        const { threadID, body } = event;
        const pending = loadPendingThreads();
        const index = parseInt(reply.split(" ")[0]) - 1;

        if (isNaN(index) || index < 0 || index >= pending.length) {
            return api.sendMessage("Invalid index provided. Please reply with a valid number from the list.", threadID);
        }

        const threadToApprove = pending[index];

        if (body.toLowerCase() === "approve") {
            await api.sendMessage("𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗚𝗿𝗼𝘂𝗽 𝗖𝗵𝗮𝘁\n━━━━━━━━━━━━━━━━━━\nYour thread has been successfully approved.", threadToApprove.threadID);
            await api.changeNickname(`${adminConfig.botName} • [ ${adminConfig.prefix} ]`, threadToApprove.threadID, api.getCurrentUserID());
            await api.sendMessage(`⚙️ 𝗧𝗵𝗿𝗲𝗮𝗱𝘀 𝗠𝗮𝗻𝗮𝗴𝗲𝗿 \n━━━━━━━━━━━━━━━━━━\nThe thread "${threadToApprove.name}" has been approved.`, threadID);
        } else if (body.toLowerCase() === "decline") {
            await api.sendMessage("❌ 𝗬𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗱𝗲𝗰𝗹𝗶𝗻𝗲𝗱.", threadToApprove.threadID);
            await api.sendMessage(`⚙️ 𝗧𝗵𝗿𝗲𝗮𝗱𝘀 𝗠𝗮𝗻𝗮𝗴𝗲𝗿 \n━━━━━━━━━━━━━━━━━━\nThe thread "${threadToApprove.name}" has been declined.`, threadID);
        } else {
            return api.sendMessage("Invalid response. Please reply with 'approve' or 'decline'.", threadID);
        }

        pending.splice(index, 1);
        savePendingThreads(pending);
    },

    onLaunch: async function ({ api, event, target }) {
        try {
            const lod = await api.sendMessage("Loading...", event.threadID);
            let pending = loadPendingThreads();

            if (target.length > 0) {
                let index = parseInt(target[0], 10) - 1;
                if (!isNaN(index) && index >= 0 && index < pending.length) {
                    const threadToApprove = pending[index];

                    await api.sendMessage("Reply with 'approve' or 'decline' for the thread:\n" + threadToApprove.name, event.threadID);
                    global.client.onReply.push({
                        name: this.name,
                        messageID: lod.messageID,
                        author: event.senderID,
                        index: index
                    });

                } else {
                    await api.sendMessage("Invalid index provided. Please reply with a valid number from the list.", event.threadID);
                }
            } else {
                pending = await api.getThreadList(100, null, ["PENDING"]) || [];
                savePendingThreads(pending);

                if (pending.length === 0) {
                    await api.editMessage("⚙️ 𝗧𝗵𝗿𝗲𝗮𝗱𝘀 𝗠𝗮𝗻𝗮𝗴𝗲𝗿 \n━━━━━━━━━━━━━━━━━━\nThere are no pending and spam threads recorded on the database.", lod.messageID, event.threadID);
                } else {
                    let pendingMessage = `⚙️ 𝗧𝗵𝗿𝗲𝗮𝗱𝘀 𝗠𝗮𝗻𝗮𝗴𝗲𝗿 \n━━━━━━━━━━━━━━━━━━\n${pending.map((thread, i) => `${i + 1}. ${thread.name}`).join('\n')}`;
                    await api.editMessage(pendingMessage, lod.messageID, event.threadID);
                }
            }

        } catch (error) {
            console.error("Error managing threads:", error);
            await api.sendMessage("An error occurred while managing threads.", event.threadID);
        }
    }
};
