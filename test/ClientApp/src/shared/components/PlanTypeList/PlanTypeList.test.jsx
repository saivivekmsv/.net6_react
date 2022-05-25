import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PlanTypeList from "./PlanTypeList";

describe("PlanTypeList", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <PlanTypeList {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
