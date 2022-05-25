import React from "react";
import { fireEvent, render } from "@testing-library/react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import employeeClassificationForSources from "../../mocks/employeeClassificationForSources.json";

describe("MultiSelectDropdown - sprint 4", () => {
  const commonProps = {
    onSelect: jest.fn(),
    label: "Multi Select",
    name: "multiSelect",
    options: employeeClassificationForSources,
  };
  test("to match default snapshot", () => {
    const { baseElement } = render(<MultiSelectDropdown {...commonProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  test("to match loading snapshot", () => {
    const wrapper = render(<MultiSelectDropdown {...commonProps} isLoading />);
    const loaderOverlay = wrapper.container.querySelectorAll(
      ".loader-wrapper-overlay"
    );
    expect(loaderOverlay.length).toBe(1);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("to check indiviual selection", () => {
    const wrapper = render(<MultiSelectDropdown {...commonProps} />);
    const checkBoxes = wrapper.container.querySelectorAll(
      `input[name="multiSelect"]`
    );
    checkBoxes.forEach((elem, index) => {
      if (index < 3) {
        fireEvent.click(elem);
      }
    });
    const totalSelectedSpan = wrapper.container.querySelector(
      ".total-selected"
    );
    expect(totalSelectedSpan.innerHTML).toBe("(3 selected) ");
  });

  test("to check select all", () => {
    const wrapper = render(<MultiSelectDropdown {...commonProps} />);
    const selectAllBtn = wrapper.container.querySelector(`.select-all-btn`);
    fireEvent.click(selectAllBtn);

    const totalSelectedSpan = wrapper.container.querySelector(
      ".total-selected"
    );
    expect(totalSelectedSpan.innerHTML).toBe(
      `(${employeeClassificationForSources.length} selected) `
    );
  });

  test("to check unselect all", () => {
    const wrapper = render(<MultiSelectDropdown {...commonProps} />);
    const selectAllBtn = wrapper.container.querySelector(`.select-all-btn`);
    fireEvent.click(selectAllBtn);
    fireEvent.click(selectAllBtn);

    const totalSelectedSpan = wrapper.container.querySelector(
      ".total-selected"
    );
    expect(totalSelectedSpan.innerHTML).toBe(``);
  });

  test("to check if select is called", () => {
    const wrapper = render(<MultiSelectDropdown {...commonProps} />);
    const selectAllBtn = wrapper.container.querySelector(`.select-all-btn`);
    fireEvent.click(selectAllBtn);
    const submitButton = wrapper.container.querySelector(`.multiselect-submit`);
    fireEvent.click(submitButton);

    expect(commonProps.onSelect).toHaveBeenCalled();
  });
});
