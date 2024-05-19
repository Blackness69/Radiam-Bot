const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fun')
    .setDescription('Fun Commands')
    .addSubcommand(subcommand => {
      return subcommand
        .setName('smallcaps')
        .setDescription('ᴍᴀᴋᴇ ᴛʜᴇ ᴛᴇxᴛ ʟᴏᴏᴋ ʟɪᴋᴇ ᴛʜɪs.')
        .addStringOption(option => {
          return option
            .setName('text')
            .setDescription('The text you want to make smallcaps.')
            .setRequired(true);
        });
    })
    .addSubcommand(subcommand => {
      return subcommand
        .setName('emojify')
        .setDescription('Convert text to emoji text.')
        .addStringOption(option => {
          return option
            .setName('text')
            .setDescription('The text you want to emojify.')
            .setRequired(true);
        });
    })
    .addSubcommand(subcommand => {
      return subcommand
        .setName('boldtext')
        .setDescription('𝗺𝗮𝗸𝗲 𝘁𝗵𝗲 𝘁𝗲𝘅𝘁 𝗹𝗼𝗼𝗸 𝗹𝗶𝗸𝗲 𝘁𝗵𝗶𝘀.')
        .addStringOption(option => {
          return option
            .setName('text')
            .setDescription('The text you want to make bold.')
            .setRequired(true);
        });
    }),
  async execute({ interaction }) {
    const { options } = interaction;
    const subcommand = options.getSubcommand();

    if (subcommand === 'smallcaps') {
      const inputText = options.getString('text');
      const smallCapsText = toSmallCaps(inputText);
      await interaction.reply(smallCapsText);
    } else if (subcommand === 'emojify') {
      const inputText = options.getString('text');
      const emojifiedText = emojifyText(inputText);
      await interaction.reply(emojifiedText);
    } else if (subcommand === 'boldtext') {
      const inputText = options.getString('text');
      const boldFancyText = toBoldFancy(inputText);
      await interaction.reply(boldFancyText);
    }
  }
};

function toSmallCaps(text) {
  const smallCaps = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ',
    'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ',
    'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ',
    'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
    'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ',
    'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ',
    'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 's', 'T': 'ᴛ', 'U': 'ᴜ',
    'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
  };
  return text.split('').map(char => smallCaps[char] || char).join('');
}

function emojifyText(text) {
  const emojiNumbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
  const emojiAlphabet = {
    'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬',
    'h': '🇭', 'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳',
    'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹', 'u': '🇺',
    'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿'
  };

  return text.split('').map(char => {
    if (emojiAlphabet[char.toLowerCase()]) {
      return emojiAlphabet[char.toLowerCase()] + ' ';
    } else if (!isNaN(char)) {
      return emojiNumbers[char] + ' ';
    } else {
      return char;
    }
  }).join('');
}

function toBoldFancy(text) {
  const boldFancy = {
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭'
  };
  return text.split('').map(char => boldFancy[char] || char).join('');
}