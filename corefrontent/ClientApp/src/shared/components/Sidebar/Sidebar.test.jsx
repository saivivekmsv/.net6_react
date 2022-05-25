import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <Sidebar {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
