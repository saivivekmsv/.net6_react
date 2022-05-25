import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SponsoringOrgDropdown from "./SponsoringOrgDropdown";
import SponsoringOrganisation from "../../mocks/sponsoringOrganisation.json";

describe("SponsoringOrgDropdown", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <SponsoringOrgDropdown data={SponsoringOrganisation.data} {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
