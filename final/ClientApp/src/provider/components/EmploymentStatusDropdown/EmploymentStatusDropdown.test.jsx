import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import EmploymentStatusDropdown from "./EmploymentStatusDropdown";
import employmentStatus from "../../mocks/employmentStatus.json";

describe("EmploymentStatusDropdown", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <EmploymentStatusDropdown data={employmentStatus.data} {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
