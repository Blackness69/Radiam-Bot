const { TicTacToe } = require('discord-gamecord');

module.exports = {
  usage: 'r.tic-tac-toe <@opponent user>',
  name: 'tic-tac-toe',
  aliases: ['ttt'],
  description: 'Play a Tic Tac Toe game.',
  async execute({ msg, args }) {
    // Check if an opponent was mentioned
    const opponent = msg.mentions.members.first();
    if (!opponent) {
      return msg.reply('Please mention the opponent to start a Tic Tac Toe game.');
    }

    const Game = new TicTacToe({
      message: msg,
      opponent: opponent,
      embed: {
        title: 'Tic Tac Toe',
        color: '#A020F0',
        statusTitle: 'Status',
        overTitle: 'Game Over'
      },
      emojis: {
        xButton: '❌',
        oButton: '⭕',
        blankButton: '⬛'
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButttonStyle: 'DANGER',
      oButtonStyle: 'PRIMARY',
      turnMessage: '{emoji} | It\'s turn of player **{player}**',
      winMessage: '{emoji} | **{player}** won the TicTacToe Game.',
      tieMessage: 'The game tied! No one won the game.',
      timeoutMessage: 'The game went undefined! No one won the game.',
      playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
    });

    Game.startGame();
    Game.on('gameover', result => {
      return;
    })
  }
};