const { getPrefix, ownerIds } = require('../config');
const Discord = require('discord.js');
const client = require(process.cwd() + '/index.js');
const schema = require('../Schemas/utils/autoresponder');
const afkSchema = require('../Schemas/utils/afkSchema');
const ChatbotChannel = require('../Schemas/utils/chatbotSchema');
const fetch = require('node-fetch');

client.on("messageCreate", async msg => {
  if (!msg.content || msg.author.bot || !msg.guild) return;

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

  // AFK System
  const check1 = await afkSchema.findOne({
    Guild: msg.guild.id,
    User: msg.author.id,
  });

  if (check1) {
    await afkSchema.deleteMany({
      Guild: msg.guild.id,
      User: msg.author.id,
    });

    await msg.reply({
      content: `Welcome back, ${msg.author}! I have removed your AFK.`,
    });
  } else {
    const mentionedUsers = msg.mentions.users;

    mentionedUsers.forEach(async (user) => {
      const Data = await afkSchema.findOne({
        Guild: msg.guild.id,
        User: user.id,
      });

      if (Data) {
        const reason = Data.Reason || "I'm AFK!";
        await msg.reply({
          content: `${user.tag} is currently AFK! - Reason: **${reason}**`,
        });
      }
    });
  }

  // Chat with Brainshop API
  try {
    const chatbotSetting = await ChatbotChannel.findOne({ guildId: msg.guild.id, channelId: msg.channel.id });

    if (chatbotSetting || msg.mentions.has(client.user)) {
      fetch(`http://api.brainshop.ai/get?bid=153861&key=0ZjvbPWKAxJvcJ96&uid=1&msg=${encodeURIComponent(msg.content.replace(`<@${client.user.id}>`, ''))}`)
        .then(res => res.json())
        .then(data => {
          msg.channel.sendTyping();
          msg.channel.send(data.cnt).catch(() => {});
        })
        .catch(error => {
          console.error('Error with Brainshop API request:', error);
        });
    }
  } catch (e) {
    console.log('Error:', e);
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