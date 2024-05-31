const { SlashCommandBuilder, ChannelType } = require('discord.js');
const ChatbotSchema = require('../../Schemas/utils/chatbotSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatbot')
    .setDescription('Enable or disable the chatbot in a channel')
    .addSubcommand(subcommand => {
      return subcommand
        .setName('enable')
        .setDescription('Enable chatbot in this channel')
        .addChannelOption(option => {
          return option
          .setName('channel')
          .setDescription('The channel where you want the bot to chat.')
          .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
          .setRequired(false)
        })
    })
    .addSubcommand(subcommand => {
      return subcommand
        .setName('disable')
        .setDescription('Disable chatbot in this channel')
    }),
  async execute({interaction}) {
    const { guild, options } = interaction;
    
    if (!guild) return interaction.reply('This command can only be used in a server.');

    const subcommand = interaction.options.getSubcommand();
    const channel = options.getChannel('channel') || interaction.channel;
    const data = await ChatbotSchema.findOne({ guildId: guild.id, channelId: channel.id });
    
    if (subcommand === 'enable') {
      if (data) {
        return interaction.reply({ content: "ChatBot is already enabled in this server.", ephemeral: true });
      } else {
        
      await ChatbotSchema.create({ guildId: guild.id, channelId: channel.id });
      return interaction.reply(`Chatbot has been enabled in this channel.`);
     }
    }
    if (subcommand === 'disable') {
      if (!data) {
        interaction.reply({ content: " ChatBot is already disabled in this server.", ephemeral: true });
        return;
      } else {
        
      await ChatbotSchema.deleteMany({});
      return interaction.reply(`Chatbot has been disabled in this channel.`);
     }
    }
  },
};