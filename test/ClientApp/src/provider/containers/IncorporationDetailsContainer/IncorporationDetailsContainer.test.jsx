import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MANAGE_COMPANY_ROUTES } from "../../utils";
import IncorporationDetailsContainer from "./IncorporationDetailsContainer";
import { ManageCompanyProvider } from "../../contexts";

describe("IncorporationDetailsContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <IncorporationDetailsContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <ManageCompanyProvider>
        <Router>
          <IncorporationDetailsContainer {...props} />
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
    history.push(`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/${params}`);
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/${params}`
    );
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/:flow(edit)/:companyId`}
          >
            <IncorporationDetailsContainer {...props} />
          </Route>
        </Router>
      </ManageCompanyProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });
});
