const { mainOwnerId } = require('../../config.js');

module.exports = {
    name: 'getinvite',
    description: 'Get the invite link for a provided guild ID',
    async execute({msg, args}) {
        if (msg.author.id !== mainOwnerId) return;
        
        const guildId = args[0]; // Get the guild ID from the command arguments
        const guild = msg.client.guilds.cache.get(guildId);

        if (!guild) {
            return msg.reply('Guild not found!');
        }

        guild.invites.fetch().then(invites => {
            if (invites.size === 0) {
                return msg.reply('No invites found for this guild.');
            }
            const invite = invites.first();
            msg.channel.send(`Invite link for ${guild.name}: ${invite.url}`);
        }).catch(error => {
            console.error('Error fetching invites:', error);
            msg.reply('An error occurred while fetching invites.');
        });
    },
};
