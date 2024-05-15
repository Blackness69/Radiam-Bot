const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
  name: 'rock-paper-scissors',
  aliases: ['rps'],
  description: 'Play a Rock Paper Scissors game with your friend.',
  async execute({ msg }) {
    // Check if an opponent was mentioned
    const opponent = msg.mentions.members.first();
    if (!opponent || opponent.user.bot || opponent.id === msg.author.id) {
      return msg.reply('Please mention a valid opponent (a user, not a bot, and not yourself) to start a Rock Paper Scissors game.');
    }

    const Game = new RockPaperScissors({
      message: msg,
      opponent: opponent,
      embed: {
        title: 'Rock Paper Scissors',
        color: '#A020F0',
        description: 'Press a button to make your choice.'
      },
      buttons: {
        rock: 'Rock',
        paper: 'Paper',
        scissors: 'Scissors'
      },
      emojis: {
        rock: '🪨',
        paper: '📰',
        scissors: '✂️'
      },
      mentionedUser: true,
      timeoutTime: 60000,
      buttonStyle: 'PRIMARY',
      pickMessage: 'You chose {emoji}',
      winMessage: '**{player}** won the game! Congratulations! 🎉',
      tieMessage: 'The game tied! No one won the game.',
      timeoutMessage: 'The game timed out! No one won the game.',
      playerOnlyMessage: 'Only **{player}** and **{opponent}** can use these buttons.'
    });

    Game.startGame();
    Game.on('gameOver', result => {
      return;
    });
  }
};