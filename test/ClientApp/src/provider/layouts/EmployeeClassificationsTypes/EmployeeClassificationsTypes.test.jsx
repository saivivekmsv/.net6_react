import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import EmployeeClassificationsTypes from "./EmployeeClassificationsTypes";
import { ManageCompanyProvider } from "../../contexts";

test("renders learn react link", () => {
  const wrapper = render(
    <ManageCompanyProvider>
      <Router>
        <EmployeeClassificationsTypes />
      </Router>
    </ManageCompanyProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
