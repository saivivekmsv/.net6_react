import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import SourcesAdditonalAllocationRules from "./SourcesAdditonalAllocationRules";
import { CreatePlanProvider } from "../../../contexts";

describe("SourcesAdditonalAllocationRules - sprint 4", () => {
  test("To match default snapshot", () => {
    const wrapper = render(
      <CreatePlanProvider>
        <Router>
          <SourcesAdditonalAllocationRules />
        </Router>
      </CreatePlanProvider>
    );
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
