import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import CustodianContainer from "./CustodianContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("CustodianContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <CustodianContainer />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
