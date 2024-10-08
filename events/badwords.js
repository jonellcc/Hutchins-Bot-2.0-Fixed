const path = require('path');
const fs = require('fs');
let badWordsActive = {}, bannedWords = {}, warnings = {};
const saveFile = `./cmds/badwordsActive.json`;

if (fs.existsSync(saveFile)) {
  const words = JSON.parse(fs.readFileSync(saveFile, "utf8"));
  badWordsActive = words;
}

const saveWarnings = `./cmds/warnings.json`;

if (fs.existsSync(saveWarnings)) {
  const warningsData = JSON.parse(fs.readFileSync(saveWarnings, "utf8"));
  warnings = warningsData;
}

const saveWarningsCount = `./cmds/warningsCount.json`;
let warningsCount = {};
if (fs.existsSync(saveWarningsCount)) {
  const warningsCountData = JSON.parse(fs.readFileSync(saveWarningsCount, "utf8"));
  warningsCount = warningsCountData;
}


const loadBannedWords = threadID => {
  const wordFile = `./cmds/database/${threadID}.json`;
  if (fs.existsSync(wordFile)) {
    const words = JSON.parse(fs.readFileSync(wordFile, "utf8"));
    bannedWords[threadID] = words;
  } else {
    bannedWords[threadID] = [];
  }
}

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
};

module.exports = {
  name: 'badwords',
  ver: '1.0',
  prog: 'Jonell Magallanes',

  onEvents: async function ({ api, event, isAdmin }) {
    if (event.type === 'message') {
      const message = event.body.trim();
      const { threadID, messageID, senderID, body } = event;
      loadBannedWords(threadID);

      if (!badWordsActive[threadID]) return;

      const adminUserIds = (await api.getThreadInfo(threadID)).adminIDs.map(i => i.id);
      if (adminUserIds.includes(senderID)) return;

      const messageContent = body.toLowerCase();
      const hasBannedWord = bannedWords[threadID].some(bannedWord => messageContent.includes(bannedWord.toLowerCase()));

      if (hasBannedWord) {
        const threadInfo = await api.getThreadInfo(threadID);
        if (!threadInfo.adminIDs.some(item => item.id === api.getCurrentUserID())) return;

        warningsCount[senderID] = (warningsCount[senderID] || 0) + 1;
        fs.writeFileSync(saveWarningsCount, JSON.stringify(warningsCount), "utf8");

        if (warningsCount[senderID] === 2) {
          api.sendMessage(`${await getUserName(api, event.senderID)} You have two attempts to violate badwords. You are kicked from the group!`, threadID, messageID);
          api.removeUserFromGroup(senderID, threadID);
        } else {
          api.sendMessage(`Last Warning! ${await getUserName(api, event.senderID)} Your message has been detected to contain the offensive word "${messageContent}". If you continue to use such language, you will be automatically kicked.`, threadID, messageID);
        }
      }
    }
  }
};
