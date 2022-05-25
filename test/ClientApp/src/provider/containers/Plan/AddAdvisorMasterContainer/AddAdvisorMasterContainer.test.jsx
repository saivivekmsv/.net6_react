import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AddAdvisorMasterContainer from "./AddAdvisorMasterContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("AddAdvisorMasterContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <AddAdvisorMasterContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
