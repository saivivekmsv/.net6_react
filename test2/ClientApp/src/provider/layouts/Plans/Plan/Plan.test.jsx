import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import Plan from "./Plan";
import { AppLayoutProvider } from "../../../contexts";

test("renders learn react link", () => {
  const wrapper = render(
    <AppLayoutProvider>
      <Router>
        <Plan />
      </Router>
    </AppLayoutProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
