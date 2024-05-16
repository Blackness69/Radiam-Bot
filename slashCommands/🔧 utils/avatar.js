const {  MessageEmbed, MessageActionRow, MessageButton, ButtonStyle } = require('discord.js');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get your own avatar or the avatar of another user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Tag a user to get their avatar.')
            .setRequired(false)
        ),

    async execute({interaction}) {
        const user = interaction.options.getUser('user') || interaction.user;

        const link = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Avatar Link')
                    .setURL(user.displayAvatarURL({ format: "png", size: 2048 }))
                    .setStyle(ButtonStyle.Link)
            );

        const avatar = new EmbedBuilder()
            .setDescription(`Avatar of **${user.username}**.`)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
            .setImage(user.displayAvatarURL({ format: "png", size: 2048 }))
            .setTimestamp()
            .setColor("#A020F0");

        await interaction.reply({ embeds: [avatar], components: [link] });
    },
};
