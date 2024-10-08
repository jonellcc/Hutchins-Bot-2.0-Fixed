module.exports = { 
  name: "testnoprefix",
  usedby: 0,
  info: "test",
  onPrefix: false,
  dev: "Jonell Magallanes",
  cooldowns: 4,
  dmUser: false,
  nickName: [""],

  noPrefix: async function ({ actions }) {
      actions.reply("test noPrefix");
    }
}
