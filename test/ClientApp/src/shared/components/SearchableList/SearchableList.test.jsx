import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SearchableList from "./SearchableList";

describe("SearchableList", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <SearchableList {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
