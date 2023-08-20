import React, { useState, useEffect } from 'react';
import './App.css';
import GameEngine from './components/GameEngine';
import { renderUi, renderComputerUiCheat, computerMove } from './appUtils';

const App = () => {
  const [state, setState] = useState({
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
  });

  useEffect(() => {
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

    setState(prevState => ({
      ...prevState,
      playerBoard: [...playerBoardClass.getBoard()],
      computerBoard: [...computerBoardClass.getBoard()],
      playerPositionsThatHaveBeenAttacked: arr,
      computerPositionsThatHaveBeenAttacked: arr2,
      gameEngineClass,
      playerBoardClass,
      computerBoardClass
    }));
  }, []);

  useEffect(() => {
    if (!state.isPlayerTurn) {
      computerMove(
        state.gameEngineClass,
        state.playerBoardClass,
        state.playerPositionsThatHaveBeenAttacked,
        updateBoardSectionState
      );
    }
  }, [state.isPlayerTurn]);

  const updateBoardSectionState = (i, j, board) => {
    const boardClass = state[board + 'Class'];
    let attackedProperty =
      board === 'playerBoard'
        ? 'playerPositionsThatHaveBeenAttacked'
        : 'computerPositionsThatHaveBeenAttacked';
    const attackedBoard = state[attackedProperty];

    if (boardClass.isValidAttack(i, j, attackedBoard)) {
      const boardState = state[board];
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
        setState({
          ...state,
          allShipsSunk: true,
          winner,
          disabled: true
        });
        return;
      }

      setState({
        ...state,
        [attackedProperty]: updatedAttackBoard,
        [board]: updatedBoardState,
        isPlayerTurn: !state.isPlayerTurn
      });
    }
  };

  const playerBoardUi = renderUi(
    'player',
    state.playerBoard,
    state.playerPositionsThatHaveBeenAttacked
  );
  const computerBoardUi = renderUi(
    'computer',
    state.computerBoard,
    state.computerPositionsThatHaveBeenAttacked,
    updateBoardSectionState
  );

  const computerBoardUiCheat = renderComputerUiCheat(state.computerBoard);

  return (
    <div className='App'>
      <h1>Battleship</h1>
      <div disabled={state.winner !== null} id='gameboard'>
        <h3>Player Board</h3>
        {playerBoardUi}
        <h3>Computer Board</h3>
        {computerBoardUi}
      </div>
      {state.disabled ? <h2>{state.winner}</h2> : ''}
      <button
        onClick={() => {
          setState({ ...state, cheat: !state.cheat });
        }}
      >
        {state.cheat ? 'Hide ' : 'Show '} computer's ships{' '}
      </button>
      {state.cheat && computerBoardUiCheat}
    </div>
  );
};

export default App;
