const fs = require("fs");
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));

module.exports = {
  name: "admin",
  usedby: 4,
  dev: "Jonell Magallanes",
  onPrefix: true,
  cooldowns: 1,
  info: "Admin and Moderator List",
  hide: true,

  onLaunch: async function ({ api, event, target }) {
    let getUserName = (userID) => {
      return new Promise((resolve) => {
        api.getUserInfo(userID, (err, info) => {
          if (err || !info[userID]) return resolve("");
          resolve(info[userID].name || `User ID: ${userID}`);
        });
      });
    };

    if (adminConfig.adminUIDs.includes(event.senderID)) {
      let replyUser = event.messageReply ? event.messageReply.senderID : null;
      let action = target[0];
      let role = target[1];
      let targetUID = target[2] || replyUser;

      if ((action === "add" || action === "remove") && !targetUID) {
        return api.sendMessage("Please specify a UID or reply to a user.", event.threadID);
      }

      if (action === "add") {
        if (role === "admin" && !adminConfig.adminUIDs.includes(targetUID)) {
          adminConfig.adminUIDs.push(targetUID);
          fs.writeFileSync("admin.json", JSON.stringify(adminConfig, null, 2), "utf8");
          let userName = await getUserName(targetUID);
          if (userName) {
            return api.sendMessage(`🛡️ 𝗔𝗱𝗺𝗶𝗻 𝗔𝗱𝗱𝗲𝗱\n${global.line}\nSuccessfully added new admin ${userName}`, event.threadID, () => {
              process.exit(1);
            });
          }
        } else if (role === "mod" && (!adminConfig.moderatorUIDs || !adminConfig.moderatorUIDs.includes(targetUID))) {
          adminConfig.moderatorUIDs = adminConfig.moderatorUIDs || [];
          adminConfig.moderatorUIDs.push(targetUID);
          fs.writeFileSync("admin.json", JSON.stringify(adminConfig, null, 2), "utf8");
          let userName = await getUserName(targetUID);
          if (userName) {
            return api.sendMessage(`👮 𝗠𝗼𝗱𝗲𝗿𝗮𝘁𝗼𝗿 𝗔𝗱𝗱𝗲𝗱\n${global.line}\nSuccessfully added new moderator ${userName}`, event.threadID, () => {
              process.exit(1);
            });
          }
        } else {
          let userName = await getUserName(targetUID);
          if (userName) {
            return api.sendMessage(`${userName} is already an ${role}.`, event.threadID);
          }
        }
      }

      if (action === "remove" && role === "admin") {
        if (adminConfig.adminUIDs.includes(targetUID)) {
          adminConfig.adminUIDs = adminConfig.adminUIDs.filter(uid => uid !== targetUID);
          fs.writeFileSync("admin.json", JSON.stringify(adminConfig, null, 2), "utf8");
          let userName = await getUserName(targetUID);
          if (userName) {
            return api.sendMessage(`🛡️ 𝗔𝗱𝗺𝗶𝗻 𝗥𝗲𝗺𝗼𝘃𝗲𝗱\n${global.line}\nSuccessfully removed admin ${userName}`, event.threadID, () => {
              process.exit(1);
            });
          }
        }
      }

      let adminList = [];
      for (let adminUID of adminConfig.adminUIDs) {
        let adminName = await getUserName(adminUID);
        if (adminName) adminList.push(`[ ${adminUID} ] ${adminName}`);
      }

      let moderatorList = [];
      if (adminConfig.moderatorUIDs) {
        for (let modUID of adminConfig.moderatorUIDs) {
          let modName = await getUserName(modUID);
          if (modName) moderatorList.push(`[ ${modUID} ] ${modName}`);
        }
      }

      let message = `👥 𝗔𝗱𝗺𝗶𝗻 𝗮𝗻𝗱 𝗠𝗼𝗱𝗲𝗿𝗮𝘁𝗼𝗿 𝗟𝗶𝘀𝘁\n${global.line}\n🛡️ Admins:\n${adminList.join("\n")}\n\n`;
      if (moderatorList.length > 0) {
        message += `👮 Moderators:\n${moderatorList.join("\n")}`;
      } else {
        message += `👮 No moderators assigned.`;
      }

      api.sendMessage(message, event.threadID);
    } else {
      api.sendMessage(`🛡️ 𝗨𝗻𝗮𝘂𝘁𝗵𝗼𝗿𝗶𝘇𝗲𝗱\n${global.line}\nYou are not authorized to use this command.`, event.threadID);
    }
  }
};
