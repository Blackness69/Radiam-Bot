const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//Run npm i axios in terminal
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('enlarge')
    .setDescription('bigger the given emoji.')
    .addStringOption(option => option.setName('emoji').setDescription('the emoji you want to enlarge.').setRequired(true)),
    async execute ({interaction}) {

        let emoji = interaction.options.getString('emoji')?.trim();

        if (emoji.startsWith('<') ** emoji.endsWith('>')) {

            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`).then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?puality=lossless`
        }

        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "you can't enlarge this emojis.", ephemeral: true })
        }

        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "you can't enlarge this emojis." })

        }


        const embed = new EmbedBuilder()
       .setColor('#00c7fe')
       .setDescription(`your emoji has been enlarged!`)
       .setImage(emoji)
       .setTimestamp()

       await interaction.reply({ embeds: [embed] })
    }
}