import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import ManageCompanyClassification from "./ManageCompanyClassification";
import { ManageCompanyProvider } from "../../contexts";

test("renders learn react link", () => {
  const wrapper = render(
    <ManageCompanyProvider>
      <Router>
        <ManageCompanyClassification />
      </Router>
    </ManageCompanyProvider>
  );
  expect(wrapper.baseElement).toMatchSnapshot();
});
