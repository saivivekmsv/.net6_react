import React from "react";
import { Router, Route } from "react-router-dom";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import SuccessPlan from "./SuccessPlan";
import { AppLayoutProvider } from "../../../contexts";
import { ROUTES } from "../../../utils";

test("renders learn react link", () => {
  const history = createMemoryHistory();
  history.push(`${ROUTES.SUCCESS_PLAN}`);
  window.history.pushState({}, "Test page", `${ROUTES.SUCCESS_PLAN}`);
  const wrapper = render(
    <AppLayoutProvider>
      <Router history={history}>
        <Route path={`${ROUTES.SUCCESS_PLAN}`}>
          <SuccessPlan />
        </Route>
      </Router>
    </AppLayoutProvider>
  );
  expect(history.location.pathname).toBe("/success-plan");
  expect(wrapper.baseElement).toMatchSnapshot();
});
