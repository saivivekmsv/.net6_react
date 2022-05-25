import React from "react";
import { useHistory } from "react-router-dom";
const Error = () => {
  const history = useHistory();
  return (
    <div className="div-under-construction">
      <img src="/assets/error 404.png" alt="warning." />
      <div>
        <h1 className="header-under-construction1">
          <span>Something is Wrong</span>
        </h1>
        <h2 className="header-under-construction2">
          <span>
            The page you are looking for might have been renamed,removed or
            might never exist.
          </span>
        </h2>
        <button
          class="button-under-construction"
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

export default Error;
