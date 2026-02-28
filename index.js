import { Client, GatewayIntentBits } from 'discord.js';
import { Letta } from '@letta-ai/letta-client';
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const letta = new Letta({ apiKey: process.env.LETTA_API_KEY });

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    const response = await letta.agents.messages.create(
      process.env.LETTA_AGENT_ID, 
      { input: message.content }
    );

    // Letta returns an array of messages; find the assistant's reply
    for (const msg of response.messages) {
      if (msg.message_type === 'assistant_message' && msg.content) {
        await message.reply(msg.content);
      }
    }
  } catch (error) {
    console.error('Error talking to Letta:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
