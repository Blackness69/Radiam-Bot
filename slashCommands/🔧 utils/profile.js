const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('This command allows you to view a user\'s profile using an image.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Choose the user whose profile you want to view.')
            .setRequired(false)
        ),
    async execute({interaction}) {

        await interaction.deferReply();

        const user = interaction.options.getUser('user') || interaction.user

        const buffer = await profileImage(user.id, {
            squareAvatar: false,
            removeAvatarFrame: false,
            overwriteBadges: true,
            badgesFrame: true,
            disableProfileTheme: false,
            moreBackgroundBlur: true,
            removeAvatarFrame: false,
            presenceStatus: 'idle'

        });

        interaction.editReply({ files: [new AttachmentBuilder(buffer)] });

    },
};