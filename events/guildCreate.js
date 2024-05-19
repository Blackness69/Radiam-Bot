const { EmbedBuilder } = require('discord.js');
const client = require(process.cwd() + '/index.js')

client.on("guildCreate", async (guild) => {
  // Add interaction create event handling logic here
    console.log(guild.owner)
  // Send a direct message to the bot owner
  const { mainOwnerId } = require('../config.js');
  if (ownerId) {
      await guild.members.fetch({ force: true });
      const botOwner = client.users.cache.get(mainOwnerId);
      const owner = guild.members.cache.get(guild.ownerId);
      if (owner) {
          const guildJoin = new EmbedBuilder()
              .setTitle('Bot joined a guild!')
              .setDescription(`Guild Information`)
              .setColor('#A020F0')
              .addFields(
                  { name: 'Guild ID:', value: `${guild.id}`, inline: false },
                  { name: 'Guild Name:', value: `${guild.name}`, inline: false },
              );

          if (owner) {
              guildJoin.addFields(
                  { name: 'Guild Owner Username:', value: `${owner.user.username}`, inline: false },
                  { name: 'Guild Owner Nickname:', value: `${owner.displayName}`, inline: false },
                  { name: 'Guild Owner Id:', value: `${owner.user.id}`, inline: false },
              );
          } else {
              guildJoin.addFields(
                  { name: 'Guild Owner Username:', value: 'Unknown', inline: false },
                  { name: 'Guild Owner Nickname', value: 'Unknown', inline: false },
                  { name: 'Guild Owner Id:', value: 'Unknown', inline: false },
              );
          }

          guildJoin.addFields(
              { name: 'Leave Server Command:', value: `t!leave-server {guild id}`, inline: false }
          )
          .setTimestamp();

          botOwner.send({ embeds: [guildJoin] })
              .catch(error => console.error("Error sending message to owner:", error));
      }
    }
});