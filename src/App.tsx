import React, { useState, useEffect } from "react";
import { NumberDisplay } from "./components/NumberDisplay";
import { Buttons } from "./components/Button";
import {
  generateCells,
  openAdjacentCells,
  MAX_ROWS,
  MAX_COLS,
} from "./components/BuildGameBoard";
import { Face, Cell, CellState, CellValue } from "./types";
import "./styles/App.scss";

const initialState = {
  cells: generateCells(),
  face: Face.smile,
  time: 0,
  live: false,
  mineCounter: 10,
  hasLost: false,
  hasWon: false,
};

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(initialState.cells);
  const [face, setFace] = useState<Face>(initialState.face);
  const [time, setTime] = useState<number>(initialState.time);
  const [live, setLive] = useState<boolean>(initialState.live);
  const [mineCounter, setMineCounter] = useState<number>(
    initialState.mineCounter
  );
  const [hasLost, setHasLost] = useState<boolean>(initialState.hasLost);
  const [hasWon, setHasWon] = useState<boolean>(initialState.hasWon);

  // FACE CHANGE ON CLICK
  useEffect(() => {
    const handleMouseDown = () => {
      setFace(Face.oh);
    };
    const handleMouseUp = () => {
      setFace(Face.smile);
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // TIMER
  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  // LOST/WON GAME
  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.lost);
    }
    if (hasWon) {
      setLive(false);
      setFace(Face.win);
    }
  }, [hasLost, hasWon]);

  // CLICKING CELLS ON GAME BOARD
  const handleCellClick = (row: number, col: number) => (): void => {
    if (!live) setLive(true);
    const currentCell = cells[row][col];
    let newCells = cells.slice();

    if (
      currentCell.state == CellState.flagged ||
      currentCell.state == CellState.visible
    ) {
      return;
    }
    if (currentCell.value == CellValue.bomb) {
      setHasLost(true);
      newCells[row][col].red = true;
      newCells = showAllMines();
      setCells(newCells);
      return;
    } else if (currentCell.value == CellValue.none) {
      newCells = openAdjacentCells(newCells, row, col);
    } else {
      newCells[row][col].state = CellState.visible;
      setCells(newCells);
    }
    let openCellsExist = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];
        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state == CellState.open
        ) {
          openCellsExist = true;
          break;
        }
      }
    }
    if (!openCellsExist) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value == CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setHasWon(true);
    }

    setCells(newCells);
  };

  // FLAGGING CELLS
  const handleCellContext = (row: number, col: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    const currentCells = cells.slice();
    const currentCell = cells[row][col];
    if (currentCell.state == CellState.visible) {
      return;
    } else if (currentCell.state == CellState.open && mineCounter > 0) {
      currentCells[row][col].state = CellState.flagged;
      setCells(currentCells);
      setMineCounter(mineCounter - 1);
    } else if (currentCell.state == CellState.flagged) {
      currentCells[row][col].state = CellState.open;
      setCells(currentCells);
      setMineCounter(mineCounter + 1);
    }
  };

  // RESETTING GAME BY CLICKING ON FACE ICON
  const handleFaceClick = (): void => {
    setLive(false);
    setTime(initialState.time);
    setCells(initialState.cells);
    setHasLost(false);
    setHasWon(false);
    setMineCounter(initialState.mineCounter);
  };

  // RENDER GAME BOARD
  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Buttons
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          red={cell.red}
          col={colIndex}
          onClick={handleCellClick}
          onContext={handleCellContext}
        />
      ))
    );
  };

  // SHOW MINES IF GAME OVER
  const showAllMines = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value == CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }
        return cell;
      })
    );
  };

  return (
    <div className="app">
      <div className="header">
        <NumberDisplay value={mineCounter} />
        <div className="face" onClick={handleFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="body">{renderCells()}</div>
    </div>
  );
};

export default App;
