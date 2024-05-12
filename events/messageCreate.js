// messageCreate.js
const { getPrefix, ownerIds } = require('../config');
const Discord = require('discord.js');
const client = require(process.cwd() + '/index.js');

client.on("messageCreate", async msg => {
  if (!msg.content || msg.author.bot) return;

  const botMention = msg.content === `<@${client.user.id}>`;
  if (botMention) {
    return msg.reply(`Who pinged me? Oh hey ${msg.author.displayName}! Nice to meet you <3`);
  }

  const customPrefix = (await getPrefix(msg.guild.id)).toLowerCase();
  const defaultPrefix = "r.";
  let messageContent = msg.content.toLowerCase(); // Declare as let

  // Check if the message starts with the custom prefix or with the default prefix "cp"
  if (!messageContent.startsWith(customPrefix) && !messageContent.startsWith(defaultPrefix)) return;

  let prefixLength = customPrefix.length;
  if (!messageContent.startsWith(customPrefix)) {
    prefixLength = defaultPrefix.length; // Default prefix length 'd.'
  }

  const args = messageContent.slice(prefixLength).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  if (command) {
    try {
      await command.execute({ client, Discord, args, prefix: customPrefix, msg });
    } catch (error) {
      console.error(error);
      return msg.reply('There was an error executing that command!');
    }
  } 
});