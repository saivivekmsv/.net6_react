import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SourcesAdditonalAllocationRulesContainer from "./SourcesAdditonalAllocationRulesContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("SourcesAdditonalAllocationRulesContainer - sprint 4", () => {
  const props = {};
  test("to match employee form", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <SourcesAdditonalAllocationRulesContainer {...props} sourceType={1} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  describe("Employer form", () => {
    test("to match employer form", () => {
      const { baseElement } = render(
        <CreatePlanProvider>
          <Router>
            <SourcesAdditonalAllocationRulesContainer
              {...props}
              sourceType={2}
            />
          </Router>
        </CreatePlanProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });
    test("to match employer form & ADI applicable Discretionary", () => {
      const { baseElement } = render(
        <CreatePlanProvider>
          <Router>
            <SourcesAdditonalAllocationRulesContainer
              {...props}
              sourceType={2}
              sourceCategory={3}
            />
          </Router>
        </CreatePlanProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });
    test("to match employer form & ADI applicable Match", () => {
      const { baseElement } = render(
        <CreatePlanProvider>
          <Router>
            <SourcesAdditonalAllocationRulesContainer
              {...props}
              sourceType={2}
              sourceCategory={4}
            />
          </Router>
        </CreatePlanProvider>
      );
      expect(baseElement).toMatchSnapshot();
    });
  });
});
