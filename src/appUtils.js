import BoardSection from './components/BoardSection';

export const renderUi = (
  role,
  board,
  positionsThatHaveBeenAttacked,
  updateBoardSectionStateFunc
) => {
  const dom = [];
  let length = board.length;
  for (let i = 0; i < length; i++) {
    let arr = [];
    for (let j = 0; j < length; j++) {
      arr.push(
        //attacked, not attacked
        //attacked can be hit or miss
        //not attacked will just be the ship or sea
        <BoardSection
          isComputer={role === 'computer'}
          attacked={positionsThatHaveBeenAttacked[i][j]}
          status={board[i][j]}
          updateBoardSectionState={() => {
            if (role === 'computer') {
              updateBoardSectionStateFunc(i, j, 'computerBoard');
            }
          }}
        />
      );
    }
    const div = <tr>{arr}</tr>;
    dom.push(div);
  }
  console.log(dom);
  return dom;
};

export const renderComputerUiCheat = computerBoard => {
  const dom = [];
  let length = computerBoard.length;
  for (let i = 0; i < length; i++) {
    let arr = [];
    for (let j = 0; j < length; j++) {
      arr.push(
        <BoardSection
          status={computerBoard[i][j]}
          updateBoardSectionState={() => {}}
        />
      );
    }
    const div = <tr>{arr}</tr>;
    dom.push(div);
  }
  return dom;
};

export const computerMove = (
  gameEngine,
  playerBoard,
  attackedBoard,
  updateBoardSectionStateCallback
) => {
  const [i, j] = gameEngine.computer.makePlay(playerBoard);

  if (playerBoard.isValidAttack(i, j, attackedBoard)) {
    updateBoardSectionStateCallback(i, j, 'playerBoard');
  } else {
    console.log('invalid computer move');
    computerMove(
      gameEngine,
      playerBoard,
      attackedBoard,
      updateBoardSectionStateCallback
    );
  }
};
