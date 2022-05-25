import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SideBarContent from "./SideBarContent";

describe("SideBarContent", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <SideBarContent {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
