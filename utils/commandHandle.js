const fs = require("fs");
const { exec } = require('child_process');
const gradient = require('gradient-string');

global.cc = {
    PREFIX: '',
    commands: {},
    events: {},
    config: {}
};

const loadConfig = () => {
    if (!fs.existsSync('./config.json')) {
        console.error(gradient.morning('Please Configure the Config.json'));
        process.exit(0);
    } else {
        global.cc.config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        global.cc.PREFIX = global.cc.config.prefix;
        console.log(gradient.cristal('Config.json has been found!'));
    }
};

const loadCommands = () => {
    const commands = {};
    fs.readdirSync('./cmds').sort().forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const command = require(`../cmds/${file}`);
                global.cc.commands[command.name] = {
                    name: command.name,
                    usedby: command.usedby,
                    info: command.info,
                    onPrefix: command.onPrefix,
                    cooldowns: command.cooldowns
                };
                console.log(gradient.cristal(`[ ${command.name} ] Successfully Deployed Command`));
            } catch (error) {
                if (error.code === 'MODULE_NOT_FOUND') {
                    const missingModule = error.message.split("'")[1];
                    console.log(gradient.vice(`[ ${file} ] This command is missing a module: ${missingModule}. Installing...`));
                    exec(`npm install ${missingModule}`, (err, stdout, stderr) => {
                        if (err) {
                            console.error(gradient.passion(`Failed to install module ${missingModule}: ${err}`));
                        } else {
                            console.log(gradient.atlas(`Module ${missingModule} installed successfully.`));
                            const command = require(`../cmds/${file}`);
                            global.cc.commands[command.name] = {
                                name: command.name,
                                usedby: command.usedby,
                                info: command.info,
                                onPrefix: command.onPrefix,
                                cooldowns: command.cooldowns
                            };
                            console.log(gradient.cristal(`[ ${command.name} ] Successfully Deployed Command`));
                        }
                    });
                } else {
                    console.error(gradient.passion(`[ ${file} ] This Command has an error: ${error}`));
                }
            }
        }
    });
};

const loadEventCommands = () => {
    const eventCommands = {};
    fs.readdirSync('./events').sort().forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const eventCommand = require(`../events/${file}`);
                global.cc.events[eventCommand.name] = eventCommand;
                console.log(gradient.pastel(`[ ${eventCommand.name} ] Successfully Deployed Event Command`));
            } catch (error) {
                if (error.code === 'MODULE_NOT_FOUND') {
                    const missingModule = error.message.split("'")[1];
                    console.log(gradient.instagram(`[ ${file} ] This event command is missing a module: ${missingModule}. Installing...`));
                    exec(`npm install ${missingModule}`, (err, stdout, stderr) => {
                        if (err) {
                            console.error(gradient.instagram(`Failed to install module ${missingModule}: ${err}`));
                        } else {
                            console.log(gradient.atlas(`Module ${missingModule} installed successfully.`));
                            const eventCommand = require(`../events/${file}`);
                            global.cc.events[eventCommand.name] = eventCommand;
                            console.log(gradient.cristal(`[ ${eventCommand.name} ] Successfully Deployed Event Command`));
                        }
                    });
                } else {
                    console.error(gradient.summer(`[ ${file} ] This event command has an error: ${error}`));
                }
            }
        }
    });
};

module.exports = { loadCommands, loadEventCommands, loadConfig };
