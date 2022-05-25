import React from "react";
import { useHistory } from "react-router-dom";

const UnderConstruction = () => {
  const history = useHistory();
  return (
    <div className="div-under-construction">
      <img src="/assets/under construction 5.png" alt="warning." />
      <div>
        <h1 className="header-under-construction1">
          <span>We are working on something awesome</span>
        </h1>
        <h2 className="header-under-construction2">
          <span>Will be back soon</span>
        </h2>
        <button
          className="button-under-construction"
          type="button"
          onClick={() => {
            history.push("/");
          }}
        >
          Go back home
        </button>
      </div>
    </div>
  );
};

export default UnderConstruction;
