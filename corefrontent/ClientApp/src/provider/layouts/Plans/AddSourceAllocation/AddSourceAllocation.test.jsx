import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AddSourceAllocation from "./AddSourceAllocation";
import { CreatePlanProvider } from "../../../contexts";

test("AddSourceAllocation", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <AddSourceAllocation />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
