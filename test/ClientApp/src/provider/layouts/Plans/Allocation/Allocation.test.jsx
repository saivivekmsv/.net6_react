import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import Allocation from "./Allocation";
import { CreatePlanProvider } from "../../../contexts";

test("Allocation", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <Allocation />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
