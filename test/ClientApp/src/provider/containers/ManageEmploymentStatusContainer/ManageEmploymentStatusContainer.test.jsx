import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ManageEmploymentStatusContainer from "./ManageEmploymentStatusContainer";
import { ManageCompanyProvider, manageCompanyStore } from "../../contexts";
import employmentStatus from "../../mocks/exployeeStatus.json";

describe("ManageEmploymentStatusContainer", () => {
  const props = {};
  test("to match snapshot no data", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <ManageEmploymentStatusContainer {...props} exployeeStatusData={[]} />
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
                employmentStatus,
              },
            },
          },
        }}
      >
        <Router>
          <ManageEmploymentStatusContainer {...props} />
        </Router>
      </manageCompanyStore.Provider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
