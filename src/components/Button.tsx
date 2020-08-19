import React from "react";
import "../styles/Button.scss";
import { CellState, CellValue } from "../types";

interface ButtonsProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  red?: boolean;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

export const Buttons: React.FC<ButtonsProps> = ({
  row,
  col,
  state,
  value,
  red,
  onClick,
  onContext,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state == CellState.visible) {
      if (value == CellValue.bomb) {
        return (
          <span role="img" aria-label="bomb">
            💣
          </span>
        );
      } else if (value == CellValue.none) {
        return null;
      }
      return value;
    } else if (state == CellState.flagged) {
      return (
        <span role="img" aria-label="bomb">
          🚩
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`button ${
        state == CellState.visible ? "visible" : ""
      } value-${value} ${red ? "red" : null}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </div>
  );
};
