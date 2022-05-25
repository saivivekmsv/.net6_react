import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AdditionalEligibilityRule from "./AdditionalEligibilityRule";
import { CreatePlanProvider } from "../../../contexts";

test("AdditionalEligibilityRule", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <AdditionalEligibilityRule />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
