import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MANAGE_COMPANY_ROUTES } from "../../utils";
import PayrollFrequencyContainer from "./PayrollFrequencyContainer";
import { ManageCompanyProvider } from "../../contexts";
import payrollFrequency from "../../mocks/payrollFrequency.json";
import { manageCompanyFormNames } from "../../utils";

describe("PayrollFrequencyContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <PayrollFrequencyContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  payrollFrequency.data.forEach((item) => {
    const value = item.value;
    test(`to match snapshot for frequency - ${value}`, () => {
      const wrapper = render(
        <ManageCompanyProvider
          value={{
            [manageCompanyFormNames.PAYROLL_FREQUENCY_MANAGE_COMPANY]: {
              payrollFrequency: value,
            },
          }}
        >
          <Router>
            <PayrollFrequencyContainer {...props} />
          </Router>
        </ManageCompanyProvider>
      );
      const dropsideArrow = wrapper.container.querySelector(
        ".dropSide-custom-select-arrow"
      );
      fireEvent.click(dropsideArrow);
      const dropSideOption = wrapper.container.querySelector(
        `#custom-radio-${value}`
      );
      fireEvent.click(dropSideOption);
      expect(wrapper.baseElement).toMatchSnapshot();
    });
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <ManageCompanyProvider>
        <Router>
          <PayrollFrequencyContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("to match snapshot in edit flow", () => {
    const history = createMemoryHistory();
    const params = "edit/123456";
    history.push(`${MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY}/${params}`);
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY}/${params}`
    );
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY}/:flow(edit)/:companyId`}
          >
            <PayrollFrequencyContainer {...props} />
          </Route>
        </Router>
      </ManageCompanyProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });
});
