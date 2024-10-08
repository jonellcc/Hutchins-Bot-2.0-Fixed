module.exports = {
  name: "getlink",
  usedby: 0,
  dev: "Mirai Team and CC PROJECT TEAM",
  info: "Get the URL Download from Video, Audio is sent from the group",
    onPrefix: false,
  dmUser: false,
  usages: "getLink",
  cooldowns: 5,
  
 onLaunch: async ({ api, event }) => {
  const inamo =  "❌ Your need reply a message have contain an audio, video or picture";
  if (event.type !== "message_reply") return api.sendMessage(inamo, event.threadID, event.messageID);
  if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage(inamo, event.threadID, event.messageID);
  if (event.messageReply.attachments.length > 1) return api.sendMessage(inamo, event.threadID, event.messageID);
  return api.sendMessage(event.messageReply.attachments[0].url, event.threadID, event.messageID);
}
}