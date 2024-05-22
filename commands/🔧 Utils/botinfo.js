const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const os = require("os");
const moment = require("moment");
const cpuStat = require("cpu-stat");

module.exports = {
  usage: 'r.botinfo',
  name: "botinfo",
  description: "Shows some information about the bot.",
  async execute({client, msg}) {
    // uptime of bot

    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor((client.uptime / 3600000) % 24);
    const minutes = Math.floor((client.uptime / 60000) % 60);
    const seconds = Math.floor((client.uptime / 1000) % 60);

      let uptimeString = '';
      if (days > 0) uptimeString += `${days}d `;
      if (hours > 0) uptimeString += `${hours}h `;
      if (minutes > 0) uptimeString += `${minutes}m `;
      if (seconds > 0) uptimeString += `${seconds}s`;

      if (!uptimeString) uptimeString = '0s'; // Show 0s if the uptime is 0

    cpuStat.usagePercent(function (error, percent) {
      if (error) return console.log(error);

      const node = process.version;
      const memoryUsage = formatBytes(process.memoryUsage().heapUsed);
      const CPU = percent.toFixed(2);
      const CPUModel = os.cpus()[0].model;
      const cores = os.cpus().length;

      const botinfoEmbed = new EmbedBuilder()
        .setAuthor({
          name: "Bot info",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: `Made with 💞 by notblackness.exe`,
          iconURL: msg.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor("#A020F0")
        .addFields(
          {
            name: `**Bot Name:**`,
            value: `${client.user.username}`,
            inline: true,
          },
          { name: `**Bot ID:**`, value: `${client.user.id}`, inline: true },
          { name: `\u200B`, value: `\u200B`, inline: true }, // We Will This As Empty So It Won't Look Messed Up In Embed
          {
            name: `**Bot Created At:**`,
            value: `${moment.utc(client.user.createdAt).format("LLLL")}`,
            inline: true,
          },
          {
            name: `**Bot Joined At:**`,
            value: `${moment.utc(client.joinedAt).format("LLLL")}`,
            inline: true,
          },
          { name: `\u200B`, value: `\u200B`, inline: true }, // We Will This As Empty So It Won't Look Messed Up In Embed
          {
            name: `**Total Server(s):**`,
            value: `${client.guilds.cache.size}`,
            inline: true,
          },
          {
            name: `**Total Members(s):**`,
            value: `${client.users.cache.size}`,
            inline: true,
          },
          {
            name: `**Total Channels(s):**`,
            value: `${client.channels.cache.size.toLocaleString()}`,
            inline: true,
          },
          {
            name: `**UpTime:**`,
            value: `${uptimeString}`,
            inline: true,
          },
          {
            name: `**Ping:**`,
            value: `API Latency: **${client.ws.ping}**ms\nClient Ping: **${Date.now() - msg.createdTimestamp}**ms`,
            inline: true,
          },
          { name: `\u200B`, value: `\u200B`, inline: true }, // We Will This As Empty So It Won't Look Messed Up In Embed
          { name: `**NodeJS Version:**`, value: `${node}`, inline: true },
          { name: `**Memory Usage:**`, value: `${memoryUsage}`, inline: true },
          { name: `**CPU Usage:**`, value: `${CPU}`, inline: true },
          { name: `**CPU Model:**`, value: `${CPUModel}`, inline: true },
          { name: `**Cores:**`, value: `${cores}`, inline: true }
        );
      msg.reply({ embeds: [botinfoEmbed] });
    });

    function formatBytes(a, b) {
      let c = 1024; // 1GB = 1024MB
      d = b || 2;
      e = ["B", "KB", "MB", "GB", "TB"];
      f = Math.floor(Math.log(a) / Math.log(c));

      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    }
  },
};