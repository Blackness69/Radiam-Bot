const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const prettyMs = require('pretty-ms');

function parseDuration(durationStr) {
  const regex = /(\d+)\s*(second|seconds|s|minute|minutes|m|hour|hours|h|day|days|d)/gi;
  let duration = 0;
  let match;

  while ((match = regex.exec(durationStr)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 's':
      case 'second':
      case 'seconds':
        duration += value * 1000;
        break;
      case 'm':
      case 'minute':
      case 'minutes':
        duration += value * 60 * 1000;
        break;
      case 'h':
      case 'hour':
      case 'hours':
        duration += value * 60 * 60 * 1000;
        break;
      case 'd':
      case 'day':
      case 'days':
        duration += value * 24 * 60 * 60 * 1000;
        break;
      default:
        return null;
    }
  }

  return duration;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Manage Giveaway System')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Starts a giveaway')
        .addStringOption(option =>
          option
            .setName('duration')
            .setDescription('The duration of the giveaway.')
            .setRequired(true))
        .addIntegerOption(option =>
          option
            .setName('winners')
            .setDescription('The winners of the giveaway.')
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('prize')
            .setDescription('What the winners will win.')
            .setRequired(true))
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel where you want to start the giveaway.')
            .setRequired(false))
        .addStringOption(option =>
          option
            .setName('content')
            .setDescription('The content will be used for the giveaway.')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edits a giveaway.')
        .addStringOption(option =>
          option
            .setName('message-id')
            .setDescription('The ID of the giveaway message.')
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('duration')
            .setDescription('The added duration of the giveaway.')
            .setRequired(true))
        .addIntegerOption(option =>
          option
            .setName('winners')
            .setDescription('The updated number of winners.')
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('prize')
            .setDescription('The new prize of the giveaway.')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('end')
        .setDescription('End an existing giveaway.')
        .addStringOption(option =>
          option
            .setName('message-id')
            .setDescription('The ID of the giveaway message.')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('reroll')
        .setDescription('Reroll a giveaway')
        .addStringOption(option =>
          option
            .setName('message-id')
            .setDescription('The ID of the giveaway message.')
            .setRequired(true))),

  async execute({ interaction, client }) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return await interaction.reply({ content: 'You must have **Manage Server** permission to use this command.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();
    const durationString = interaction.options.getString('duration');
    const duration = parseDuration(durationString);

    if (!duration || duration <= 0) {
      return await interaction.reply({ content: 'Please provide a valid duration format (e.g., "1m12s", "1 minute 12 seconds").', ephemeral: true });
    }
    
    switch (sub) {
      case 'start':
        await interaction.reply({ content: 'Starting the giveaway...', ephemeral: true });

        const winnerCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        const contentMain = interaction.options.getString('content');
        const channel = interaction.options.getChannel('channel');
        const showChannel = channel || interaction.channel;
        client.giveawayManager.start(showChannel, {
          prize,
          winnerCount,
          duration,
          hostedBy: interaction.user,
          lastChance: {
            enabled: false,
            content: contentMain,
            threshold: 60000000000_000,
            embedColor: '#A020F0'
          },
          messages: {
            giveaway: `🎉 **Giveaway Started** 🎉`,
            giveawayEnded: `🎉 **Giveaway Ended** 🎉`,
            title: '🎉 **Giveaway** 🎉',
            inviteToParticipate: `Winners: {this.winnerCount}\nReact With 🎉 to join the giveaway.`,
            hostedBy: `Hosted by: {this.hostedBy}`,
            endedAt: 'Ended At',
          }
        });

        interaction.editReply({ content: `Your giveaway has been started in ${showChannel}.`, ephemeral: true });
        break;

      case 'edit':
        await interaction.reply({ content: 'Editing your giveaway...', ephemeral: true });

        const newPrize = interaction.options.getString('prize');
        const newDurationString = interaction.options.getString('duration');
        const newDuration = parseDuration(newDurationString);

        if (!newDuration || newDuration <= 0) {
          return await interaction.reply({ content: 'Please provide a valid duration format (e.g., "1m12s", "1 minute 12 seconds").', ephemeral: true });
        }

        const newWinners = interaction.options.getInteger('winners');
        const messageId = interaction.options.getString('message-id');

        client.giveawayManager.edit(messageId, {
          addTime: newDuration,
          newWinnerCount: newWinners,
          newPrize: newPrize,
        }).then(() => {
          interaction.editReply({ content: 'Your giveaway has been edited.', ephemeral: true });
        }).catch(err => {
          interaction.editReply({ content: 'There was an error while editing your giveaway.', ephemeral: true });
        });
        break;

      case 'end':
        await interaction.reply({ content: 'Ending your giveaway...', ephemeral: true });

        const endMessageId = interaction.options.getString('message-id');
        client.giveawayManager.end(endMessageId).then(() => {
          interaction.editReply({ content: 'Your giveaway has been ended.', ephemeral: true });
        }).catch(err => {
          interaction.editReply({ content: 'An error occurred.', ephemeral: true });
        });
        break;

      case 'reroll':
        await interaction.reply({ content: 'Rerolling your giveaway...', ephemeral: true });

        const rerollMessageId = interaction.options.getString('message-id');
        const giveaway = client.giveawayManager.giveaways.find(g => g.guildId === interaction.guildId && (g.prize === rerollMessageId || g.messageId === rerollMessageId));

        if (!giveaway) {
          return interaction.editReply({ content: 'I could not find any giveaway with the message ID.', ephemeral: true });
        }

        client.giveawayManager.reroll(rerollMessageId, {
          messages: {
            congrat: '{winners}! Congratulations, you won {this.prize}!\n{this.messageURL}',
            error: 'No valid participant.'
          }
        }).then(() => {
          interaction.editReply({ content: 'Your giveaway has been rerolled.', ephemeral: true });
        }).catch(err => {
          interaction.editReply({ content: 'There was an error.', ephemeral: true });
        });
        break;
    }
  },
};