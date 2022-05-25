import reducer from "./reducer";
import {
  APP_LAYOUT_SET_SELECTED_MENU,
  APP_LAYOUT_SET_COMPANY_DETAILS,
} from "./actions";

describe("app-layout reducer", () => {
  test("Default state", () => {
    expect(reducer({}, {})).toEqual({});
  });

  test("APP_LAYOUT_SET_SELECTED_MENU", () => {
    expect(
      reducer(
        {},
        {
          type: APP_LAYOUT_SET_SELECTED_MENU,
          payload: "/home",
        }
      )
    ).toEqual({
      selectedMenu: "/home",
    });
  });

  test("APP_LAYOUT_SET_COMPANY_DETAILS", () => {
    expect(
      reducer(
        {},
        {
          type: APP_LAYOUT_SET_COMPANY_DETAILS,
          payload: {},
        }
      )
    ).toEqual({ companyDetails: {} });
  });
});
