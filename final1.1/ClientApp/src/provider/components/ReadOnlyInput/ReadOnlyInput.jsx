import React from "react";

const ReadOnlyInput = ({ label, dataList = [] }) => {
  return (
    <div>
      <label className="label-text">{label}</label>
      <ul className="form-control-read-only">
        {dataList.map(({ label }, i) => (
          <li key={i}>{label}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReadOnlyInput;
