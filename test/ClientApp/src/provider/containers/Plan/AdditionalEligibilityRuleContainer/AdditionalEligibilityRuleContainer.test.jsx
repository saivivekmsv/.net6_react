import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AdditionalEligibilityRuleContainer from "./AdditionalEligibilityRuleContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("AdditionalEligibilityRuleContainer - sprint 4", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <AdditionalEligibilityRuleContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <CreatePlanProvider>
        <Router>
          <AdditionalEligibilityRuleContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
