import BoardSection from './components/BoardSection';

export const renderPlayerUi = (
  playerBoard,
  playerPositionsThatHaveBeenAttacked
) => {
  const dom = [];
  let length = playerBoard.length;
  for (let i = 0; i < length; i++) {
    let arr = [];
    for (let j = 0; j < length; j++) {
      arr.push(
        //attacked, not attacked
        //attacked can be hit or miss
        //not attacked will just be the ship or sea
        <BoardSection
          attacked={playerPositionsThatHaveBeenAttacked[i][j]}
          status={playerBoard[i][j]}
          updateBoardSectionState={() => {}}
        />
      );
    }
    const div = <tr>{arr}</tr>;
    dom.push(div);
  }
  console.log(dom);
  return dom;
};

//basically same function as renderPlayerUi
export const renderComputerUi = (
  computerBoard,
  computerPositionsThatHaveBeenAttacked,
  updateBoardSectionStateFunc
) => {
  const dom = [];
  let length = computerBoard.length;
  for (let i = 0; i < length; i++) {
    let arr = [];
    for (let j = 0; j < length; j++) {
      arr.push(
        <BoardSection
          isComputer={true}
          attacked={computerPositionsThatHaveBeenAttacked[i][j]}
          status={computerBoard[i][j]}
          updateBoardSectionState={() => {
            updateBoardSectionStateFunc(i, j, 'computerBoard');
          }}
        />
      );
    }
    const div = <tr>{arr}</tr>;
    dom.push(div);
  }
  return dom;
};
