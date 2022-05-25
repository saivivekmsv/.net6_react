import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import { AppLayoutProvider } from "../../contexts";
import Home from "./Home";

test("renders learn react link", () => {
  const wrapper = render(
    <AppLayoutProvider>
      <Router>
        <Home />
      </Router>
    </AppLayoutProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
