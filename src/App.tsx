import React, { useState, useEffect } from "react";
import { NumberDisplay } from "./components/NumberDisplay";
import { Buttons } from "./components/Button";
import { generateCells } from "./components/BuildGameBoard";
import { Face, Cell, CellState } from "./types";
import "./styles/App.scss";

// Episode 3: 41:20

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [mineCounter, setMineCounter] = useState<number>(10);

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

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (!live) {
      setLive(true);
    }
  };

  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];
    if (currentCell.state == CellState.visible) {
      return;
    } else if (currentCell.state == CellState.open && mineCounter > 0) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setMineCounter(mineCounter - 1);
    } else if (currentCell.state == CellState.flagged) {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setMineCounter(mineCounter + 1);
    }
  };

  const handleFaceClick = (): void => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Buttons
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
          onClick={handleCellClick}
          onContext={handleCellContext}
        />
      ))
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
