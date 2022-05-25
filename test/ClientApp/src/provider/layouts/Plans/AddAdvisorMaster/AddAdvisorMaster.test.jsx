import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AddAdvisorMaster from "./AddAdvisorMaster";
import { CreatePlanProvider } from "../../../contexts";

test("AddAdvisorMaster", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <AddAdvisorMaster />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
