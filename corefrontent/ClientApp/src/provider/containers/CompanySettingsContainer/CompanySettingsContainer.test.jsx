import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import CompanySettingsContainer from "./CompanySettingsContainer";
import { ManageCompanyProvider } from "../../contexts";
import { MANAGE_COMPANY_ROUTES } from "../../utils";

describe("CompanySettingsContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <CompanySettingsContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <ManageCompanyProvider>
        <Router>
          <CompanySettingsContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("to match snapshot in edit flow", () => {
    const params = "edit/123456";
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_COMPANY_ROUTES.SETTINGS}/${params}`
    );
    const history = createMemoryHistory();
    history.push(`${MANAGE_COMPANY_ROUTES.SETTINGS}/${params}`);

    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_COMPANY_ROUTES.SETTINGS}/:flow(edit)/:companyId`}
          >
            <CompanySettingsContainer {...props} />
          </Route>
        </Router>
      </ManageCompanyProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_COMPANY_ROUTES.SETTINGS}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });
});
