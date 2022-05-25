import React from "react";

const ProgressBar = (props) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: 10,
    width: '65%',
    backgroundColor: "#fff",
    borderRadius: 50,
    border: '1px solid #BDBDBD',
    margin: '7px',
    padding: '1px'
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  const fontStyle = {
      fontSize: '10px',
      fontWeight: 500,
      color: '#000',
      marginTop: '5px'
  }

  return (
    <div className="d-flex justify-content-end">
    <div style={containerStyles} >
      <div style={fillerStyles} >
        <div style={labelStyles}></div>
      </div>
    </div>
    <div style={fontStyle}> {`${completed}%`} Processed</div>
    </div>
  );
};

export default ProgressBar;