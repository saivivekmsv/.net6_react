import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MANAGE_COMPANY_ROUTES } from "../../utils";
import PayrollCalendarManagePayDatesContainer from "./PayrollCalendarManagePayDatesContainer";
import { ManageCompanyProvider } from "../../contexts";

describe("PayrollCalendarManagePayDatesContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <PayrollCalendarManagePayDatesContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <ManageCompanyProvider>
        <Router>
          <PayrollCalendarManagePayDatesContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("to match snapshot in edit flow", () => {
    const history = createMemoryHistory();
    const params = "edit/123456/abcd/654321/789";
    history.push(
      `${MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES}/${params}`
    );
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES}/${params}`
    );
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES}/:flow(edit)/:companyId/:frequencyId?/:payDateId?`}
          >
            <PayrollCalendarManagePayDatesContainer {...props} />
          </Route>
        </Router>
      </ManageCompanyProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });
});
