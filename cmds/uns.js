const fs = require('fs');

const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));

module.exports = {
  name: "unsend",
  usedby: 0,
  dev: "Jonell Magallanes",
  onPrefix: false,
  cooldowns: 1,
  info: "Unsend Message",

  onLaunch: async function ({ api, event }) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const userIsGroupAdmin = threadInfo.adminIDs.some(idInfo => idInfo.id === event.senderID);
    const userIsConfigAdmin = adminConfig.adminUIDs.includes(event.senderID);

    if (!userIsGroupAdmin && !userIsConfigAdmin) {
      return api.sendMessage("You're not an admin of this group, you can't use this command.", event.threadID);
    }

    if (event.type !== "message_reply") {
      return api.sendMessage("Please reply to a message to use this command.", event.threadID);
    }

    if (event.messageReply.senderID !== api.getCurrentUserID()) {
      return api.sendMessage("You can only use this command as a reply to your own message.", event.threadID);
    }

    return api.unsendMessage(event.messageReply.messageID);
  }
};
