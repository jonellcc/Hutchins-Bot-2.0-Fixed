module.exports = {
  name: "sendcomment",
  usedby: 4,
    info: "Send a comment Post using bot",
onPefix: true,
dev: "Jonell Magallanes",
  cooldowns: 5,
onLaunch: async function ({ api, event, target }) {
  if (target.length < 2) {
      return api.sendMessage("Usage: sendcomment [URL] [comment]", event.threadID, event.messageID);
  }

  const sending = await api.sendMessage("Sending Comment......", event.threadID, event.messageID);
  const url = target[0];
  const comment = target.slice(1).join(" ");

  const regexPfbid = /pfbid\w+/;
  const regexPostSegment = /\/posts\/(\w+)/;
  const regexGroupID = /\/groups\/[^/]+\/permalink\/(\d+)/;

  let postID = url.match(regexPfbid);

  if (!postID) {
      let match = url.match(regexPostSegment);
      if (!match) {
          match = url.match(regexGroupID);
      }
      postID = match ? match[1] : null; 
  } else {
      postID = postID[0];
  }

  api.editMessage("Extracting URL POST Into POST ID", sending.messageID, event.threadID, event.messageID);

  if (!postID) {
      return api.editMessage("Invalid URL. Please provide a valid Facebook post URL.", sending.messageID, event.threadID, event.messageID);
  }

  try {
      await api.sendComment(comment, postID);
      api.editMessage(`𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗣𝗼𝘀𝘁 𝗖𝗠𝗗\n━━━━━━━━━━━━━━━━━━\nComment sent successfully!\nPOST ID: ${postID}\n━━━━━━━━━━━━━━━━━━\n`, sending.messageID, event.threadID, event.messageID);
  } catch (error) {
      api.editMessage(error.message, sending.messageID, event.threadID, event.messageID);
  }
}
}