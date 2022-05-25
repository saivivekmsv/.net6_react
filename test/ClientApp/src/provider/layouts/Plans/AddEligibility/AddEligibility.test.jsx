import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AddEligibility from "./AddEligibility";
import { CreatePlanProvider } from "../../../contexts";

test("AddEligibility", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <AddEligibility />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
