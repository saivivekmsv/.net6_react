import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import SourcesHistory from "./SourcesHistory";
import { CreatePlanProvider } from "../../../contexts";

describe("SourcesHistory - sprint 4", () => {
  test("To match default snapshot", () => {
    const wrapper = render(
      <CreatePlanProvider>
        <Router>
          <SourcesHistory />
        </Router>
      </CreatePlanProvider>
    );
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
