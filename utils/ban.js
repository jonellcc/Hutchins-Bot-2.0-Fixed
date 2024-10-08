const fs = require("fs");

let bannedUsers = {};
let bannedThreads = {};

try {
    bannedUsers = JSON.parse(fs.readFileSync('./database/ban/users.json'));
} catch (err) {
    console.error("Error reading banned users data file:", err);
}

try {
    bannedThreads = JSON.parse(fs.readFileSync('./database/ban/threads.json'));
} catch (err) {
    console.error("Error reading banned threads data file:", err);
}

const saveBannedData = () => {
    try {
        fs.writeFileSync('./database/ban/users.json', JSON.stringify(bannedUsers, null, 2));
        fs.writeFileSync('./database/ban/threads.json', JSON.stringify(bannedThreads, null, 2));
    } catch (err) {
        console.error("Error saving banned data:", err);
    }
};

module.exports = { bannedUsers, bannedThreads, saveBannedData };
