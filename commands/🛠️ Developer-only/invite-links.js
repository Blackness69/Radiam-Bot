const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { mainOwnerId } = require('../../config.js');

module.exports = {
  name: 'invite-links',
  description: 'Send all server invite links to the bot owner.',
  async execute({ client, msg }) {
    if (msg.author.id !== mainOwnerId) return;

    const inviteLinks = [];

    // Use Promise.all to handle multiple asynchronous operations
    await Promise.all(client.guilds.cache.map(async (guild) => {
      try {
        // Check if the bot has the required permission
        const botMember = await guild.members.fetch(client.user.id);
        
          if (!guild.members.me.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
            inviteLinks.push(`${guild.name}: No perms`);
        } else {
          const invites = await guild.invites.fetch();
          const invite = invites.find(invite => !invite.maxAge);
          if (invite) {
            inviteLinks.push(`${guild.name}: ${invite.url}`);
          } else {
            inviteLinks.push(`${guild.name}: No valid invite link found`);
          }
        }
      } catch (error) {
        console.error(`Error fetching invites for guild ${guild.name}:`, error);
        inviteLinks.push(`${guild.name}: Error fetching invites`);
      }
    }));

    // Send the list of invite links to the bot owner
    const botOwner = await client.users.fetch(mainOwnerId);
    botOwner.send(`Here are the invite links for the servers the bot is in:\n${inviteLinks.join('\n')}`)
      .catch(error => console.error("Error sending message to owner:", error));
  }
}; 