```javascript
const { Client, Intents } = require('discord.js');
const { token } = require('../config');
const { 
  readyEventHandler, 
  messageCreateEventHandler, 
  voiceStateUpdateEventHandler 
} = require('./eventHandlers');
const commandHandler = require('./commandHandler');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  readyEventHandler(client);
});

client.on('messageCreate', (message) => {
  messageCreateEventHandler(client, message, commandHandler);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  voiceStateUpdateEventHandler(client, oldState, newState);
});

client.login(token);
```