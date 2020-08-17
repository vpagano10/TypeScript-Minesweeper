import React, { useState } from "react";
import { NumberDisplay } from "./components/NumberDisplay";
import { CellValue, CellState, Cell } from "./types";
import { Buttons } from "./components/Button";
import "./styles/App.scss";

// BUILD GAME BOARD
const MAX_ROWS: number = 9;
const MAX_COLS: number = 9;
const generateCells = (): Cell[][] => {
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
  return cells;
};

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => <Buttons key={`${rowIndex}-${colIndex}`} />)
    );
  };

  console.log(cells);
  return (
    <div className="app">
      <div className="header">
        <NumberDisplay value={0} />
        <div className="face">
          <span role="img" aria-label="face">
            😀
          </span>
        </div>
        <NumberDisplay value={23} />
      </div>
      <div className="body">{renderCells()}</div>
    </div>
  );
};

export default App;
