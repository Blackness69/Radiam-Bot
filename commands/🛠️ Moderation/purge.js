const { PermissionsBitField } = require('discord.js');

module.exports = {
  usage: 'r.purge <amount | all>',
  name: 'purge',
  description: 'Delete a specified number of messages (between 1 and 100), or all messages if "purge all" is specified.',
  async execute({msg, args}) {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return msg.reply('You need the ``ManageMessages`` permission to use this command.');
    }

    let amount;
    if (args[0] && args[0].toLowerCase() === 'all') {
      amount = 100;
    } else {
      amount = parseInt(args[0]);
      if (isNaN(amount) || amount <= 0 || amount > 100) {
        return msg.reply('Please provide a number between 1 and 100, or specify "purge all" to delete all messages.');
      }
    }

    try {
      let fetched;
      if (amount === 100) {
        fetched = await msg.channel.messages.fetch({ limit: 100 });
      } else {
        fetched = await msg.channel.messages.fetch({ limit: amount + 1 });
      }

      await msg.channel.bulkDelete(fetched);
      const reply = await msg.channel.send(`Successfully purged ${fetched.size - 1} message(s).`);
      setTimeout(() => {
        reply.delete();
      }, 3000);
    } catch (error) {
      console.error(error);
      msg.reply('There was an error purging message(s).');
    }
  },
};