const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const schema = require('../../Schemas/utils/autoresponder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoresponse')
    .setDescription('Manage Auto Responder')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add an autoresponse.')
        .addStringOption(option =>
          option
            .setName('trigger')
            .setDescription('The trigger it will auto response to.')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('response')
            .setDescription('The response for the trigger.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove an auto response.')
        .addStringOption(option =>
          option
            .setName('trigger')
            .setDescription('Remove the auto response by its trigger.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all the auto responses.')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove-all')
        .setDescription('Remove all auto responses.')
    ),
  async execute({ interaction }) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (subcommand === 'add') {
      const trigger = interaction.options.getString('trigger').toLowerCase();
      const response = interaction.options.getString('response').toLowerCase();

      const data = await schema.findOne({ guildId });

      if (!data) {
        await schema.create({
          guildId,
          autoresponses: [
            {
              trigger,
              response,
            }
          ]
        });
      } else {
        const autoresponders = data.autoresponses;
        for (const t of autoresponders) {
          if (t.trigger === trigger) {
            return interaction.reply({
              content: "You must have unique triggers.",
              ephemeral: true
            });
          }
        }

        await schema.findOneAndUpdate(
          { guildId },
          { $push: { autoresponses: { trigger, response } } }
        );
      }

      const embed = new EmbedBuilder()
        .setTitle('AutoResponse Created')
        .setDescription(`Trigger: ${trigger}\nResponse: ${response}`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } else if (subcommand === 'remove') {
      const trigger = interaction.options.getString('trigger').toLowerCase();

      const data = await schema.findOneAndUpdate(
        { guildId },
        { $pull: { autoresponses: { trigger } } },
        { new: true }
      );

      if (!data || !data.autoresponses.some(a => a.trigger === trigger)) {
        const embed = new EmbedBuilder()
          .setDescription('I couldn\'t find an auto response with that trigger.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setDescription(`Deleted auto response with trigger: ${trigger}`);
      await interaction.reply({ embeds: [embed] });

    } else if (subcommand === 'list') {
      const data = await schema.findOne({ guildId });

      if (!data || !data.autoresponses || data.autoresponses.length === 0) {
        const embed = new EmbedBuilder()
          .setTitle('AutoResponse List')
          .setDescription('No autoresponses found.');
        return interaction.reply({ embeds: [embed] });
      }

      const embed = new EmbedBuilder()
        .setTitle('AutoResponse List')
        .setDescription('List of all autoresponses.');

      data.autoresponses.forEach((autoresponse, index) => {
        embed.addFields({
          name: `Autoresponse #${index + 1}`,
          value: `Trigger: ${autoresponse.trigger}\nResponse: ${autoresponse.response}`,
        });
      });

      await interaction.reply({ embeds: [embed] });

    } else if (subcommand === 'remove-all') {
      const data = await schema.findOne({ guildId });

      if (!data) {
        const embed = new EmbedBuilder()
          .setDescription('No Autoresponder Found.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await schema.deleteMany({ guildId });

      const embed = new EmbedBuilder()
        .setDescription('Successfully deleted all responses.');
      await interaction.reply({ embeds: [embed] });
    }
  }
};