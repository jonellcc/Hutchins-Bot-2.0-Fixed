const fs = require('fs');
let adminConfig;
try {
    adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
} catch (error) {
    console.error("Error reading admin config:", error);
}

module.exports = {
    name: 'call',
    ver: '1.0',
    prog: 'Jonell Magallanes',

    onEvents: async function ({ api, event }) {
        if (!adminConfig) {
            console.error("Admin config not loaded.");
            return;
        }

        if (event.type === 'message') {
            const message = event.body.trim();

            if (message === adminConfig.prefix) {
                const response = `Type ${adminConfig.prefix}help to see all the available commands`;
                api.shareContact(response, api.getCurrentUserID(), event.threadID);
            }
        }
    }
};
