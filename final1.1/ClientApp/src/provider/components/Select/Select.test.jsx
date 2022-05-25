import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Select from "./Select";

describe("Select", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <Select {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
