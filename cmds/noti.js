module.exports = {
  name: "noti",
  usedby: 2,
  onPrefix: true,
  dev: "Jonell Magallanes",
  info: "Sending notification from developer",
  cooldowns: 30,
  onLaunch: async function({ api, event, target }) {
    const content = target.join(" ");
    if (!content) return api.sendMessage("Please enter a notification message.", event.threadID);

    let senderInfo = await api.getUserInfo(event.senderID);
    let senderName = senderInfo[event.senderID].name;

    const jonell = `👤 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻\n━━━━━━━━━━━━━━━━━━\n${content}\n\nDeveloper: ${senderName}`;

    try {
      let threads = await api.getThreadList(500, null, ['INBOX']);
      let threadIDs = threads
        .filter(thread => thread.isGroup) 
        .map(thread => thread.threadID);

      threadIDs.forEach(id => {
        api.sendMessage(jonell, id);
      });

      api.sendMessage(`📝 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝗧𝗵𝗿𝗲𝗮𝗱𝘀 𝗥𝗲𝘀𝘂𝗹𝘁 \n━━━━━━━━━━━━━━━━━━\nNotification sent to ${threadIDs.length} threads.`, event.threadID);
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while sending the notifications.', event.threadID);
    }
  }
};