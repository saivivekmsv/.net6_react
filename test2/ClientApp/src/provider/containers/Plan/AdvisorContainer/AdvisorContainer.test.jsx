import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AdvisorContainer from "./AdvisorContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("AdvisorContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <AdvisorContainer />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
