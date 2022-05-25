import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ManagePayrollFrequencyContainer from "./ManagePayrollFrequencyContainer";
import { ManageCompanyProvider, manageCompanyStore } from "../../contexts";
import payrollFrequencies from "../../mocks/payrollFrequencyList.json";

describe("ManagePayrollFrequencyContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <ManagePayrollFrequencyContainer {...props} />
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
                payrollFrequencies,
              },
            },
          },
        }}
      >
        <Router>
          <ManagePayrollFrequencyContainer {...props} />
        </Router>
      </manageCompanyStore.Provider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
