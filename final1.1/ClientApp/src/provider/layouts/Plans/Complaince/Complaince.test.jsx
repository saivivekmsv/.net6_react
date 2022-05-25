import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import Complaince from "./Complaince";
import { CreatePlanProvider } from "../../../contexts";

test("Complaince", () => {
  const wrapper = render(
    <CreatePlanProvider>
      <Router>
        <Complaince />
      </Router>
    </CreatePlanProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
