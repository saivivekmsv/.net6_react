import React from "react";
import { render } from "@testing-library/react";

import { BrowserRouter as Router } from "react-router-dom";
import CreatePlanContainer from "./CreatePlanContainer";

describe("CreatePlanContainer", () => {
  test("Expect to match snapshots", () => {
    const wrapper = render(
      <Router>
        <CreatePlanContainer />
      </Router>
    );
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
