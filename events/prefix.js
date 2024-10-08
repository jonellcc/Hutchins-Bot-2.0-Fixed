const fs = require('fs');
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
module.exports = {
    name: 'prefix',
    ver: '1.0',
    prog: 'Jonell Magallanes',

    onEvents: async function ({ api, event }) {
        if (event.type === 'message') {
            const message = event.body.trim();

            if (message.startsWith(`prefix`) || message.startsWith(`Prefix`) || message.startsWith(`anong prefix`)) {
                const response = `Prefix is: ${adminConfig.prefix}`;
                api.shareContact(response, api.getCurrentUserID(), event.threadID)
            }
        }
    }
};
