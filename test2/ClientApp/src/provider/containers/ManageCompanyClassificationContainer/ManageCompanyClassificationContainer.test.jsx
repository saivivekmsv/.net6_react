import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MANAGE_COMPANY_ROUTES } from "../../utils";
import ManageCompanyClassificationContainer from "./ManageCompanyClassificationContainer";
import { ManageCompanyProvider } from "../../contexts";
import exployeeClassifications from "../../mocks/exployeeClassifications.json";

describe("ManageCompanyClassificationContainer", () => {
  const props = {};
  test("to match snapshot no data", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <ManageCompanyClassificationContainer
            {...props}
            classificationData={[]}
          />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot with data ", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <ManageCompanyClassificationContainer
            {...props}
            classificationData={exployeeClassifications.data}
          />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot in edit flow", () => {
    const history = createMemoryHistory();
    const params = "edit/123456";
    history.push(
      `${MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS}/${params}`
    );
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS}/${params}`
    );
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS}/:flow(edit)/:companyId`}
          >
            <ManageCompanyClassificationContainer {...props} />
          </Route>
        </Router>
      </ManageCompanyProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });
});
