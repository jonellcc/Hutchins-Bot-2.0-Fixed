const { exec } = require('child_process');

module.exports = {
    name: "shell",
    usedby: 2,
    info: "Execute shell commands",
    onPrefix: true,
    nickName: ["exec", "linux"],
    dev: "Jonell Magallanes",
    cooldowns: 3,
    dmUser: false,
    usages: "shell <command>",

onLaunch: async function ({ api, event, target }) {
    const { threadID, messageID } = event;
    const command = target.join(" ");

    if (!command) {
        return api.sendMessage("Please provide a shell command to execute.", threadID, messageID);
    }
        const teh = await api.sendMessage("Processing", threadID, messageID);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return api.editMessage(`Error: ${error.message}`, teh.messageID ,threadID, messageID);
        }
        if (stderr) {
            return api.editMessage(`Stderr: ${stderr}`, teh.messageID, threadID, messageID);
        }
        api.editMessage(`${stdout}`, teh.messageID, threadID, messageID);
    });
}
}
