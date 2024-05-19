const { EmbedBuilder } = require('discord.js');
const { mainOwnerId } = require('../../config.js');
module.exports = {
  name: 'allserver-info',
  description: 'Send all of the server information the bot is in to bot owner.',
  async execute({ client, msg }) {
    if (msg.author.id !== mainOwnerId) return;
      
    client.guilds.cache.forEach(guild => {
      const guildOwner = guild.members.cache.get(guild.ownerId);
      const embed = new EmbedBuilder()
        .setTitle('Guild Information')
        .setDescription('Here is the information')
        .addFields(
          { name: 'Guild Name', value: `${guild.name}`, inline: true },
          { name: 'Guild ID', value: `${guild.id}`, inline: true }
        );
      
      if (guildOwner) {
        embed.addFields(
          { name: 'Guild Owner Username', value: `${guildOwner.user.username}`, inline: false },
          { name: 'Guild Owner Nickname', value: `${guildOwner.displayName}`, inline: false },
          { name: 'Guild Owner ID', value: `${guildOwner.user.id}`, inline: false }
        );
      } else {
        embed.addFields(
          { name: 'Guild Owner Username', value: 'Unknown', inline: false },
          { name: 'Guild Owner Nickname', value: 'Unknown', inline: false },
          { name: 'Guild Owner ID', value: 'Unknown', inline: false }
        );
      }

      embed.addFields(
        { name: 'Leave Server Command', value: `t!leave-server ${guild.id}`, inline: false }
      )
      .setTimestamp();

      const botOwner = client.users.cache.get(mainOwnerId);
      botOwner.send({ embeds: [embed] })
        .catch(error => console.error("Error sending message to owner:", error));
    });
  }
};