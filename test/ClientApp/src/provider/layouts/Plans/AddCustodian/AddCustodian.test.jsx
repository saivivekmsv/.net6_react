import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AddCustodian from "./AddCustodian";
import { CreatePlanProvider } from "../../../contexts";

test("AddCustodian", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <AddCustodian />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
