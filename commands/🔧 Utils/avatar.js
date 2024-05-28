const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    description: 'Get your own avatar or the avatar of another user',
    async execute({ msg, args }) {
        const replacedArg = args[0].replace(/[<@!>]/g, '');
        const member = msg.guild.members.cache.get(replacedArg) || msg.author;

        const link = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Avatar Link')
                    .setURL(member.user.displayAvatarURL({ format: "png", size: 2048 }))
                    .setStyle(ButtonStyle.Link)
            );

        const avatar = new EmbedBuilder()
            .setDescription(`Avatar of **${member.user.username}**`)
            .setFooter({ text: `${msg.guild.name}`, iconURL: msg.client.user.displayAvatarURL({ dynamic: true }) })
            .setImage(member.user.displayAvatarURL({ format: "png", size: 2048 }))
            .setTimestamp()
            .setColor('#A020F0');

        await msg.reply({ embeds: [avatar], components: [link] });
    },
};