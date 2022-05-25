import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Dropside from "./Dropside";

describe("Dropside", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <Dropside {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
