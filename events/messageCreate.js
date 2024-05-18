const { getPrefix, ownerIds } = require('../config');
const Discord = require('discord.js');
const client = require(process.cwd() + '/index.js');
const schema = require('../Schemas/utils/autoresponder');

client.on("messageCreate", async msg => {
  if (!msg.content || msg.author.bot) return;

  const currentPrefix = await getPrefix(msg.guild.id);
  const botMention = `<@${client.user.id}>`;
  const botMentionWithExclamation = `<@!${client.user.id}>`;

  if (msg.content === botMention || msg.content === botMentionWithExclamation) {
    return msg.reply(`Who pinged me? Oh hey **${msg.author.username}**! My prefix for this server is **${currentPrefix}**. Type r.help for more information.`);
  }

  // AutoResponder
  const data = await schema.findOne({ guildId: msg.guild.id });
  if (data) {
    for (const d of data.autoresponses) {
      if (msg.content.toLowerCase().includes(d.trigger.toLowerCase())) {
        await msg.reply(d.response);
        break; // Ensure it stops processing further once an autoresponse is triggered
      }
    }
  }

  let messageContent = msg.content;
  let prefixLength = null;

  if (messageContent.startsWith(botMention) || messageContent.startsWith(botMentionWithExclamation)) {
    if (messageContent.startsWith(botMention)) {
      prefixLength = botMention.length;
    } else if (messageContent.startsWith(botMentionWithExclamation)) {
      prefixLength = botMentionWithExclamation.length;
    }
  } else if (messageContent.toLowerCase().startsWith(currentPrefix.toLowerCase())) {
    prefixLength = currentPrefix.length;
  } else if (messageContent.toLowerCase().startsWith("r.")) {
    prefixLength = "r.".length;
  } else {
    return;
  }

  messageContent = msg.content.slice(prefixLength).trim();
  const args = messageContent.split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  if (command) {
    try {
      await command.execute({ client, Discord, args, prefix: currentPrefix, msg });
    } catch (error) {
      console.error(error);
      return msg.reply('There was an error executing that command!');
    }
  }
});