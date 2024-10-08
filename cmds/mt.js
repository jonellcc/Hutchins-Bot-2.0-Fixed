module.exports = {
  name: "maintenance",
  usedby: 2,
    info: "Maintenance bot",
    onPrefix: true,
    hide: true,
    dev: "Jonell Magallanes",  cooldowns: 5,

onLaunch: async function({ api, event, target }) {
  var fs = require("fs");
  var request = require("request");
    const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
const content = target.join(" ");

  api.getThreadList(30, null, ["INBOX"], (err, list) => {
      if (err) { 
          console.error("ERR: "+ err);
          return;
      }

      list.forEach(thread => {
          if(thread.isGroup == true && thread.threadID != event.threadID) {
              var link = "https://i.postimg.cc/NFdDc0vV/RFq-BU56n-ES.gif";  
              var callback = () => api.sendMessage({ 
                  body: `𝗕𝗼𝘁 𝗠𝗮𝗶𝗻𝘁𝗲𝗻𝗮𝗻𝗰𝗲 𝗠𝗼𝗱𝗲\n━━━━━━━━━━━━━━━━━━\n${adminConfig.botName} 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖬𝖺𝗂𝗇𝗍𝖾𝗇𝖺𝗇𝖼𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖻𝖾 𝗉𝖺𝗍𝗂𝖾𝗇𝗍.\n\n𝖱𝖾𝖺𝗌𝗈𝗇: ${content}\n\n𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋: ${adminConfig.ownerName}`, 
                  attachment: fs.createReadStream(__dirname + "/cache/maintenance.gif")
              }, 
              thread.threadID, 
              () => { 
                  fs.unlinkSync(__dirname + "/cache/maintenance.gif");
                  console.log(`Maintenance message sent to ${thread.threadID}. Now shutting down.`);
                  process.exit(0); 
              });

              return request(encodeURI(link))
                  .pipe(fs.createWriteStream(__dirname + "/cache/maintenance.gif"))
                  .on("close", callback);
          }
      });
  });

  console.log("The bot is now off for maintenance.");
}
}