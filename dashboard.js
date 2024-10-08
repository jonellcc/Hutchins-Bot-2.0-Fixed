
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const os = require('os');
const session = require('express-session');
const { spawn } = require('child_process');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
const PORT = process.env.PORT || 3000;
const chalk = require("chalk");
const boldText = (text) => chalk.bold(text)
const gradient = require("gradient-string");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const uptimeInSeconds = Math.floor(process.uptime());
const uptimeInMinutes = Math.floor(uptimeInSeconds / 60);
const uptimeInHours = Math.floor(uptimeInMinutes / 60);

const uptime = `${uptimeInSeconds} seconds, ${uptimeInMinutes % 60} minutes, ${uptimeInHours} hours`;

const username = adminConfig.loginpanel.user;
const password = adminConfig.loginpanel.password;
const restartPasscode = adminConfig.loginpanel.passcode;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

function getBotInfo() {
    return {
        botName: adminConfig.botName || "MyBot",
        prefix: adminConfig.prefix || "!",
        ownerName: adminConfig.ownerName || "Jonell Magallanes",
        commandsCount: fs.readdirSync('./cmds').length,
        eventsCount: fs.readdirSync('./events').length,
        threadsCount: Object.keys(JSON.parse(fs.readFileSync('./database/threads.json', 'utf8') || "{}")).length,
        usersCount: Object.keys(JSON.parse(fs.readFileSync('./database/users.json', 'utf8') || "{}")).length,
            uptime: `${Math.floor(process.uptime())} seconds`,
        os: `${os.type()} ${os.release()} (${os.platform()})`,
        host: os.hostname(),
        responseTime: `${responseLatency}ms`,
        ram: `${(process.memoryUsage().heapUsed / 1024 / 1024)}`,
        cpu: `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)}`,
        FCA: `${adminConfig.FCA}`,
       // admin: adminConfig.adminUIDs.includes(senderID)
    };
}

let responseLatency = 0;

io.on('connection', (socket) => {
    socket.emit('updateStats', getBotInfo());

    socket.on('restartBot', (inputPasscode) => {
        if (inputPasscode === restartPasscode) {
            socket.emit('restartSuccess', 'Successfully Restarted!') 
            
        } else {
            socket.emit('restartFailed', 'Incorrect passcode. Please try again.');
        }
    });

    socket.on('executeCommand', (command) => {
        const commandParts = command.split(' ');
        const cmd = commandParts[0];
        const args = commandParts.slice(1);

        const processCommand = spawn(cmd, args, { shell: true });
        const startTime = Date.now();

        processCommand.stdout.on('data', (data) => {
            const elapsedTime = Date.now() - startTime;
            socket.emit('commandOutput', { output: `$Hutchin-bot ~: ${data}`, color: 'green' });
        });

        processCommand.stderr.on('data', (data) => {
            const elapsedTime = Date.now() - startTime;
            socket.emit('commandOutput', { output: `$Hutchin-bot ~: Error: ${data} (Response time: ${elapsedTime} ms)`, color: 'red' });
        });

        processCommand.on('close', (code) => {
            const elapsedTime = Date.now() - startTime;
            socket.emit('commandOutput', { output: `$Hutchin-bot ~: Command exited with code ${code} (Response time: ${elapsedTime} ms)`, color: 'blue' });
        });
    });

    socket.on('exitConsole', () => {
        socket.emit('commandOutput', { output: 'Exiting console...', color: 'blue' });
        socket.emit('redirectHome');
        socket.disconnect();
    });

    setInterval(() => {
        const start = Date.now();
        io.emit('updateStats', getBotInfo());
        responseLatency = Date.now() - start;
    }, 1000);
});

app.post('/login', (req, res) => {
    const { username: inputUsername, password: inputPassword } = req.body;

    if (username === inputUsername && password === inputPassword) {
        req.session.loggedin = true;
        res.redirect('/console');
    } else {
        res.redirect('/login.html?error=Unauthorized'); 
    }
});

function checkAuth(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login.html'); 
    }
}

app.get('/console', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', '3028.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'login.html'));
});

app.get('/console', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'dashboard', '3028.html'));
    } else {
        res.redirect('/login.html'); 
    }
});

server.listen(PORT, () => {
console.error(boldText(gradient.cristal(`[ Deploying Dashboard Bot Server Proxy is: ${PORT} ]`)));
});