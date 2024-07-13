const { PermissionsBitField } = require('discord.js');

module.exports = {
  usage: 'purge <amount> / <all>',
  name: 'purge',
  description: 'Delete a specified number of messages (between 1 and 100), or all messages if "purge all" is specified.',
  async execute({ msg, args }) {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return msg.reply('❌ | You need the ``ManageMessages`` permission to use this command.');
    }

    if (!msg.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return msg.reply('❌ | I need the ``ManageMessages`` permission to use this command.');
    }

    let amount;
    if (args[0] && args[0].toLowerCase() === 'all') {
      amount = 100;
    } else {
      amount = parseInt(args[0]);
      if (isNaN(amount) || amount <= 0 || amount > 100) {
        return msg.reply('Please provide a number between 1 and 100, or specify "purge all" to delete up to 100 messages.');
      }
    }

    try {
      const now = Date.now();
      let fetched = await msg.channel.messages.fetch({ limit: amount });

      const commandMessage = fetched.filter(m => m.id === msg.id);
      fetched = fetched.filter(m => now - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000 && m.id !== msg.id);

      if (fetched.size === 0) {
        return msg.reply('No messages found that are less than 14 days old.');
      }

      await msg.channel.bulkDelete(fetched, true); // `true` will filter out messages older than 14 days, but we already did this manually

      const reply = await msg.channel.send(`Successfully purged ${fetched.size} message(s).`);
      setTimeout(() => {
        reply.delete();
      }, 3000);

      if (fetched.size < amount) {
        const feedback = msg.reply('Some messages were not deleted because they are older than 14 days.');
      }
    } catch (error) {
      console.error(error);
      msg.reply('There was an error purging messages.');
    }
  },
};