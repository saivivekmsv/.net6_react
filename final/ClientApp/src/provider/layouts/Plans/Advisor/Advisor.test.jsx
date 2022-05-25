import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import Advisor from "./Advisor";
import { CreatePlanProvider } from "../../../contexts";

test("renders learn react link", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <Advisor />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
