import React, { useState, useEffect } from 'react';
import './App.css';
import GameEngine from './components/GameEngine';
import { renderUi, renderComputerUiCheat, computerMove } from './appUtils';

const App = () => {
  const [cheat, setCheat] = useState(true);
  const [
    playerPositionsThatHaveBeenAttacked,
    setPlayerPositionsThatHaveBeenAttacked
  ] = useState([]);
  const [
    computerPositionsThatHaveBeenAttacked,
    setComputerPositionsThatHaveBeenAttacked
  ] = useState([]);
  const [playerBoard, setPlayerBoard] = useState([]);
  const [computerBoard, setComputerBoard] = useState([]);
  const [allShipsSunk, setAllShipsSunk] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [gameEnginePlayerBoard, setGameEnginePlayerBoard] = useState(null);
  const [gameEngineComputerBoard, setGameEngineComputerBoard] = useState(null);

  useEffect(() => {
    const gameEngine = new GameEngine();
    gameEngine.startGame();
    const gameEnginePlayerBoard = gameEngine.playerGameboard;
    const gameEngineComputerBoard = gameEngine.computerGameboard;

    const boardSize = gameEnginePlayerBoard.getBoard().length;

    let arr = [];
    for (let i = 0; i < boardSize; i++) {
      arr.push(new Array(boardSize));
    }
    let arr2 = JSON.parse(JSON.stringify(arr));

    setPlayerBoard([...gameEnginePlayerBoard.getBoard()]);
    setComputerBoard([...gameEngineComputerBoard.getBoard()]);
    setPlayerPositionsThatHaveBeenAttacked(arr);
    setComputerPositionsThatHaveBeenAttacked(arr2);
    setGameEngine(gameEngine);
    setGameEnginePlayerBoard(gameEnginePlayerBoard);
    setGameEngineComputerBoard(gameEngineComputerBoard);
  }, []);

  useEffect(() => {
    if (!isPlayerTurn) {
      computerMove(
        gameEngine,
        gameEnginePlayerBoard,
        playerPositionsThatHaveBeenAttacked,
        updateBoardSectionState
      );
    }
  }, [isPlayerTurn]);

  const updateBoardSectionState = (i, j, board) => {
    const boardClass =
      board === 'playerBoard' ? gameEnginePlayerBoard : gameEngineComputerBoard;
    const attackedBoard =
      board === 'playerBoard'
        ? playerPositionsThatHaveBeenAttacked
        : computerPositionsThatHaveBeenAttacked;

    if (boardClass.isValidAttack(i, j, attackedBoard)) {
      const boardState = board === 'playerBoard' ? playerBoard : computerBoard;
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
        setAllShipsSunk(true);
        setWinner(winner);
        setDisabled(true);
        return;
      }

      if (board === 'playerBoard') {
        setPlayerBoard(updatedBoardState);
        setPlayerPositionsThatHaveBeenAttacked(updatedAttackBoard);
      } else {
        setComputerBoard(updatedBoardState);
        setComputerPositionsThatHaveBeenAttacked(updatedAttackBoard);
      }

      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const playerBoardUi = renderUi(
    'player',
    playerBoard,
    playerPositionsThatHaveBeenAttacked
  );
  const computerBoardUi = renderUi(
    'computer',
    computerBoard,
    computerPositionsThatHaveBeenAttacked,
    updateBoardSectionState
  );

  const computerBoardUiCheat = renderComputerUiCheat(computerBoard);

  return (
    <div className='App'>
      <h1>Battleship</h1>
      <div disabled={winner !== null} id='gameboard'>
        <h3>Player Board</h3>
        {playerBoardUi}
        <h3>Computer Board</h3>
        {computerBoardUi}
      </div>
      {disabled ? <h2>{winner}</h2> : ''}
      <button
        onClick={() => {
          setCheat(!cheat);
        }}
      >
        {cheat ? 'Hide ' : 'Show '} computer's ships
      </button>
      {cheat && computerBoardUiCheat}
    </div>
  );
};

export default App;
