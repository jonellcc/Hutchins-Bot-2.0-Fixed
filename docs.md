# Bot Command And Events Command Documentation Hutchins Bot 2.0 Version :> By CC PROJECTS

## Command Structure

```javascript
module.exports = {
    name: "Name of command",
    info: "description of command",
    dev: "Author",
    onPrefix: true, // or false
    dmUser: false, // true or false
    nickName: ["alias1", "alias2"], // array of aliases
    usages: "Usage instructions",
    cooldowns: 10, // cooldown time in seconds
    onLaunch: async function ({ api, event, actions }) {
        // Command logic here
    }
};
```

### onLaunch
The `onLaunch` function is executed when the command is called. It can handle initialization tasks and respond to the event.

**Example:**
```javascript
onLaunch: async function ({ api, event, actions }) {
    const message = "Command executed!";
    await actions.reply(message);
}
```

### onEvents with target argument 
The `onEvents with Target` function is triggered with arguments, including the target.

**Example:**
```javascript
onEvents: async function ({ api, event, target }) {
    const targetText = target.join(" ");
    if (!targetText) return actions.reply("Provide the Text");
    // Function logic here 
}
```

### onReply
The `onReply` function is executed when a user replies to a specific message. This allows for context-sensitive responses.

**Example:**
```javascript
onReply: async function ({ reply, api, event }) {
    const response = `You said: ${reply}`;
    await actions.reply(response);
}
```

### callReact
The `callReact` function is invoked when a user reacts to a message. It enables confirmation actions or handling reactions.

**Example:**
```javascript
callReact: async function ({ reaction, event, api }) {
    if (reaction === '👍') {
        await actions.reply("Confirmed!");
    } else if (reaction === '👎') {
        await actions.reply("Cancelled.");
    }
}
```

### noPrefix
The `noPrefix` function allows the command to be executed without a prefix, useful for more natural interactions.

**Example:**
```javascript
noPrefix: async function ({ api, event }) {
    await actions.reply("This command can be executed without a prefix.");
}
```

## Actions

The `actions` object provides methods for responding to user interactions.

### Reply Message
Respond to a user directly.
```javascript
actions.reply("Hello!");
```

### Send Message
Send a message to the thread.
```javascript
actions.send("Hello, everyone!");
```

### React to Message
React to the current message with an emoji.
```javascript
actions.react("🔥");
```

### Edit the Message
Edit a previously sent message.
```javascript
const loading = await actions.reply("Loading...");
actions.edit("Hello", loading.messageID);
```

### Kick User
Remove a user from the group.
```javascript
actions.kick(userID);
```

### Leave Group
Remove the bot from the current group.
```javascript
actions.leave();
```

### Share Contact
Share a contact with a specific user.
```javascript
actions.share(contact, senderID);
```

## Nickname and dmUser Usage

### Nickname
You can use aliases for commands by defining a `nickName` property in your command object. This allows multiple names for the same command.

**Example:**
```javascript
module.exports = {
    name: "test",
    nickName: ["test", "testing"],
    onLaunch: async function ({ api, event, actions }) {
        await actions.reply("This is a test command.");
    },
    // other properties...
};
```

### dmUser
The `dmUser` property indicates whether a command can be executed through direct messages. If `dmUser` is `true`, the command can be used in DMs.

**Example:**
```javascript
module.exports = {
    name: "example",
    dmUser: true,
    onLaunch: async function ({ api, event, actions }) {
        await actions.reply("This command can be executed in DMs.");
    },
    // other properties...
};
```

### Summary

This documentation provides an overview of how to implement and utilize commands in your bot. It highlights the event handling methods and action functionalities for responding to user interactions. Ensure to follow the structure and examples to integrate new commands effectively.
