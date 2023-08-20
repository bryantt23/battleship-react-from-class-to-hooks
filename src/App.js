import { Component } from 'react';
import './App.css';
import GameEngine from './components/GameEngine';
import BoardSection from './components/BoardSection';
import { renderUi, renderComputerUiCheat } from './appUtils';

class App extends Component {
  gameEngine;
  playerBoard;
  computerBoard;

  constructor() {
    super();
    this.state = {
      cheat: false,
      playerPositionsThatHaveBeenAttacked: [],
      computerPositionsThatHaveBeenAttacked: [],
      playerBoard: [],
      computerBoard: [],
      allShipsSunk: false,
      winner: null,
      isPlayerTurn: true,
      disabled: false
    };
  }

  componentDidMount() {
    this.gameEngine = new GameEngine();
    this.gameEngine.startGame();
    this.playerBoard = this.gameEngine.playerGameboard;
    this.computerBoard = this.gameEngine.computerGameboard;

    const boardSize = this.gameEngine.playerGameboard.getBoard().length;

    let arr = [];
    for (let i = 0; i < boardSize; i++) {
      arr.push(new Array(boardSize));
    }
    let arr2 = JSON.parse(JSON.stringify(arr));

    this.setState({
      playerBoard: [...this.gameEngine.playerGameboard.getBoard()],
      computerBoard: [...this.gameEngine.computerGameboard.getBoard()],
      playerPositionsThatHaveBeenAttacked: arr,
      computerPositionsThatHaveBeenAttacked: arr2
    });
  }

  computerMove() {
    const [i, j] = this.gameEngine.computer.makePlay(this.playerBoard);

    const attackedBoard = [...this.state.playerPositionsThatHaveBeenAttacked];

    if (this.playerBoard.isValidAttack(i, j, attackedBoard)) {
      this.updateBoardSectionState(i, j, 'playerBoard');
    } else {
      console.log('invalid computer move');
      this.computerMove();
    }
  }

  updateBoardSectionState = (i, j, board) => {
    let attackedProperty;
    if (board === 'playerBoard') {
      attackedProperty = 'playerPositionsThatHaveBeenAttacked';
    } else {
      attackedProperty = 'computerPositionsThatHaveBeenAttacked';
    }

    const attackedBoard = this.state[attackedProperty];

    if (this[board].isValidAttack(i, j, attackedBoard)) {
      console.log('valid move');
      const boardState = this.state[board];
      const [updatedBoardState, updatedAttackBoard] = this[board].receiveAttack(
        i,
        j,
        boardState,
        attackedBoard
      );

      //use this & board to determine winner

      console.log('all sunk', this[board].allShipsSunk());
      const allShipsSunk = this[board].allShipsSunk();
      if (allShipsSunk) {
        let winner;
        if (board === 'playerBoard') {
          winner = 'Computer wins!';
        } else {
          winner = 'Player wins!';
        }
        this.setState({
          allShipsSunk: true,
          winner: winner,
          disabled: true
        });
        return;
      }

      this.setState(
        {
          [attackedProperty]: updatedAttackBoard,
          [board]: updatedBoardState,
          isPlayerTurn: !this.state.isPlayerTurn
        },
        () => {
          if (!this.state.isPlayerTurn) this.computerMove();
        }
      );
    } else {
      console.log('invalid move');
    }
  };

  render() {
    const playerBoardUi = renderUi(
      'player',
      this.state.playerBoard,
      this.state.playerPositionsThatHaveBeenAttacked
    );
    const computerBoardUi = renderUi(
      'computer',
      this.state.computerBoard,
      this.state.computerPositionsThatHaveBeenAttacked,
      this.updateBoardSectionState
    );

    const computerBoardUiCheat = renderComputerUiCheat(
      this.state.computerBoard
    );

    return (
      <div className='App'>
        <h1>Battleship</h1>
        <div disabled={this.state.winner !== null} id='gameboard'>
          <h3>Player Board</h3>
          {playerBoardUi}
          <h3>Computer Board</h3>
          {computerBoardUi}
          <br />
        </div>
        {this.state.disabled ? <h2>{this.state.winner}</h2> : ''}
        <button
          onClick={() => {
            this.setState({ cheat: !this.state.cheat });
          }}
        >
          {this.state.cheat ? 'Hide ' : 'Show '} computer's ships{' '}
        </button>
        {this.state.cheat && computerBoardUiCheat}
      </div>
    );
  }
}

export default App;
