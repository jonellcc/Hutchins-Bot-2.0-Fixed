module.exports = {
  name: "tid",
  usedby: 0,
  info: "get the threadID",
  dev: "Jonell Magallanes",
  onPrefix: false,
  cooldowns: 2,


onLaunch: async function ({ api, event, actions }) {
  const tid = event.threadID;
  actions.reply(`Group Chat ID or ThreadID: ${tid}`);;
}
}