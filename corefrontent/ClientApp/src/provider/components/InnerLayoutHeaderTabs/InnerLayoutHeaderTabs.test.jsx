import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import InnerLayoutHeaderTabs from "./InnerLayoutHeaderTabs";
import { MANAGE_COMPANY_ROUTES } from "../../utils";

const menuList = [
  {
    label: "SETTINGS",
    path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
  },
  {
    label: "PAYDATES",
    path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
    selected: true,
  },
];
describe("InnerLayoutHeaderTabs", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <InnerLayoutHeaderTabs menuList={menuList} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
