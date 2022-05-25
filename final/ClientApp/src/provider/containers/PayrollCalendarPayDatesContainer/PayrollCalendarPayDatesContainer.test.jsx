import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import PayrollCalendarPayDatesContainer from "./PayrollCalendarPayDatesContainer";
import { ManageCompanyProvider, manageCompanyStore } from "../../contexts";
import payrollCalendars from "../../mocks/payrollFrequencyList.json";

describe("PayrollCalendarPayDatesContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <PayrollCalendarPayDatesContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot with data ", () => {
    const { baseElement } = render(
      <manageCompanyStore.Provider
        value={{
          state: {
            api: {
              data: {
                payrollCalendars,
              },
            },
          },
        }}
      >
        <Router>
          <PayrollCalendarPayDatesContainer {...props} />
        </Router>
      </manageCompanyStore.Provider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
