import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

//Note for later: 
  /*
    - chanceLightStartsOn/2 because if 0.5 is passed in as the float then all cells will be lit (t). Reason being is because:
        Math.floor():
          - If greater than 0.5 will round to 1.
        So to handle chanceLightsStartsOn we must divide by 2
  */
function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = null }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // TODO: create array-of-arrays of true/false values
    for(let i = 0; i < nrows; i++) {
      const row = [];
      initialBoard.push(row)
        for(let j = 0; j < ncols; j++) {
          //If chanceLight is null then the 0.4 at least makes the game winnable sometimes!
          const litOrUnlitRandomizer = Math.random() > 0.4; // Random boolean value
          //Instead of the previous complicated way I had chatGPT used another way to handle %chance of light squares. Will be light if number < chance.
          const litOrUnlit =
            chanceLightStartsOn === null ? litOrUnlitRandomizer : Math.random() < chanceLightStartsOn;
          initialBoard[i].push(litOrUnlit);
      }

    }
    return initialBoard;
  };

  //Here I think I'll use map to map over the arrays in initialBoard.
      // - Then filter through each individual array in the mapped element to see any index values equal 't'. If not then we can hide the HTML board and return the text "YOU WIN!".
  function hasWon() {
        // Check the board in state to determine whether the player has won.
        const noTInRows = board.every(row => !row.includes(true));
      
        // Return true if the winning condition is met
        return noTInRows;
      }
      

  // For a tad second I got confused on this one because I didn't read that this is a function you pass INTO Cell.js component. 
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
        /*
          We just need to copy the data from our current board. 
            -Current board is stored in 'board' state
        */
       const deepCopyOfOldBoard = oldBoard.map(row => row.slice());

      // TODO: in the copy, flip this cell and the cells around it

      flipCell(y,x, deepCopyOfOldBoard);

          // Flip adjacent cells (top, bottom, left, right) chatGPT helped for this part because I missed key detail to implement this portion. 
      flipCell(y - 1, x, deepCopyOfOldBoard); // Top cell
      flipCell(y + 1, x, deepCopyOfOldBoard); // Bottom cell
      flipCell(y, x - 1, deepCopyOfOldBoard); // Left cell
      flipCell(y, x + 1, deepCopyOfOldBoard); // Right cell

      // TODO: return the copy

      return deepCopyOfOldBoard;
    });
  };

  // if the game is won, just show a winning msg & render nothing else
  // TODO
    
  // make table board

  // TODO

  //Used chatGPT for the part below. I was extremely confused on how to render the HTML for this game:

  const renderBoard = () => {

    if (hasWon()) {
      return <div>YOU WIN!</div>; // Show win message if the game is won
    }

    return (
      <table>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <Cell
                  key={`${rowIndex}-${columnIndex}`}
                  isLit={cell}
                  flipCellsAroundMe={() => flipCellsAround(`${rowIndex}-${columnIndex}`)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return <div>{renderBoard()}</div>;
}

export default Board;
