import reducer from "./reducer";
import {
  MANAGE_COMPANY_SET_SELECTED_MENU,
  MANAGE_COMPANY_SET_FLOW,
  MANAGE_COMPANY_SET_PAGE_DATA,
  MANAGE_COMPANY_SET_FULL_PAGE_DATA,
  MANAGE_COMPANY_SET_LOADER,
  MANAGE_COMPANY_SET_TOAST_INFO,
} from "./actions";
import { manageCompanyFormNames } from "../../../utils";

describe("manage-company reducer", () => {
  test("Default state", () => {
    expect(reducer({}, {})).toEqual({});
  });

  test("MANAGE_COMPANY_SET_SELECTED_MENU", () => {
    expect(
      reducer(
        {},
        {
          type: MANAGE_COMPANY_SET_SELECTED_MENU,
          payload: "/home",
        }
      )
    ).toEqual({
      selectedMenu: "/home",
    });
  });

  test("MANAGE_COMPANY_SET_FLOW", () => {
    expect(
      reducer(
        {},
        {
          type: MANAGE_COMPANY_SET_FLOW,
          payload: {
            flow: "edit",
          },
        }
      )
    ).toEqual({
      flow: "edit",
    });
  });

  test("MANAGE_COMPANY_SET_PAGE_DATA", () => {
    expect(
      reducer(
        {},
        {
          type: MANAGE_COMPANY_SET_PAGE_DATA,
          payload: {
            formName: manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY,
            fieldData: {
              companyName: "companyName",
              companyType: "companyType",
              sponsoringOrganizationId: "sponsoringOrganizationId",
            },
          },
        }
      )
    ).toEqual({
      definitions_managecompany: {
        companyName: "companyName",
        companyType: "companyType",
        sponsoringOrganizationId: "sponsoringOrganizationId",
      },
    });
  });

  test("MANAGE_COMPANY_SET_FULL_PAGE_DATA", () => {
    expect(
      reducer(
        {},
        {
          type: MANAGE_COMPANY_SET_FULL_PAGE_DATA,
        }
      )
    ).toEqual({});
  });

  test("MANAGE_COMPANY_SET_LOADER", () => {
    expect(
      reducer(
        {},
        {
          type: MANAGE_COMPANY_SET_LOADER,
          payload: true,
        }
      )
    ).toEqual({
      isLoading: true,
    });
  });

  test("MANAGE_COMPANY_SET_TOAST_INFO", () => {
    expect(
      reducer(
        {},
        {
          type: MANAGE_COMPANY_SET_TOAST_INFO,
          payload: { showToast: true, toastMessage: "abcd" },
        }
      )
    ).toEqual({
      showToast: true,
      toastMessage: "abcd",
    });
  });
});
