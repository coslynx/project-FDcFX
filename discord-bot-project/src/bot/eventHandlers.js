```javascript
const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');
const commandHandler = require('./commandHandler');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    await commandHandler(message);
  } catch (error) {
    console.error(`Error handling command: ${error}`);
    message.reply('An error occurred while processing your command. Please try again later.');
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  // Handle voice channel joins and leaves for bot functionality
  // ... (implementation specific to your bot's needs)
});

client.login(token);
```