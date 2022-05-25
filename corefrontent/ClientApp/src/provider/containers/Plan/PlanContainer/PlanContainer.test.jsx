import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { BrowserRouter as Router } from "react-router-dom";
import PlanContainer from "./PlanContainer";

describe("PlanContainer", () => {
  test("Expect to match snapshots", () => {
    const wrapper = render(
      <Router>
        <PlanContainer />
      </Router>
    );
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("Render plan org table", () => {
    const wrapper = render(
      <Router>
        <PlanContainer />
      </Router>
    );

    const firstHeadCell = wrapper.container.querySelector(".table-head-cell");
    fireEvent.click(firstHeadCell);

    const searchBox = wrapper.container.querySelector("#plan-search-box");
    fireEvent.change(searchBox, {
      target: {
        value: "asdsa",
      },
    });
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
