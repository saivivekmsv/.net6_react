import React from "react";
import { Router, Route } from "react-router-dom";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import ManageCompany from "./ManageCompany";
import { AppLayoutProvider } from "../../contexts";
import { MANAGE_COMPANY_ROUTES } from "../../utils";

test("renders learn react link", () => {
  const history = createMemoryHistory();
  history.push(`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}`);
  window.history.pushState(
    {},
    "Test page",
    `${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}`
  );
  const wrapper = render(
    <AppLayoutProvider>
      <Router history={history}>
        <Route path={`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}`}>
          <ManageCompany />
        </Route>
      </Router>
    </AppLayoutProvider>
  );
  expect(history.location.pathname).toBe("/manage-company/definitions");
  expect(wrapper.baseElement).toMatchSnapshot();
});
