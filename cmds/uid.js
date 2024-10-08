module.exports = {
  name: "uid",
  usedby: 0,
  info: "get uid of user",
  onPrefix: false,
  cooldowns: 10,

  onLaunch: function ({ api, event }) {
    if (Object.keys(event.mentions).length === 0) {
      if (event.messageReply) {
        const senderID = event.messageReply.senderID;
        return api.shareContact(senderID, event.messageReply.senderID, event.threadID);
      } else {
        return api.shareContact(`${event.senderID}`,event.senderID, event.threadID, event.messageID);
      }
    } else {
      for (const mentionID in event.mentions) {
        const mentionName = event.mentions[mentionID];
        api.shareContact(`${mentionName.replace('@', '')}: ${mentionID}`, event.threadID);
      }
    }
  }
};
