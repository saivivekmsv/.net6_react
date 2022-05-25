import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AddCustodianMaster from "./AddCustodianMaster";
import { CreatePlanProvider } from "../../../contexts";

test("AddCustodianMaster", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <AddCustodianMaster />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
