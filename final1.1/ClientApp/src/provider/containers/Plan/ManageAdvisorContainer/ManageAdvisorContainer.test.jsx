import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ManageAdvisorContainer from "./ManageAdvisorContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("ManageAdvisorContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <ManageAdvisorContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
