const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color } = require('../../config');

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
    .setName('timer')
    .setDescription('Start a timer.')
    .addStringOption(option =>
      option
        .setName('duration')
        .setDescription('The timer duration (e.g., "1m12s", "1 minute 12 seconds").')
        .setRequired(true)
    ),
  async execute({ interaction }) {
    const { options } = interaction;
    const durationString = options.getString('duration');

    const duration = parseDuration(durationString);

    if (!duration || duration <= 0) {
      return await interaction.reply({ content: 'Please provide a valid duration format (e.g., "1m12s", "1 minute 12 seconds").', ephemeral: true });
    }

    const endTime = Date.now() + duration;

    const embed = new EmbedBuilder()
      .setTitle('Timer Started')
      .setDescription(`### The timer will end <t:${Math.floor(endTime / 1000)}:R>`)
      .setFooter({ text: '⚠️ This timer can be 1-2 seconds off due to API call delays.', iconURL: interaction.guild.iconURL() })
      .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
      .setColor(color.default);

    const message = await interaction.channel.send({ embeds: [embed] });

    setTimeout(async () => {
      const endedEmbed = new EmbedBuilder()
        .setTitle('Timer Ended')
        .setDescription(`### Timer ended <t:${Math.floor(endTime / 1000)}:R>`)
        .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
        .setTimestamp()
        .setColor(color.red);

      await message.edit({ embeds: [endedEmbed] });
    }, duration);
  },
};