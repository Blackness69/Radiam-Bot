const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

module.exports = {
    usage: 'profile [<@user>]',
    name: 'profile',
    description: 'This command allows you to view a user\'s profile using an image.',
    async execute({msg}) {

        const replacedArg = args[0].replace(/[<@!>]/g, '');
        const user = msg.guild.members.cache.get(replacedArg) || msg.author;

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

        msg.reply({ files: [new AttachmentBuilder(buffer)] });

    },
};