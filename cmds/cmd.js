const path = require('path');
const fs = require('fs');

module.exports = {
    name: "cmd",
    usedby: 0,
    info: "Deploys or deletes a specified command",
    onPrefix: true,
    cooldowns: 10,

    onLaunch: async function ({ event, api, target }) {
        const { threadID, messageID } = event;
        const action = target[0]?.toLowerCase();
        const commandName = target[1]?.toLowerCase();

        if (!action || !commandName) {
            return api.sendMessage("Please specify the action (deploy/delete) and the command name.\n\nExample: ?cmd deploy myCommand", threadID, messageID);
        }

        const cmdsFolder = path.join(__dirname);
        const commandFile = path.join(cmdsFolder, `${commandName}.js`);

        if (action === 'deploy') {
            if (!fs.existsSync(commandFile)) {
                return api.sendMessage(`Command \`${commandName}\` does not exist in the cmds folder.`, threadID, messageID);
            }

            try {
                delete require.cache[require.resolve(commandFile)];
                require(commandFile);
                console.log(`Loaded and deployed command: ${commandName}`);
                api.sendMessage(`Command \`${commandName}\` has been successfully deployed.`, threadID, messageID);
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while deploying the command.", threadID, messageID);
            }
        } else if (action === 'delete') {
            if (!fs.existsSync(commandFile)) {
                return api.sendMessage(`Command \`${commandName}\` does not exist in the cmds folder.`, threadID, messageID);
            }

            try {
                fs.unlinkSync(commandFile);
                console.log(`Deleted command: ${commandName}`);
                api.sendMessage(`Command \`${commandName}\` has been successfully deleted.`, threadID, messageID);
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while deleting the command.", threadID, messageID);
            }
        } else {
            api.sendMessage("Invalid action specified. Use `deploy` or `delete`.", threadID, messageID);
        }
    }
};
