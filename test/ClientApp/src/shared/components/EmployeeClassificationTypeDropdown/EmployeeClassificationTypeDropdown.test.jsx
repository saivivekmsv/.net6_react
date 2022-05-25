import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import EmployeeClassificationTypeDropdown from "./EmployeeClassificationTypeDropdown";
import employeeClassificationType from "../../mocks/employeeClassificationType.json";

describe("EmployeeClassificationTypeDropdown", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <EmployeeClassificationTypeDropdown
          data={employeeClassificationType.data}
          {...props}
        />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
