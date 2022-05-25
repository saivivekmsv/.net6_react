import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import HeaderPopover from "./HeaderPopover";

describe("HeaderPopover", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <HeaderPopover />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
