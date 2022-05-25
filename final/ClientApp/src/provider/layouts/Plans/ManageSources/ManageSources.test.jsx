import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import ManageSources from "./ManageSources";
import { CreatePlanProvider } from "../../../contexts";

test("renders learn react link", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <ManageSources />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
