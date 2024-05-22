// guildMemberRemove
const leaveSchema = require('../Schemas/utils/leaveSchema');
const { EmbedBuilder } = require('discord.js');
const client = require(process.cwd() + '/index.js');

client.on("guildMemberRemove", async (member) => {
    const data = await leaveSchema.findOne({ guildId: member.guild.id });

    if (!data) return;

    const leaveMessage = data.leaveMessage;
    const channelId = data.channelId;
    const embedOption = data.embedOption;
    const embedTitle = data.embedTitle;
    const embedColor = data.embedColor;

    const guild = member.guild;
    const channel = guild.channels.cache.get(channelId);
    await guild.members.fetch();
    
    if (!channel) return;

    let messageToSend = leaveMessage
        .replace(/{userMention}/g, `<@${member.id}>`)
        .replace(/{userName}/g, member.user.username)
        .replace(/{guildName}/g, member.guild.name)
        .replace(/{memberCount}/g, `${guild.memberCount}`);

    if (embedOption) {
        const embed = new EmbedBuilder()
            .setTitle(embedTitle || 'Good Bye🥀')
            .setDescription(messageToSend)
            .setColor(embedColor || '#A020F0');

        channel.send({ content: `<@${member.id}>`, embeds: [embed] });
    } else {
        channel.send(messageToSend);
    }
});