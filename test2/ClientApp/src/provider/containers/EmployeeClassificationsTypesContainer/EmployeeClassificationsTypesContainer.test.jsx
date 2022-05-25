import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MANAGE_COMPANY_ROUTES } from "../../utils";
import EmployeeClassificationsTypesContainer from "./EmployeeClassificationsTypesContainer";
import { ManageCompanyProvider } from "../../contexts";

describe("EmployeeClassificationsTypesContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <EmployeeClassificationsTypesContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot on submit", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <EmployeeClassificationsTypesContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot in edit flow", () => {
    const history = createMemoryHistory();
    const params = "edit/123456";
    history.push(`${MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS}/${params}`);
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS}/${params}`
    );
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS}/:flow(edit)/:companyId`}
          >
            <EmployeeClassificationsTypesContainer {...props} />
          </Route>
        </Router>
      </ManageCompanyProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });
});
