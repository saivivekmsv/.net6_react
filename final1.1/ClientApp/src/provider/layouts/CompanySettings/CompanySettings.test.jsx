import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import CompanySettings from "./CompanySettings";
import { ManageCompanyProvider } from "../../contexts";

test("renders learn react link", () => {
  const wrapper = render(
    <ManageCompanyProvider>
      <Router>
        <CompanySettings />
      </Router>
    </ManageCompanyProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
