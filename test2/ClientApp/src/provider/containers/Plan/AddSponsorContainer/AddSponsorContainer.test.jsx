import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AddSponsorContainer from "./AddSponsorContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("AddSponsorContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <AddSponsorContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <CreatePlanProvider>
        <Router>
          <AddSponsorContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
