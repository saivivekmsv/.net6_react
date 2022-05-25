import React from "react";

const SelectableTiles = ({ name, className, onClick, value }) => {
  return (
        <div className={`${className} d-flex justify-content-between mt-10`} onClick={onClick}>
            <div>{name}</div> 
            <div>{value}</div>
        </div>
  );
};

export default SelectableTiles;
