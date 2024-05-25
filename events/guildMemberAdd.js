const welcomeSchema = require('../Schemas/utils/welcomeSchema');
const { EmbedBuilder } = require('discord.js');
const client = require(process.cwd() + '/index.js');

client.on("guildMemberAdd", async (member) => {
    const data = await welcomeSchema.findOne({ guildId: member.guild.id });

    if (!data) return;

    const welcomeMessage = data.welcomeMessage;
    const channelId = data.channelId;
    const embedOption = data.embedOption;
    const embedTitle = data.embedTitle;
    const embedColor = data.embedColor;
    const thumbnailUrl = data.thumbnailUrl;
    const bannerUrl = data.bannerUrl;
    const footerTxt = data.footerText;

    const guild = member.guild;
    const channel = guild.channels.cache.get(channelId);
    await guild.members.fetch();

    if (!channel) return;

    let messageToSend = welcomeMessage
        .replace(/{userMention}/g, `<@${member.id}>`)
        .replace(/{userName}/g, member.user.username)
        .replace(/{guildName}/g, member.guild.name)
        .replace(/{memberCount}/g, `${guild.memberCount}`);

    let titleToPut = embedTitle
        .replace(/{userMention}/g, `<@${member.id}>`)
        .replace(/{userName}/g, member.user.username)
        .replace(/{guildName}/g, member.guild.name)
        .replace(/{memberCount}/g, `${guild.memberCount}`);

    let footerText = footerTxt
    .replace(/{userMention}/g, `<@${member.id}>`)
    .replace(/{userName}/g, member.user.username)
    .replace(/{guildName}/g, member.guild.name)
    .replace(/{memberCount}/g, `${guild.memberCount}`);

    if (embedOption) {
        const embed = new EmbedBuilder()
            .setTitle(titleToPut || 'Welcome!')
            .setDescription(messageToSend)
            .setColor(embedColor || '#A020F0');

        if (thumbnailUrl) embed.setThumbnail(thumbnailUrl);
        if (bannerUrl) embed.setImage(bannerUrl);
        if (footerTxt) embed.setFooter({ text: footerText });

        channel.send({ content: `<@${member.id}>`, embeds: [embed] });
    } else {
        channel.send(messageToSend);
    }
});