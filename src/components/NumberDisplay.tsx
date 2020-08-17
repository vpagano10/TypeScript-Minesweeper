import React from "react";
import "../styles/NumberDisplay.scss";

interface NumberDisplayProps {
  value: number;
}

export const NumberDisplay: React.FC<NumberDisplayProps> = ({ value }) => {
  return (
    <div className="numberDisplay">{value.toString().padStart(3, "0")}</div>
  );
};
