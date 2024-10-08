module.exports = {
    name: "load",
    info: "Loads a command",
    onPrefix: true,
    usedby: 2,
    cooldowns: 0,

    onLaunch: async function({ target, actions, api, event }) {
        const fs = require('fs');
        let name = target[0];
        if (!name) return actions.reply('Please enter the command name!');

        try {
            let msg = "";
            const h = await actions.reply("Reloading Module...")
            let count = 0;
            if (name === "all") {
                let errorCount = 0;
                let successCount = 0;
                let failedCommand = [];
                let successCommand = [];
                for (let file of fs.readdirSync(__dirname).filter(file => file.endsWith('.js'))) {
                    api.editMessage("Deploying.....", h.messageID, event.threadID, event.messageID)
                    if (file === "load.js") continue;
                    try {
                        delete require.cache[require.resolve(__dirname + `/${file}`)];
                        let newCommand = require(__dirname + `/${file}`);
                        if (newCommand.name && typeof newCommand.name === 'string') {
                            successCount++;
                            successCommand.push(newCommand.name);
                          count++;
                            msg += `Loaded ${count}. ${newCommand.name}\n`;
                        } else {
                            throw new Error('Invalid command structure');
                        }
                    } catch (e) {
                        errorCount++;
                        failedCommand.push(file);
                        msg += `Failed to load ${count + 1}. ${file} - ${e.message}\n`;
                    }
                }
                msg += `\nSuccessfully loaded ${successCount} command(s).\nFailed to load ${errorCount} command(s).\n\n${failedCommand.join(", ")}`;
                actions.reply(msg);
                setTimeout(() => {
                process.exit(1);
            }, 2000); 
                return;
                
            }

            if (!fs.existsSync(__dirname + `/${name}.js`)) return actions.reply('File ' + name + ".js doesn't exist!");

            delete require.cache[require.resolve(__dirname + `/${name}.js`)];
            let newCommand = require(__dirname + '/' + name);
            if (newCommand.name && typeof newCommand.name === 'string') {
                console.log('Command ' + name + ' has been loaded!');
                actions.reply('Command ' + name + ' has been loaded!');
            } else {
                throw new Error('Invalid command structure');
            }

            setTimeout(() => {
                process.exit(1);
            }, 2000); 
        } catch (s) {
            return actions.reply('Error: ' + s.message);
        }
    }
};
