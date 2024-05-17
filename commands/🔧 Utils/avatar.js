const {  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
        name: 'avatar',
        aliases: ['av'],
        description: 'Get your own avatar or the avatar of another user',
    async execute({msg}) {
        const user = msg.mentions.users.first() || msg.author;

        const link = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Avatar Link')
                    .setURL(user.displayAvatarURL({ format: "png", size: 2048 }))
                    .setStyle(ButtonStyle.Link)
            );

        const avatar = new EmbedBuilder()
            .setDescription(`Avatar of **${user.username}**`)
            .setFooter({ text: `${msg.guild.name}`, iconURL: msg.client.user.displayAvatarURL({ dynamic: true }) })
            .setImage(user.displayAvatarURL({ format: "png", size: 2048 }))
            .setTimestamp()
            .setColor('#A020F0');

        await msg.reply({ embeds: [avatar], components: [link] });
    },
};
