import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import DefinitionsContainer from "./DefinitionsContainer";
import { ManageCompanyProvider, manageCompanyStore } from "../../contexts";
import {
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
} from "../../utils";

describe("DefinitionsContainer", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router>
          <DefinitionsContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match on form submit", () => {
    const wrapper = render(
      <ManageCompanyProvider>
        <Router>
          <DefinitionsContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );
    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("to match snapshot in edit flow", () => {
    const history = createMemoryHistory();
    const params = "edit/123456";
    history.push(`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/${params}`);
    window.history.pushState(
      {},
      "Test page",
      `${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/${params}`
    );
    const { baseElement } = render(
      <ManageCompanyProvider>
        <Router history={history}>
          <Route
            path={`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/:flow(edit)/:companyId`}
          >
            <DefinitionsContainer {...props} />
          </Route>
        </Router>
      </ManageCompanyProvider>
    );
    expect(history.location.pathname).toBe(
      `${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/${params}`
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("form element change & submit with sponsoring org", async () => {
    let wrapper = null;
    wrapper = render(
      <manageCompanyStore.Provider
        value={{
          state: {
            sponsoringOrgList: [
              {
                label: "SO2",
                value: "SO2",
              },
            ],
          },
        }}
      >
        <Router>
          <DefinitionsContainer {...props} />
        </Router>
      </manageCompanyStore.Provider>
    );

    const fields =
      formFields[manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY];

    const fieldCompanyName = wrapper.container.querySelector(
      `input[name="${fields.companyName}"]`
    );
    fireEvent.change(fieldCompanyName, {
      target: {
        value: "12312",
      },
    });

    const fieldElement = wrapper.container.querySelector(
      `button[data-attr="1"]`
    );
    fireEvent.click(fieldElement);

    let dropSideTrigger = null;
    await wait(() => {
      dropSideTrigger = wrapper.container.querySelector(
        ".dropSide-custom-select"
      );
    });
    fireEvent.click(dropSideTrigger);

    const dropisdeButton = wrapper.container.querySelector(
      `button[data-attr="SO2"]`
    );
    dropisdeButton.click(dropSideTrigger);

    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("form element change & submit with no sponsoring org", async () => {
    let wrapper = null;
    wrapper = render(
      <ManageCompanyProvider>
        <Router>
          <DefinitionsContainer {...props} />
        </Router>
      </ManageCompanyProvider>
    );

    const fields =
      formFields[manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY];

    const fieldCompanyName = wrapper.container.querySelector(
      `input[name="${fields.companyName}"]`
    );
    fireEvent.change(fieldCompanyName, {
      target: {
        value: "12312",
      },
    });

    const fieldElement = wrapper.container.querySelector(
      `button[data-attr="0"]`
    );
    fireEvent.click(fieldElement);

    const form = wrapper.container.querySelector("form");
    fireEvent.submit(form);
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
