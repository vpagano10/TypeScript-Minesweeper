import { CellValue, CellState, Cell } from "../types";

// GAME VARIABLES
const MAX_ROWS: number = 9;
const MAX_COLS: number = 9;
const NUM_MINES: number = 10;

export const generateCells = (): Cell[][] => {
  // BUILD BOARD
  let cells: Cell[][] = [];
  for (let rows = 0; rows < MAX_ROWS; rows++) {
    cells.push([]);
    for (let cols = 0; cols < MAX_COLS; cols++) {
      cells[rows].push({
        value: CellValue.none,
        state: CellState.open,
        // state: CellState.visible,
      });
    }
  }

  // PLACE MINES
  let minesPlaced = 0;
  while (minesPlaced < NUM_MINES) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);
    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowindex) =>
        row.map((cell, colindex) => {
          if (randomRow == rowindex && randomCol == colindex) {
            return {
              ...cell,
              value: CellValue.bomb,
            };
          }
          return cell;
        })
      );
      minesPlaced++;
    }
  }

  // CALCULATE NUMBERS IN CELLS
  for (let rIndex = 0; rIndex < MAX_ROWS; rIndex++) {
    for (let cIndex = 0; cIndex < MAX_COLS; cIndex++) {
      const currentCell = cells[rIndex][cIndex];
      if (currentCell.value == CellValue.bomb) {
        continue;
      }
      let numBombs = 0;
      const NW =
        rIndex > 0 && cIndex > 0 ? cells[rIndex - 1][cIndex - 1] : null;
      const N = rIndex > 0 ? cells[rIndex - 1][cIndex] : null;
      const NE =
        rIndex > 0 && cIndex < MAX_COLS - 1
          ? cells[rIndex - 1][cIndex + 1]
          : null;
      const W = cIndex > 0 ? cells[rIndex][cIndex - 1] : null;
      const E = cIndex < MAX_COLS - 1 ? cells[rIndex][cIndex + 1] : null;
      const SW =
        rIndex < MAX_ROWS - 1 && cIndex > 0
          ? cells[rIndex + 1][cIndex - 1]
          : null;
      const S = rIndex < MAX_ROWS - 1 ? cells[rIndex + 1][cIndex] : null;
      const SE =
        rIndex < MAX_ROWS - 1 && cIndex < MAX_COLS - 1
          ? cells[rIndex + 1][cIndex + 1]
          : null;

      if (NW && NW.value == CellValue.bomb) {
        numBombs++;
      }
      if (N && N.value == CellValue.bomb) {
        numBombs++;
      }
      if (NE && NE.value == CellValue.bomb) {
        numBombs++;
      }
      if (W && W.value == CellValue.bomb) {
        numBombs++;
      }
      if (E && E.value == CellValue.bomb) {
        numBombs++;
      }
      if (SW && SW.value == CellValue.bomb) {
        numBombs++;
      }
      if (S && S.value == CellValue.bomb) {
        numBombs++;
      }
      if (SE && SE.value == CellValue.bomb) {
        numBombs++;
      }

      if (numBombs > 0) {
        cells[rIndex][cIndex] = {
          ...currentCell,
          value: numBombs,
        };
      }
    }
  }

  return cells;
};