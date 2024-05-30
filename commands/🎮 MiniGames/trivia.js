const{ Trivia } = require('discord-gamecord');

module.exports = {
  usage: 'trivia',
  name: 'trivia',
  description: 'Play a trivia game.',
  async execute({msg}) {
    const Game = new Trivia({
      message: msg,
      isSlashGame: false,
      embed: {
        title: 'Trivia',
        color: '#A020F0',
        description: 'You have 60 seconds to guess the answer.'
      },
      timeoutTime: 60000,
      buttonStyle: 'PRIMARY',
      trueButtonStyle: 'SUCCESS',
      falseButtonStyle: 'DANGER',
      mode: 'multiple', //multiple/single
      difficulty: 'medium',
      winMessage: 'You won! The correct answer is {answer}',
      loseMessage: 'You lost! The correct answrr is {answer}',
      errMessage: 'Unable to fetch questions.',
      playerOnlyMessage: 'Only {player} can use these buttons.'
      
    });

    Game.startGame();
    Game.on('gameOver', result => {
      return;
    });
  }
}