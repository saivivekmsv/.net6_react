import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import PayrollFrequency from "./PayrollFrequency";
import { ManageCompanyProvider } from "../../contexts";

test("renders learn react link", () => {
  const wrapper = render(
    <ManageCompanyProvider>
      <Router>
        <PayrollFrequency />
      </Router>
    </ManageCompanyProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
