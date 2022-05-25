import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import ManageSourcesNewContainer from "./ManageSourcesNewContainer";
import { CreatePlanProvider } from "../../../contexts";
import { MANAGE_PLAN_ROUTES } from "../../../utils";

describe("ManageSourcesNewContainer - sprint 4", () => {
  const props = {};
  test("to match default snapshot", () => {
    const { baseElement } = render(
      <CreatePlanProvider>
        <Router>
          <ManageSourcesNewContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot create flow", () => {
    const history = createMemoryHistory();
    const params = "123456";
    const route = MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW;
    history.push(`${route}/${params}`);
    window.history.pushState({}, "Test page", `${route}/${params}`);
    const wrapper = render(
      <CreatePlanProvider>
        <Router history={history}>
          <Route path={`${route}/:planId`}>
            <ManageSourcesNewContainer {...props} />
          </Route>
        </Router>
      </CreatePlanProvider>
    );
    expect(history.location.pathname).toBe(`${route}/${params}`);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("to match snapshot edit flow", () => {
    const history = createMemoryHistory();
    const params = "edit/123456/654321";
    const route = MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW;
    history.push(`${route}/${params}`);
    window.history.pushState({}, "Test page", `${route}/${params}`);
    const wrapper = render(
      <CreatePlanProvider>
        <Router history={history}>
          <Route path={`${route}/:flow(edit)/:planId/:sourceId`}>
            <ManageSourcesNewContainer {...props} />
          </Route>
        </Router>
      </CreatePlanProvider>
    );
    expect(history.location.pathname).toBe(`${route}/${params}`);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  describe("Employee form", () => {
    test("source type employee & sourceCategory Deferral", () => {
      const history = createMemoryHistory();
      const params = "123456";
      const route = MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW;
      history.push(`${route}/${params}`);
      window.history.pushState({}, "Test page", `${route}/${params}`);
      const wrapper = render(
        <CreatePlanProvider>
          <Router history={history}>
            <Route path={`${route}/:planId`}>
              <ManageSourcesNewContainer {...props} />
            </Route>
          </Router>
        </CreatePlanProvider>
      );
      const sourceTypeButtonEmployee = wrapper.container.querySelector(
        'div[name="sourceType"] button[data-attr="1"]'
      );
      fireEvent.click(sourceTypeButtonEmployee);
      const sourceCategoryButtonDeferral = wrapper.container.querySelector(
        'div[name="sourceCategory"] button[data-attr="1"]'
      );
      fireEvent.click(sourceCategoryButtonDeferral);
      expect(
        wrapper.container.querySelectorAll(".add-additional-allocation-rules")
          .length
      ).toBe(1);
      const sourceCategoryButtonOther = wrapper.container.querySelector(
        'div[name="sourceCategory"] button[data-attr="2"]'
      );
      fireEvent.click(sourceCategoryButtonOther);
      expect(
        wrapper.container.querySelectorAll(".add-additional-allocation-rules")
          .length
      ).toBe(0);

      const allocationPercForRehiresOther = wrapper.container.querySelector(
        'div[name="allocationPercForRehires"] button[data-attr="2"]'
      );
      fireEvent.click(allocationPercForRehiresOther);
      const otherPercForRehires = wrapper.container.querySelectorAll(
        'input[name="otherPercForRehires"]'
      );
      expect(otherPercForRehires.length).toBe(1);
    });

    test("source type employee & sourceCategory Other", () => {
      const history = createMemoryHistory();
      const params = "123456";
      const route = MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW;
      history.push(`${route}/${params}`);
      window.history.pushState({}, "Test page", `${route}/${params}`);
      const wrapper = render(
        <CreatePlanProvider>
          <Router history={history}>
            <Route path={`${route}/:planId`}>
              <ManageSourcesNewContainer {...props} />
            </Route>
          </Router>
        </CreatePlanProvider>
      );
      const sourceTypeButtonEmployee = wrapper.container.querySelector(
        'div[name="sourceType"] button[data-attr="1"]'
      );
      fireEvent.click(sourceTypeButtonEmployee);
      const sourceCategoryButtonDeferral = wrapper.container.querySelector(
        'div[name="sourceCategory"] button[data-attr="2"]'
      );
      fireEvent.click(sourceCategoryButtonDeferral);
      expect(
        wrapper.container.querySelectorAll(".add-additional-allocation-rules")
          .length
      ).toBe(0);
    });
  });

  describe("Employer form", () => {
    test("source type Employer & sourceCategory Discretionary", () => {
      const history = createMemoryHistory();
      const params = "123456";
      const route = MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW;
      history.push(`${route}/${params}`);
      window.history.pushState({}, "Test page", `${route}/${params}`);
      const wrapper = render(
        <CreatePlanProvider>
          <Router history={history}>
            <Route path={`${route}/:planId`}>
              <ManageSourcesNewContainer {...props} />
            </Route>
          </Router>
        </CreatePlanProvider>
      );
      const sourceTypeButtonEmployer = wrapper.container.querySelector(
        'div[name="sourceType"] button[data-attr="2"]'
      );
      fireEvent.click(sourceTypeButtonEmployer);
      const adiApplicableToDiscretionary = wrapper.container.querySelector(
        'div[name="sourceCategory"] button[data-attr="3"]'
      );
      fireEvent.click(adiApplicableToDiscretionary);
      const responsibleModeCore = wrapper.container.querySelector(
        'div[name="responsibleMode"] button[data-attr="2"]'
      );
      fireEvent.click(responsibleModeCore);
      expect(
        wrapper.container.querySelectorAll(".add-additional-allocation-rules")
          .length
      ).toBe(1);
      const responsibleModeClient = wrapper.container.querySelector(
        'div[name="responsibleMode"] button[data-attr="1"]'
      );
      fireEvent.click(responsibleModeClient);
      expect(
        wrapper.container.querySelectorAll(".add-additional-allocation-rules")
          .length
      ).toBe(0);
    });

    test("source type Employer & sourceCategory Match", () => {
      const history = createMemoryHistory();
      const params = "123456";
      const route = MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW;
      history.push(`${route}/${params}`);
      window.history.pushState({}, "Test page", `${route}/${params}`);
      const wrapper = render(
        <CreatePlanProvider>
          <Router history={history}>
            <Route path={`${route}/:planId`}>
              <ManageSourcesNewContainer {...props} />
            </Route>
          </Router>
        </CreatePlanProvider>
      );
      const sourceTypeButtonEmployer = wrapper.container.querySelector(
        'div[name="sourceType"] button[data-attr="2"]'
      );
      fireEvent.click(sourceTypeButtonEmployer);
      const adiApplicableToMatch = wrapper.container.querySelector(
        'div[name="sourceCategory"] button[data-attr="4"]'
      );
      fireEvent.click(adiApplicableToMatch);
      const responsibleModeCore = wrapper.container.querySelector(
        'div[name="responsibleMode"] button[data-attr="2"]'
      );
      fireEvent.click(responsibleModeCore);
      expect(
        wrapper.container.querySelectorAll(".add-additional-allocation-rules")
          .length
      ).toBe(1);
      const responsibleModeClient = wrapper.container.querySelector(
        'div[name="responsibleMode"] button[data-attr="1"]'
      );
      fireEvent.click(responsibleModeClient);
      expect(
        wrapper.container.querySelectorAll(".add-additional-allocation-rules")
          .length
      ).toBe(0);
    });

    test("source type Employer & sourceCategory Other", () => {
      const history = createMemoryHistory();
      const params = "123456";
      const route = MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW;
      history.push(`${route}/${params}`);
      window.history.pushState({}, "Test page", `${route}/${params}`);
      const wrapper = render(
        <CreatePlanProvider>
          <Router history={history}>
            <Route path={`${route}/:planId`}>
              <ManageSourcesNewContainer {...props} />
            </Route>
          </Router>
        </CreatePlanProvider>
      );
      const sourceTypeButtonEmployer = wrapper.container.querySelector(
        'div[name="sourceType"] button[data-attr="2"]'
      );
      fireEvent.click(sourceTypeButtonEmployer);
      const adiApplicableToOther = wrapper.container.querySelector(
        'div[name="sourceCategory"] button[data-attr="5"]'
      );
      fireEvent.click(adiApplicableToOther);

      const sourceSubCategoryQMAC = wrapper.container.querySelector(
        'div[name="sourceSubCategory"] button[data-attr="8"]'
      );
      fireEvent.click(sourceSubCategoryQMAC);
      const qmacType = wrapper.container.querySelectorAll(
        'div[name="qmacType"]'
      );
      expect(qmacType.length).toBe(1);
      const sourceSubCategoryQNEC = wrapper.container.querySelector(
        'div[name="sourceSubCategory"] button[data-attr="9"]'
      );
      fireEvent.click(sourceSubCategoryQNEC);
      const qnecType = wrapper.container.querySelectorAll(
        'div[name="qnecType"]'
      );
      expect(qnecType.length).toBe(1);
      const responsibleMode = wrapper.container.querySelectorAll(
        'div[name="responsibleMode"]'
      );
      expect(responsibleMode.length).toBe(0);
      expect(
        wrapper.container.querySelectorAll(".add-additional-allocation-rules")
          .length
      ).toBe(0);
    });
  });
});
