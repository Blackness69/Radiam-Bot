const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
  name: 'rock-paper-siccors',
  aliases: ['rps'],
  description: 'Play a Rock Paper Scissors game with your friend.',
  async execute({msg}) {
    const opponentUser = msg.mentions.members.first();
    if (!opponentUser) return msg.reply('Please provide a opponent to play with.');

    const Game = new RockPaperScissors({
      message: msg,
      isSlashGame: true,
      opponent: opponentUser,
      embed: {
        titpe: 'Rock Paper Scissors',
        color: '#A020F0',
        description: 'Press a buttom to make choice.'
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
      pickMessage: 'You choose {emoji}',
      winMessage: '**{player}** won the Game! Congratulations! 🎉',
      tieMessage: 'The Game tied! No one won the Game.',
      timeoutMessage: 'The game went undefined! No one won the game.',
      playerOnlyMessage: 'Only **${player}** and **${opponent}** can use these buttons.'
    });

    Game.startGame();
    Game.opponent('gameOver', result => {
      return;
    })
  }
}