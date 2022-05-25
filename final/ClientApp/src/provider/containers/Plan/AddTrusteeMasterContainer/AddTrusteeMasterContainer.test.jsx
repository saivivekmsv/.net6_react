import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AddTrusteeMasterContainer from "./AddTrusteeMasterContainer";
import { CreatePlanProvider } from "../../../contexts";

describe("AddTrusteeMasterContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <AddTrusteeMasterContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
