import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ViewMasterSourcesContainer from "./ViewMasterSourcesContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("ViewMasterSourcesContainer - sprint 4", () => {
  const props = {};
  test("to match default snapshot", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <ViewMasterSourcesContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
