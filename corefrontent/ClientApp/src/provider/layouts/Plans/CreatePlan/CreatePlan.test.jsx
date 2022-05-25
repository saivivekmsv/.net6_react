import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import CreatePlan from "./CreatePlan";
import { AppLayoutProvider } from "../../../contexts";

test("renders learn react link", () => {
  const wrapper = render(
    <AppLayoutProvider>
      <Router>
        <CreatePlan />
      </Router>
    </AppLayoutProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
