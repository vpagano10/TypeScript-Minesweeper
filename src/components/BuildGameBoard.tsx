import { CellValue, CellState, Cell } from "../types";

// GAME VARIABLES
export const MAX_ROWS: number = 9;
export const MAX_COLS: number = 9;
export const NUM_MINES: number = 10;

const grabAllAdjacentCells = (
  cells: Cell[][],
  row: number,
  col: number
): {
  NW: Cell | null;
  N: Cell | null;
  NE: Cell | null;
  W: Cell | null;
  E: Cell | null;
  SW: Cell | null;
  S: Cell | null;
  SE: Cell | null;
} => {
  const NW = row > 0 && col > 0 ? cells[row - 1][col - 1] : null;
  const N = row > 0 ? cells[row - 1][col] : null;
  const NE = row > 0 && col < MAX_COLS - 1 ? cells[row - 1][col + 1] : null;
  const W = col > 0 ? cells[row][col - 1] : null;
  const E = col < MAX_COLS - 1 ? cells[row][col + 1] : null;
  const SW = row < MAX_ROWS - 1 && col > 0 ? cells[row + 1][col - 1] : null;
  const S = row < MAX_ROWS - 1 ? cells[row + 1][col] : null;
  const SE =
    row < MAX_ROWS - 1 && col < MAX_COLS - 1 ? cells[row + 1][col + 1] : null;

  return {
    NW,
    N,
    NE,
    W,
    E,
    SW,
    S,
    SE,
  };
};

export const generateCells = (): Cell[][] => {
  // BUILD BOARD
  let cells: Cell[][] = [];
  for (let rows = 0; rows < MAX_ROWS; rows++) {
    cells.push([]);
    for (let cols = 0; cols < MAX_COLS; cols++) {
      cells[rows].push({
        value: CellValue.none,
        state: CellState.open,
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
  for (let row = 0; row < MAX_ROWS; row++) {
    for (let col = 0; col < MAX_COLS; col++) {
      const currentCell = cells[row][col];
      if (currentCell.value == CellValue.bomb) {
        continue;
      }
      let numBombs = 0;
      const { NW, N, NE, W, E, SW, S, SE } = grabAllAdjacentCells(
        cells,
        row,
        col
      );

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
        cells[row][col] = {
          ...currentCell,
          value: numBombs,
        };
      }
    }
  }
  return cells;
};

export const openAdjacentCells = (
  cells: Cell[][],
  row: number,
  col: number
): Cell[][] => {
  let newCells = cells.slice();
  const currentCell = cells[row][col];
  newCells[row][col].state = CellState.visible;
  const { NW, N, NE, W, E, SW, S, SE } = grabAllAdjacentCells(cells, row, col);

  if (NW?.state == CellState.open && NW.value !== CellValue.bomb) {
    if (NW.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row - 1, col - 1);
    } else {
      newCells[row - 1][col - 1].state = CellState.visible;
    }
  }
  if (N?.state == CellState.open && N.value !== CellValue.bomb) {
    if (N.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row - 1, col);
    } else {
      newCells[row - 1][col].state = CellState.visible;
    }
  }
  if (NE?.state == CellState.open && NE.value !== CellValue.bomb) {
    if (NE.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row - 1, col + 1);
    } else {
      newCells[row - 1][col + 1].state = CellState.visible;
    }
  }
  if (W?.state == CellState.open && W.value !== CellValue.bomb) {
    if (W.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row, col - 1);
    } else {
      newCells[row][col - 1].state = CellState.visible;
    }
  }
  if (E?.state == CellState.open && E.value !== CellValue.bomb) {
    if (E.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row, col + 1);
    } else {
      newCells[row][col + 1].state = CellState.visible;
    }
  }
  if (SW?.state == CellState.open && SW.value !== CellValue.bomb) {
    if (SW.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row + 1, col - 1);
    } else {
      newCells[row - 1][col - 1].state = CellState.visible;
    }
  }
  if (S?.state == CellState.open && S.value !== CellValue.bomb) {
    if (S.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row + 1, col);
    } else {
      newCells[row - 1][col].state = CellState.visible;
    }
  }
  if (SE?.state == CellState.open && SE.value !== CellValue.bomb) {
    if (SE.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row + 1, col + 1);
    } else {
      newCells[row + 1][col + 1].state = CellState.visible;
    }
  }

  return newCells;
};
