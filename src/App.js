import { Component } from 'react';
import './App.css';
import GameEngine from './components/GameEngine';
import { renderUi, renderComputerUiCheat, computerMove } from './appUtils';

class App extends Component {
  constructor() {
    super();
    this.state = {
      cheat: true,
      playerPositionsThatHaveBeenAttacked: [],
      computerPositionsThatHaveBeenAttacked: [],
      playerBoard: [],
      computerBoard: [],
      allShipsSunk: false,
      winner: null,
      isPlayerTurn: true,
      disabled: false,
      gameEngineClass: null,
      playerBoardClass: null,
      computerBoardClass: null
    };
  }

  componentDidMount() {
    const gameEngineClass = new GameEngine();
    gameEngineClass.startGame();
    const playerBoardClass = gameEngineClass.playerGameboard;
    const computerBoardClass = gameEngineClass.computerGameboard;

    const boardSize = playerBoardClass.getBoard().length;

    let arr = [];
    for (let i = 0; i < boardSize; i++) {
      arr.push(new Array(boardSize));
    }
    let arr2 = JSON.parse(JSON.stringify(arr));

    this.setState({
      playerBoard: [...playerBoardClass.getBoard()],
      computerBoard: [...computerBoardClass.getBoard()],
      playerPositionsThatHaveBeenAttacked: arr,
      computerPositionsThatHaveBeenAttacked: arr2,
      gameEngineClass,
      playerBoardClass,
      computerBoardClass
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isPlayerTurn === true && this.state.isPlayerTurn === false) {
      computerMove(
        this.state.gameEngineClass,
        this.state.playerBoardClass,
        this.state.playerPositionsThatHaveBeenAttacked,
        this.updateBoardSectionState
      );
    }
  }

  updateBoardSectionState = (i, j, board) => {
    const boardClass = this.state[board + 'Class'];
    let attackedProperty =
      board === 'playerBoard'
        ? 'playerPositionsThatHaveBeenAttacked'
        : 'computerPositionsThatHaveBeenAttacked';
    const attackedBoard = this.state[attackedProperty];

    if (boardClass.isValidAttack(i, j, attackedBoard)) {
      const boardState = this.state[board];
      const [updatedBoardState, updatedAttackBoard] = boardClass.receiveAttack(
        i,
        j,
        boardState,
        attackedBoard
      );

      const allShipsSunk = boardClass.allShipsSunk();
      if (allShipsSunk) {
        let winner =
          board === 'playerBoard' ? 'Computer wins!' : 'Player wins!';
        this.setState({
          allShipsSunk: true,
          winner: winner,
          disabled: true
        });
        return;
      }

      this.setState({
        [attackedProperty]: updatedAttackBoard,
        [board]: updatedBoardState,
        isPlayerTurn: !this.state.isPlayerTurn
      });
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
