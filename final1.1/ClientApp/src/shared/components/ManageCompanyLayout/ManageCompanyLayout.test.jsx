import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { faPencilAlt } from "@fortawesome/pro-solid-svg-icons";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import ManageCompanyLayout from "./ManageCompanyLayout";
import { manageCompanyStore, ManageCompanyProvider } from "../../contexts";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  FLOW_TYPES,
  manageCompanyFormNames,
  ALL_MANAGE_COMPANY_ROUTES,
} from "../../utils";

describe("ManageCompanyLayout", () => {
  const props = {
    buttons: [
      {
        link: ROUTES.COMPANY,
        label: "Cancel",
        variant: "secondary",
        type: "button",
        flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      },
      {
        label: "Save",
        variant: "primary",
        type: "submit",
        flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      },
      {
        label: "",
        variant: "link",
        type: "button",
        flow: [FLOW_TYPES.EDIT],
        icon: faTimes,
        link: `${MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYMENT_STATUS}/10`,
      },
      {
        label: "",
        variant: "link",
        type: "button",
        flow: [FLOW_TYPES.EDIT],
        icon: faTrashAlt,
      },
      {
        label: "",
        variant: "link",
        type: "button",
        flow: [FLOW_TYPES.EDIT],
        icon: faPencilAlt,
        onClick: () => {},
      },
    ],
  };
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <ManageCompanyLayout {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot with error panel", () => {
    const renderWrapper = (store) => {
      return (
        <manageCompanyStore.Provider value={{ state: store }}>
          <Router>
            <ManageCompanyLayout {...props} />
          </Router>
        </manageCompanyStore.Provider>
      );
    };

    const wrapper = render(
      renderWrapper({
        api: {
          isFetching: false,
          isError: false,
          data: {},
          error: null,
        },
      })
    );
    wrapper.rerender(
      renderWrapper({
        api: {
          isFetching: false,
          isError: true,
          data: {},
          error: {
            reponse: {
              state: 500,
            },
          },
        },
      })
    );
    expect(
      wrapper.container.querySelectorAll(".error-banner.enable").length
    ).toBe(1);
    const errorBannerCloseButton = wrapper.container.querySelectorAll(
      ".error-banner button"
    );
    expect(errorBannerCloseButton.length).toBe(1);
    fireEvent.click(errorBannerCloseButton[0]);
    expect(
      wrapper.container.querySelectorAll(".error-banner.enable").length
    ).toBe(0);
  });

  test("to match snapshot with toast message", async () => {
    const renderWrapper = (store) => {
      return (
        <manageCompanyStore.Provider value={{ state: store }}>
          <Router>
            <ManageCompanyLayout {...props} />
          </Router>
        </manageCompanyStore.Provider>
      );
    };

    const wrapper = render(
      renderWrapper({
        showToast: true,
        toastMessage: "new compnay created",
      })
    );

    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("to match snapshot company name bread crumbs", async () => {
    const renderWrapper = (store) => {
      return (
        <manageCompanyStore.Provider value={{ state: store }}>
          <Router>
            <ManageCompanyLayout {...props} />
          </Router>
        </manageCompanyStore.Provider>
      );
    };

    const wrapper = render(
      renderWrapper({
        [manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY]: {
          companyName: "company Name",
          companyType: "companyType",
          sponsoringOrganizationId: "sponsoringOrganizationId",
          sponsoringOrganizationIdName: "sponsoringOrganizationIdName",
        },
        selectedMenu:
          MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE,
      })
    );

    expect(wrapper.baseElement).toMatchSnapshot();
    expect(wrapper.container.querySelectorAll(".breadcrumb li").length).toBe(4);
  });
});
