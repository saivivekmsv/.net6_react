import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PlanSuccessContainer from "./PlanSuccessContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("PlanSuccessContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <PlanSuccessContainer />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
