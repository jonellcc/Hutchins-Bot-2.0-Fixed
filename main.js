//this main.js system of bot don't steal the code okay
//kaguya teams and CC PROJECTS A.K.A JONELL MAGALLANES and Chatbot Community and Also You 
//What you looking for the codes? and steal it? bruh?
const fs = require("fs");
const gradient = require("gradient-string");
 const cron = require('node-cron');
const axios = require('axios');
 const moment = require('moment-timezone');
const chalk = require("chalk");
const { exec } = require("child_process");
const { handleListenEvents } = require("./utils/listen");
//*const cron = require("node-cron");
const config = JSON.parse(fs.readFileSync("./logins/hut-chat-api/config.json", "utf8"));
//cron 3AM AND 5AM auto process.exit 1 as full restart 
cron.schedule('0 3 * * *', () => {
    console.log('Exiting the process at 3:00 AM');
    process.exit(1);
}, {
    timezone: "Asia/Manila"
});

cron.schedule('0 5 * * *', () => {
    console.log('Exiting the process at 5:00 AM');
    process.exit(1);
}, {
    timezone: "Asia/Manila"
});
const proxyList = fs.readFileSync("./utils/prox.txt", "utf-8").split("\n").filter(Boolean);
const fonts = require('./utils/fonts');
function getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * proxyList.length);
    return proxyList[randomIndex];
}
proxy = getRandomProxy();
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
//const login = require(`./logins/${adminConfig.FCA}/index.js`);
const login = require("hut-chat-api");
const prefix = adminConfig.prefix;
const threadsDB = JSON.parse(fs.readFileSync("./database/threads.json", "utf8") || "{}");
const usersDB = JSON.parse(fs.readFileSync("./database/users.json", "utf8") || "{}");
const boldText = (text) => chalk.bold(text);
global.fonts = fonts;
global.cc = {
    admin: "admin.json",
    adminBot: adminConfig.adminUIDs,
    modBot: adminConfig.moderatorUIDs,
    prefix: adminConfig.prefix,
    developer: adminConfig.ownerName,
    botName: adminConfig.botName,
    ownerLink: adminConfig.facebookLink,
    resend: adminConfig.resend,
    proxy: proxy,
    module: {
        commands: {}
    },
    cooldowns: {},
    getCurrentPrefix: () => global.cc.prefix,
    reload: {}
};

global.cc.reloadCommand = function (commandName) {
    try {
        delete require.cache[require.resolve(`./cmds/${commandName}.js`)];
        const reloadedCommand = require(`./cmds/${commandName}.js`);
        global.cc.module.commands[commandName] = reloadedCommand;
        console.log(boldText(gradient.cristal(`[ ${commandName} ] Command reloaded successfully.`)));
        return true;
    } catch (error) {
        console.error(boldText(gradient.cristal(`❌ Failed to reload command [ ${commandName} ]: ${error.message}`)));
        return false;
    }
};

global.cc.reload = new Proxy(global.cc.reload, {
    get: function (target, commandName) {
        return global.cc.reloadCommand(commandName);
    }
});

const loadCommands = () => {
    const commands = {};
    fs.readdirSync("./cmds").sort().forEach(file => {
        if (file.endsWith(".js")) {
            try {
                const command = require(`./cmds/${file}`);
                commands[command.name] = command;
                console.log(boldText(gradient.cristal(`[ ${command.name} ] Successfully Deployed Command`)));
            } catch (error) {
                if (error.code === "MODULE_NOT_FOUND") {
                    const missingModule = error.message.split("'")[1];
                    console.log(boldText(gradient.vice(`[ ${file} ] Missing module: ${missingModule}. Installing...`)));
                    exec(`npm install ${missingModule}`, (err) => {
                        if (!err) {
                            console.log(boldText(gradient.atlas(`Module ${missingModule} installed successfully.`)));
                            const command = require(`./cmds/${file}`);
                            commands[command.name] = command;
                            console.log(boldText(gradient.cristal(`[ ${command.name} ] Successfully Deployed Command`)));
                        }
                    });
                }
            }
        }
    });
    global.cc.module.commands = commands;
    return commands;
};

