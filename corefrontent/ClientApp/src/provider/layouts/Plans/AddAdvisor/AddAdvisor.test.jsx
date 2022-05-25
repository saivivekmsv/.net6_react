import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AddAdvisor from "./AddAdvisor";
import { CreatePlanProvider } from "../../../contexts";

test("AddAdvisor", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <AddAdvisor />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
