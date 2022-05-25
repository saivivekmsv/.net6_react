import React from "react";
import { Router, Route } from "react-router-dom";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import ManagePlan from "./ManagePlan";
import { AppLayoutProvider } from "../../../contexts";
import { ROUTES } from "../../../utils";

test("renders learn react link", () => {
  const history = createMemoryHistory();
  history.push(`${ROUTES.CREATE_PLAN}`);
  window.history.pushState({}, "Test page", `${ROUTES.CREATE_PLAN}`);
  const wrapper = render(
    <AppLayoutProvider>
      <Router history={history}>
        <Route path={`${ROUTES.CREATE_PLAN}`}>
          <ManagePlan />
        </Route>
      </Router>
    </AppLayoutProvider>
  );
  expect(history.location.pathname).toBe("/create-plan");
  expect(wrapper.baseElement).toMatchSnapshot();
});
