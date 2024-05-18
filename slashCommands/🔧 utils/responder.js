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

    if (subcommand === 'add') {
      const trigger = interaction.options.getString('trigger');
      const response = interaction.options.getString('response');

      const data = await schema.findOne({ guildId: interaction.guild.id });

      if (!data) {
        await schema.create({
          guildId: interaction.guild.id,
          autoresponses: [
            {
              trigger: trigger,
              response: response,
            }
          ]
        });

        const embed = new EmbedBuilder()
          .setTitle('AutoResponse Created')
          .setDescription(`Trigger:\n${trigger}\n\nResponse: ${response}`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else {
        const autoresponders = data.autoresponses;
        for (const t of autoresponders) {
          if (t.trigger === trigger)
            return interaction.reply({
              content: "You must have unique triggers.",
              ephemeral: true
            });
        }

        const addto = {
          trigger: trigger,
          response: response,
        };

        await schema.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { $push: { autoresponses: addto } }
        );

        const embed = new EmbedBuilder()
          .setTitle('AutoResponse Created')
          .setDescription(`\nTrigger: ${trigger}\n\nResponse: ${response}`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } else if (subcommand === 'remove') {
      const trigger = interaction.options.getString('trigger');
      const data = await schema.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $pull: { autoresponses: { trigger: trigger } } },
        { new: true }
      );

      if (!data) {
        const embed = new EmbedBuilder()
          .setDescription('I couldn\'t find an auto response with that trigger.');

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        const embed = new EmbedBuilder()
          .setDescription(`Deleted that auto response\n\nTrigger: ${trigger}`);

        await interaction.reply({ embeds: [embed] });
      }
    } else if (subcommand === 'list') {
      const data = await schema.findOne({ guildId: interaction.guild.id });

      if (!data || !data.autoresponses || data.autoresponses.length === 0) {
        const embed = new EmbedBuilder()
          .setTitle('AutoResponse List')
          .setDescription('No autoresponses found.');

        await interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setTitle('Autoresponse List')
          .setDescription('List of all autoresponses.');

        data.autoresponses.forEach((autoresponse, index) => {
          embed.addFields({
            name: `Autoresponse #${index + 1}`,
            value: `Trigger: ${autoresponse.trigger}\nResponse: ${autoresponse.response}`,
          });
        });

        await interaction.reply({ embeds: [embed] });
      }
    } else if (subcommand === 'remove-all') {
      const data = await schema.findOne({ guildId: interaction.guild.id });

      if (!data) {
        const embed = new EmbedBuilder()
          .setDescription('No Autoresponder Found.');

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        await schema.deleteMany({ guildId: interaction.guild.id });

        const embed = new EmbedBuilder()
          .setDescription('Successfully deleted all responses.');

        await interaction.reply({ embeds: [embed] });
      }
    }
  }
};