import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ManagePlanMenu from "./ManagePlanMenu";
import { MANAGE_PLAN_MENU, MANAGE_PLAN_ROUTES } from "../../utils";

describe("ManagePlanMenu", () => {
  const props = {
    menuList: MANAGE_PLAN_MENU,
    selectedMenu: MANAGE_PLAN_ROUTES.BASIC_DETAILS,
  };
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <ManagePlanMenu {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
