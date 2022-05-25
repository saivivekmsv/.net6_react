import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import Header from "./Header";
import { ROUTES } from "../../utils";

describe("Header", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <Header seletedRoute="" />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot selected", () => {
    const { baseElement } = render(
      <Router>
        <Header seletedRoute={ROUTES.HOME} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot soft select", () => {
    const { baseElement } = render(
      <Router>
        <Header seletedRoute={ROUTES.MANAGE_COMPANY} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
