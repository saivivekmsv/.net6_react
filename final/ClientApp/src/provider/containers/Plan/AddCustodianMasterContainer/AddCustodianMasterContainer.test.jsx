import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AddCustodianMasterContainer from "./AddCustodianMasterContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("AddCustodianMasterContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <AddCustodianMasterContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
