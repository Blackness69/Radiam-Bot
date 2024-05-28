const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage roles for a user')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a role to a user')
        .addUserOption(option => option.setName('user').setDescription('The user to add the role to').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role to add to the user').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a role from a user')
        .addUserOption(option => option.setName('user').setDescription('The user to remove the role from').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role to remove from the user').setRequired(true))
    ),

  async execute({interaction}) {
    const subcommand = interaction.options.getSubcommand();
    
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '❌ | I do not have permission to manage roles.', ephemeral: true });
    }

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '❌ | you do not have permission to manage roles.', ephemeral: true });
    }
    

    if (subcommand === 'add') {

      const user = interaction.options.getUser('user');
      const role = interaction.options.getRole('role');
      const member = interaction.guild.members.cache.get(user.id);
      
      if (role.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({ content: '❌ | I could not add role as that role is above me in the server hierarchy.', ephemeral: true });
      }
      
      if (member.roles.cache.has(role.id)) {
        return interaction.reply({ content: '❌ | This user already has that role.', ephemeral: true });
      }

      await member.roles.add(role).catch(err => {
        console.error(err);
        return interaction.reply({ content: '❌ | There was an error adding the role.', ephemeral: true });
      });

      return interaction.reply({ content: `✅ | Successfully added the role <@&${role.id}> to ${user.tag}.`, ephemeral: true });
    }

    if (subcommand === 'remove') {

      const user = interaction.options.getUser('user');
      const role = interaction.options.getRole('role');
      const member = interaction.guild.members.cache.get(user.id);

      if (role.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({ content: '❌ | I could not remove role as that role is above me in the server hierarchy.', ephemeral: true });
      }
      
      if (!member.roles.cache.has(role.id)) {
        return interaction.reply({ content: '❌ | This user does not have that role.', ephemeral: true });
      }

      await member.roles.remove(role).catch(err => {
        console.error(err);
        return interaction.reply({ content: '❌ | There was an error removing the role.', ephemeral: true });
      });

      return interaction.reply({ content: `✅ | Successfully removed the role <@&${role.id}> from ${user.tag}.`, ephemeral: true });
    }
  },
};