import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import { AppLayoutProvider } from "../contexts";
import withAppLayout from "./withAppLayout";

describe("withAppLayout", () => {
  test("check snapshot", () => {
    const Component = withAppLayout(() => <div>this is a test component</div>);
    const { baseElement } = render(
      <AppLayoutProvider>
        <Router>
          <Component />
        </Router>
      </AppLayoutProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
