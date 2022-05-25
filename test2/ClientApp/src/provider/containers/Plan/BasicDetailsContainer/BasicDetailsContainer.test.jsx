import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { MANAGE_PLAN_ROUTES } from "../../../utils";
import BasicDetailsContainer from "./BasicDetailsContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("BasicDetailsContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <BasicDetailsContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <CreatePlanProvider>
        <Router>
          <BasicDetailsContainer {...props} />
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
    history.push(`${MANAGE_PLAN_ROUTES.BASIC_DETAILS}/${params}`);
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_PLAN_ROUTES.BASIC_DETAILS}/${params}`
    );
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_PLAN_ROUTES.BASIC_DETAILS}/:flow(edit)/:planId`}
          >
            <BasicDetailsContainer {...props} />
          </Route>
        </Router>
      </CreatePlanProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_PLAN_ROUTES.BASIC_DETAILS}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });
});
