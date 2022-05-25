import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MANAGE_PLAN_ROUTES } from "../../../utils";
import AddTrusteeContainer from "./AddTrusteeContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("AddTrusteeContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <AddTrusteeContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <CreatePlanProvider>
        <Router>
          <AddTrusteeContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("to match snapshot in edit flow", () => {
    const history = createMemoryHistory();
    const params = "edit/123456";
    history.push(`${MANAGE_PLAN_ROUTES.ADD_TRUSTEE_MASTER}/${params}`);
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_PLAN_ROUTES.ADD_TRUSTEE_MASTER}/${params}`
    );
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_PLAN_ROUTES.ADD_TRUSTEE_MASTER}/:flow(edit)/:planId`}
          >
            <AddTrusteeContainer {...props} />
          </Route>
        </Router>
      </CreatePlanProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_PLAN_ROUTES.ADD_TRUSTEE_MASTER}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });
});