const loadEventCommands = () => {
    const eventCommands = {};
    fs.readdirSync("./events").sort().forEach(file => {
        if (file.endsWith(".js")) {
            try {
                const eventCommand = require(`./events/${file}`);
                eventCommands[eventCommand.name] = eventCommand;
                console.log(boldText(gradient.pastel(`[ ${eventCommand.name} ] Successfully Deployed Event Command`)));
            } catch (error) {
                if (error.code === "MODULE_NOT_FOUND") {
                    const missingModule = error.message.split("'")[1];
                    console.log(boldText(gradient.instagram(`[ ${file} ] Missing module: ${missingModule}. Installing...`)));
                    exec(`npm install ${missingModule}`, (err) => {
                        if (!err) {
                            console.log(boldText(gradient.atlas(`Module ${missingModule} installed successfully.`)));
                            const eventCommand = require(`./events/${file}`);
                            eventCommands[eventCommand.name] = eventCommand;
                            console.log(boldText(gradient.cristal(`[ ${eventCommand.name} ] Successfully Deployed Event Command`)));
                        }
                    });
                }
            }
        }
    });
    return eventCommands;
};

const reloadModules = () => {
    console.clear();
    console.log(boldText(gradient.retro("Reloading bot...")));
    const commands = loadCommands();
    const eventCommands = loadEventCommands();
    console.log(boldText(gradient.passion("[ BOT MODULES RELOADED ]")));
};
const startBot = () => {
  console.log(boldText(gradient.retro("Logging via AppState...")));

    login({ appState: JSON.parse(fs.readFileSync(config.APPSTATE_PATH, "utf8")) }, (err, api) => {
        if (err) return console.error(boldText(gradient.passion(`Login error: ${JSON.stringify(err)}`)));
        console.log(boldText(gradient.retro("SUCCESSFULLY LOGGED IN VIA APPSTATE")));
        console.log(boldText(gradient.retro("Picked Proxy IP: " + proxy)));
        console.log(boldText(gradient.vice("━━━━━━━[ COMMANDS DEPLOYMENT ]━━━━━━━━━━━")));
        const commands = loadCommands();
        console.log(boldText(gradient.morning("━━━━━━━[ EVENTS DEPLOYMENT ]━━━━━━━━━━━")));
        const eventCommands = loadEventCommands();
        //logs detail
        
        function _0x5bcf(){var _0x597c64=['3884505VlDlUU','log','16647810ILmJOe','9067584HEzncX','7773LuulQm','cristal','adminUIDs','ownerName','364djhvac','1211PuABfX','vice','prefix','ADMINBOT:\x20','143190wNlKwl','38250ZiMPZb','540455WboOHg','╭─❍\x0aBOT\x20NAME:\x20','36LKXzXj'];_0x5bcf=function(){return _0x597c64;};return _0x5bcf();}function _0xb8ab(_0x55c3ba,_0x59220e){var _0x5bcf46=_0x5bcf();return _0xb8ab=function(_0xb8abb0,_0x5cc3bf){_0xb8abb0=_0xb8abb0-0xf8;var _0x3d0ac1=_0x5bcf46[_0xb8abb0];return _0x3d0ac1;},_0xb8ab(_0x55c3ba,_0x59220e);}var _0x541c0c=_0xb8ab;(function(_0x17811b,_0x372e29){var _0x1e536c=_0xb8ab,_0x442058=_0x17811b();while(!![]){try{var _0x25a0cb=-parseInt(_0x1e536c(0x100))/0x1*(-parseInt(_0x1e536c(0x104))/0x2)+-parseInt(_0x1e536c(0xfc))/0x3+parseInt(_0x1e536c(0xfb))/0x4*(-parseInt(_0x1e536c(0xf9))/0x5)+parseInt(_0x1e536c(0xf8))/0x6*(-parseInt(_0x1e536c(0x105))/0x7)+parseInt(_0x1e536c(0xff))/0x8+parseInt(_0x1e536c(0x109))/0x9+parseInt(_0x1e536c(0xfe))/0xa;if(_0x25a0cb===_0x372e29)break;else _0x442058['push'](_0x442058['shift']());}catch(_0x1686c0){_0x442058['push'](_0x442058['shift']());}}}(_0x5bcf,0xd18b8),console[_0x541c0c(0xfd)](boldText(gradient[_0x541c0c(0x101)]('█░█\x20▄▀█\x20█▀█\x20█▀█\x20█░░\x20█▀▄\x0a█▀█\x20█▀█\x20█▀▄\x20█▄█\x20█▄▄\x20█▄▀'))),console[_0x541c0c(0xfd)](boldText(gradient[_0x541c0c(0x106)](_0x541c0c(0xfa)+adminConfig['botName']))),console['log'](boldText(gradient[_0x541c0c(0x106)]('PREFIX:\x20'+adminConfig[_0x541c0c(0x107)]))),console['log'](boldText(gradient[_0x541c0c(0x106)](_0x541c0c(0x108)+adminConfig[_0x541c0c(0x102)]))),console[_0x541c0c(0xfd)](boldText(gradient[_0x541c0c(0x106)]('OWNER:\x20'+adminConfig[_0x541c0c(0x103)]+'\x0a╰───────────⟡'))));
        
//restart api send
        const _0x35e9a6=_0x4d75;(function(_0x965be2,_0x91ed09){const _0x1ba62f=_0x4d75,_0x4af2ae=_0x965be2();while(!![]){try{const _0x79432a=parseInt(_0x1ba62f(0xe8))/0x1+parseInt(_0x1ba62f(0xeb))/0x2+parseInt(_0x1ba62f(0xdd))/0x3+parseInt(_0x1ba62f(0xe7))/0x4*(parseInt(_0x1ba62f(0xe6))/0x5)+-parseInt(_0x1ba62f(0xdb))/0x6*(-parseInt(_0x1ba62f(0xe5))/0x7)+parseInt(_0x1ba62f(0xe3))/0x8*(parseInt(_0x1ba62f(0xe9))/0x9)+-parseInt(_0x1ba62f(0xe4))/0xa;if(_0x79432a===_0x91ed09)break;else _0x4af2ae['push'](_0x4af2ae['shift']());}catch(_0x491292){_0x4af2ae['push'](_0x4af2ae['shift']());}}}(_0x3851,0x9ba5f));function _0x3851(){const _0x4c6448=['existsSync','log','8jjYrlM','34785450MxaMij','4299946KuqgSB','1400160RapSBQ','8nvnsxY','1122104jMPJJJ','214443BBvOxr','Failed\x20to\x20send\x20message:','2344816vAmIcG','unlinkSync','✅\x20𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗲𝗱\x20𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\x0a━━━━━━━━━━━━━━━━━━\x0aBot\x20has\x20been\x20Fully\x20Restarted!','./database/threadID.json','6kHSWrO','utf8','1870197BMIeRs','Restart\x20message\x20sent\x20successfully.','readFileSync','sendMessage'];_0x3851=function(){return _0x4c6448;};return _0x3851();}function _0x4d75(_0x5381a7,_0x193626){const _0x385144=_0x3851();return _0x4d75=function(_0x4d75c5,_0x122b3d){_0x4d75c5=_0x4d75c5-0xd8;let _0x3e6b0d=_0x385144[_0x4d75c5];return _0x3e6b0d;},_0x4d75(_0x5381a7,_0x193626);}if(fs[_0x35e9a6(0xe1)](_0x35e9a6(0xda))){const data=JSON['parse'](fs[_0x35e9a6(0xdf)]('./database/threadID.json',_0x35e9a6(0xdc)));data['threadID']&&api[_0x35e9a6(0xe0)](_0x35e9a6(0xd9),data['threadID'],_0x3bb26a=>{const _0x394f2d=_0x35e9a6;_0x3bb26a?console['error'](boldText(_0x394f2d(0xea),_0x3bb26a)):(console[_0x394f2d(0xe2)](boldText(_0x394f2d(0xde))),fs[_0x394f2d(0xd8)](_0x394f2d(0xda)),console[_0x394f2d(0xe2)](boldText('threadID.json\x20has\x20been\x20deleted.')));});}
        
//prefix changed
        function _0x2a55(){const _0x253796=['3907288YszIeJ','6415576TYusaL','readFileSync','threadID.json\x20has\x20been\x20deleted.','./database/prefix/threadID.json','✅\x20𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\x20𝗖𝗵𝗮𝗻𝗴𝗲𝗱\x20𝗣𝗿𝗲𝗳𝗶𝘅\x0a━━━━━━━━━━━━━━━━━━\x0aBot\x20has\x20changed\x20system\x20prefix\x20into\x20','prefix','error','parse','sendMessage','719614HNqSSv','31233nlTBiJ','2156436RnBqzf','15OvwNwn','threadID','236tsKbTP','2YaDkCo','Failed\x20to\x20send\x20message:','743549yuIKgR','unlinkSync','log','817074uKaGIu','10ZhVydY','existsSync'];_0x2a55=function(){return _0x253796;};return _0x2a55();}function _0x4ced(_0x23b97a,_0x2f7a05){const _0x2a5502=_0x2a55();return _0x4ced=function(_0x4cedfa,_0x322585){_0x4cedfa=_0x4cedfa-0x86;let _0x14ae91=_0x2a5502[_0x4cedfa];return _0x14ae91;},_0x4ced(_0x23b97a,_0x2f7a05);}const _0x40e55e=_0x4ced;(function(_0x545d64,_0x423401){const _0x26f003=_0x4ced,_0xf2b997=_0x545d64();while(!![]){try{const _0x20a6c1=parseInt(_0x26f003(0x8e))/0x1*(parseInt(_0x26f003(0x8c))/0x2)+-parseInt(_0x26f003(0x87))/0x3*(parseInt(_0x26f003(0x8b))/0x4)+-parseInt(_0x26f003(0x89))/0x5*(-parseInt(_0x26f003(0x91))/0x6)+parseInt(_0x26f003(0x86))/0x7+-parseInt(_0x26f003(0x95))/0x8+-parseInt(_0x26f003(0x88))/0x9*(-parseInt(_0x26f003(0x92))/0xa)+parseInt(_0x26f003(0x94))/0xb;if(_0x20a6c1===_0x423401)break;else _0xf2b997['push'](_0xf2b997['shift']());}catch(_0x1f6bee){_0xf2b997['push'](_0xf2b997['shift']());}}}(_0x2a55,0x69d60));if(fs[_0x40e55e(0x93)]('./database/prefix/threadID.json')){const data=JSON[_0x40e55e(0x9c)](fs[_0x40e55e(0x96)](_0x40e55e(0x98),'utf8'));data[_0x40e55e(0x8a)]&&api[_0x40e55e(0x9d)](_0x40e55e(0x99)+adminConfig[_0x40e55e(0x9a)],data[_0x40e55e(0x8a)],_0x311420=>{const _0x94e8=_0x40e55e;_0x311420?console[_0x94e8(0x9b)](boldText(_0x94e8(0x8d),_0x311420)):(console[_0x94e8(0x90)](boldText('Restart\x20message\x20sent\x20successfully.')),fs[_0x94e8(0x8f)](_0x94e8(0x98)),console[_0x94e8(0x90)](boldText(_0x94e8(0x97))));});}
        console.log(boldText(gradient.passion("━━━━[ READY INITIALIZING DATABASE ]━━━━━━━")));
        console.log(boldText(gradient.cristal(`╔════════════════════`)));
        console.log(boldText(gradient.cristal(`║ DATABASE SYSTEM STATS`)));
        console.log(boldText(gradient.cristal(`║ Threads: ${Object.keys(threadsDB).length}`)));
        console.log(boldText(gradient.cristal(`║ Users: ${Object.keys(usersDB).length} `)));
        console.log(boldText(gradient.cristal(`╚════════════════════`)));
        console.log(boldText(gradient.cristal("BOT Made By CC PROJECTS And Kaguya")))

        //credits
        function _0x70cc(_0x37b4b2,_0xc8217e){var _0x42ef1b=_0x42ef();return _0x70cc=function(_0x70ccf6,_0x49bcc7){_0x70ccf6=_0x70ccf6-0x1b1;var _0x2431a1=_0x42ef1b[_0x70ccf6];return _0x2431a1;},_0x70cc(_0x37b4b2,_0xc8217e);}var _0x3ce376=_0x70cc;function _0x42ef(){var _0x50355c=['║\x20•\x20ARJHIL\x20DUCAYANAN','║\x20DEVELOPERS','20WEwOZj','log','332636uwTWZV','8FegRnO','16GHAclu','2koVLjT','3709044VTYAoY','4330224zXrMYG','168978IGziWo','467780dNDweh','╔════════════════════','║\x20=>\x20DEDICATED:\x20CHATBOT\x20COMMUNITY\x20AND\x20YOU','399021OaAAEX','cristal','9504616zKJDbY','╚════════════════════','║\x20•\x20JR\x20BUSACO'];_0x42ef=function(){return _0x50355c;};return _0x42ef();}(function(_0x2ac03a,_0x317593){var _0x34e5b5=_0x70cc,_0x26ec7b=_0x2ac03a();while(!![]){try{var _0x45b639=parseInt(_0x34e5b5(0x1bc))/0x1*(parseInt(_0x34e5b5(0x1b9))/0x2)+-parseInt(_0x34e5b5(0x1bf))/0x3*(parseInt(_0x34e5b5(0x1bb))/0x4)+-parseInt(_0x34e5b5(0x1c0))/0x5+parseInt(_0x34e5b5(0x1bd))/0x6+-parseInt(_0x34e5b5(0x1c3))/0x7*(-parseInt(_0x34e5b5(0x1ba))/0x8)+-parseInt(_0x34e5b5(0x1be))/0x9*(parseInt(_0x34e5b5(0x1b7))/0xa)+parseInt(_0x34e5b5(0x1b2))/0xb;if(_0x45b639===_0x317593)break;else _0x26ec7b['push'](_0x26ec7b['shift']());}catch(_0x5d5a89){_0x26ec7b['push'](_0x26ec7b['shift']());}}}(_0x42ef,0x90391),console[_0x3ce376(0x1b8)](boldText(gradient[_0x3ce376(0x1b1)](_0x3ce376(0x1c1)))),console[_0x3ce376(0x1b8)](boldText(gradient[_0x3ce376(0x1b1)](_0x3ce376(0x1b6)))),console['log'](boldText(gradient['cristal']('║\x20•\x20JONELL\x20MAGALLANES'))),console[_0x3ce376(0x1b8)](boldText(gradient[_0x3ce376(0x1b1)](_0x3ce376(0x1b5)))),console[_0x3ce376(0x1b8)](boldText(gradient[_0x3ce376(0x1b1)]('║\x20•\x20JAY\x20MAR'))),console['log'](boldText(gradient['cristal'](_0x3ce376(0x1b4)))),console[_0x3ce376(0x1b8)](boldText(gradient[_0x3ce376(0x1b1)](_0x3ce376(0x1c2)))),console[_0x3ce376(0x1b8)](boldText(gradient[_0x3ce376(0x1b1)](_0x3ce376(0x1b3)))));
        console.error(boldText(gradient.summer("[ BOT IS LISTENING ]")));
//auto greet part hahaha
        const fetchWeather = async () => {
            try {
                const response = await axios.get('https://ccexplorerapisjonell.vercel.app/api/weather');
                const { synopsis, issuedAt, temperature, humidity } = response.data;
                return `Weather Update:\n\n${synopsis}\n\nIssued at: ${issuedAt}\nMax Temperature: ${temperature.max.value} at ${temperature.max.time}\nMin Temperature: ${temperature.min.value} at ${temperature.min.time}\nMax Humidity: ${humidity.max.value} at ${humidity.max.time}\nMin Humidity: ${humidity.min.value} at ${humidity.min.time}`;
            } catch (error) {
                return 'Unable to fetch weather information at the moment.';
            }
        };

        function sendMessages(api, message) {
            let successCount = 0;
            let failureCount = 0;

            api.getThreadList(20, null, ['INBOX'])
                .then((list) => {
                    const promises = list.map((thread) => {
                        if (thread.isGroup) {
                            return new Promise((resolve) => {
                                api.sendMessage(message, thread.threadID, (err, info) => {
                                    if (err) {
                                        failureCount++;
                                        console.error(`Failed to send message to thread ${thread.threadID}:`, err);
                                        resolve();
                                    } else {
                                        successCount++;
                                        console.log(`Message sent to thread ${thread.threadID}:`, info);
                                        resolve();
                                    }
                                });
                            });
                        }
                    });

                    Promise.all(promises).then(() => {
                        console.log(`Successfully sent: ${successCount}, Failed: ${failureCount}`);
                    });
                })
                .catch((err) => {
                    console.error('Error fetching thread list:', err);
                });
        }

        const greetings = [
            {
                cronTime: '0 5 * * *',
                messages: [`Good morning! Have a great day ahead!`],
            },
            {
                cronTime: '0 8 * * *',
                messages: [`Hello Everyone Time Check 8:00 AM :>`],
            },
            {
                cronTime: '0 10 * * *',
                messages: [`Hello everyone! How's your day going?`],
            },
            {
                cronTime: '0 12 * * *',
                messages: [`Lunchtime reminder: Take a break and eat well!`],
            },
            {
                cronTime: '0 14 * * *',
                messages: [`Reminder: Don't forget your tasks for today!`],
            },
            {
                cronTime: '0 18 * * *',
                messages: [`Good evening! Relax and enjoy your evening.`],
            },
            {
                cronTime: '0 20 * * *',
                messages: [`Time to wind down. Have a peaceful evening.`],
            },
            {
                cronTime: '0 22 * * *',
                messages: [`Good night! Have a restful sleep.`],
            },
            {
                cronTime: '0 7 * * *',
                messages: async () => `Good morning! Have a great day ahead!\n\n${await fetchWeather()}`,
            },
            {
                cronTime: '0 19 * * *',
                messages: async () => `Good evening! Relax and enjoy your evening.\n\n${await fetchWeather()}`,
            }
        ];

        greetings.forEach((greet) => {
            cron.schedule(greet.cronTime, async () => {
                if (typeof greet.messages === 'function') {
                    const message = await greet.messages();
                    sendMessages(api, message);
                } else {
                    greet.messages.forEach((message) => {
                        sendMessages(api, message);
                    });
                }
            }, {
                timezone: "Asia/Manila"
            });
        });


        handleListenEvents(api, commands, eventCommands, threadsDB, usersDB, adminConfig, prefix);
    });
};

startBot();
cron.schedule('*/35 * * * *', () => {
    console.log('Exiting process with code 1...');
    process.exit(1);
});

console.log('Auto Restart Bot Successfully Execute of exit process every 35 min');
                                                 
if (adminConfig.restart) {
    const restartInterval = adminConfig.restartTime * 60 * 1000;

    setInterval(() => {
        reloadModules();
    }, restartInterval);
}

