import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ManageSourcesMasterContainer from "./ManageSourcesMasterContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("ManageSourcesMasterContainer - sprint 4", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <ManageSourcesMasterContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
