import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ManageCompanyMenu from "./ManageCompanyMenu";
import {
  FLOW_TYPES,
  MANAGE_COMPANY_MENU,
  MANAGE_COMPANY_ROUTES,
} from "../../utils";

describe("ManageCompanyMenu", () => {
  const props = {
    menuList: MANAGE_COMPANY_MENU,
    selectedMenu: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
    companyId: 123456,
    flow: FLOW_TYPES.ADD,
  };
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <ManageCompanyMenu {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
