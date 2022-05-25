import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import HomeContainer from "./HomeContainer";
import useRequest from "../../abstracts/useRequest";
import homeData from "../../mocks/home.json";
import * as services from "../../services/home";

jest.mock("../../abstracts/useRequest", () =>
  jest.fn(() => {
    return {
      response: [],
      loading: true,
    };
  })
);

describe("HomeContainer", () => {
  test("renders learn react link", () => {
    const history = createMemoryHistory();
    window.history.pushState({}, "Test page", `/home`);
    history.push(`/home`);
    useRequest.mockImplementation(() => ({
      response: homeData,
      loading: false,
    }));

    const wrapper = render(
      <Router history={history}>
        <Route path="/home">
          <HomeContainer history={history} />
        </Route>
      </Router>
    );
    expect(wrapper.baseElement).toMatchSnapshot();
    const addButton = wrapper.container.querySelector(".add-icon");
    fireEvent.click(addButton);
    expect(history.location.pathname).toBe("/manage-plan");
  });

  test("renders fetch count data", () => {
    const history = createMemoryHistory();
    window.history.pushState({}, "Test page", `/home`);
    history.push(`/home`);
    useRequest.mockImplementation(() => ({
      response: [],
      loading: true,
    }));

    const wrapper = render(
      <Router history={history}>
        <Route path="/home">
          <HomeContainer history={history} />
        </Route>
      </Router>
    );

    useRequest.mockImplementation(() => ({
      response: homeData,
      loading: false,
    }));

    wrapper.rerender(
      <Router history={history}>
        <Route path="/home">
          <HomeContainer history={history} />
        </Route>
      </Router>
    );
    expect(history.location.pathname).toBe("/home");
  });
});
