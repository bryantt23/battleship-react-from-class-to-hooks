import React, { Component } from 'react';

export function BoardSection(props) {
  ///maybe deal with it differently based on player or computer board
  const { attacked, status, isComputer } = props;
  let message, color;
  if (status === undefined || (!attacked && isComputer)) {
    message = 'SEA';
    color = 'blue';
  } else if (typeof status === 'object') {
    message = 'SHIP';
    color = 'grey';
  } else {
    message = status; //should be a string
    if (status === 'HIT') {
      color = 'red';
    } else {
      color = 'green';
    }
  }

  // console.log(message);
  return (
    <td
      disabled={attacked}
      style={{
        height: 50,
        width: 50,
        display: 'inlineBlock',
        backgroundColor: color
      }}
      onClick={() => {
        // https:stackoverflow.com/questions/51549115/best-way-to-disabled-div-onclick-in-react
        !attacked && props.updateBoardSectionState();
      }}
    >
      {message}
    </td>
  );
}

export default BoardSection;
