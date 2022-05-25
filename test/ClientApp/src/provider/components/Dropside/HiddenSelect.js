import { selectStyle } from "./style";
import React from "react";

export default function HiddenSelect(props) {
  const { options = [], value } = props;

  const optionsUI = options.map((option) => {
    const { value, label } = option;
    return (
      <option key={value} value={value}>
        {label}
      </option>
    );
  });

  return (
    <select style={selectStyle} value={value}>
      <option value="">------select-----</option>
      {optionsUI}
    </select>
  );
}
