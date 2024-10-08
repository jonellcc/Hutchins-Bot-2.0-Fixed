const axios = require('axios');

module.exports = {
  name: "gdrive",
  usedby: 0,
  dev: "Jonell Magallanes",
  info: "Get the URL Download from Video, Audio is sent from the group and Get Google Drive Link No Expired Link",
  onPrefix: true,
  dmUser: false,
  usages: "getLink",
  cooldowns: 5,


onLaunch: async ({ api, event }) => {
  if (event.type !== "message_reply") return api.sendMessage("Invalid Media Type", event.threadID, event.messageID);
  const va = "Invalid Media Type";
  if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) return api.sendMessage(va, event.threadID, event.messageID);
  if (event.messageReply.attachments.length > 1) return api.sendMessage(va, event.threadID, event.messageID);
     const pro = await api.sendMessage("Uploading Attachment Url.....", event.threadID, event.messageID);
  const attachmentUrl = event.messageReply.attachments[0].url;

  try {
    const apiUrl = `http://de01.uniplex.xyz:5611/api/upload?url=${attachmentUrl}`;

        api.editMessage("Uploading Google Drive......", pro.messageID, event.threadID, event.messageID);
    const response = await axios.get(apiUrl);
    const responseData = response.data;
          api.editMessage("Completed.", pro.messageID, event.threadID, event.messageID);

    return api.editMessage(`☁️ 𝗚𝗼𝗼𝗴𝗹𝗲 𝗗𝗿𝗶𝘃𝗲 𝗨𝗽𝗹𝗼𝗮𝗱 𝗙𝗶𝗹𝗲 \n━━━━━━━━━━━━━━━━━━\n${responseData}`, pro.messageID, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error sending request to external API:', error);
    return api.sendMessage(error.message, event.threadID, event.messageID);
  }
}
}