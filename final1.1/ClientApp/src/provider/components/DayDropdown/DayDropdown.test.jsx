import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DayDropdown from "./DayDropdown";

describe("DayDropdown", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(<DayDropdown />);
    expect(baseElement).toMatchSnapshot();
  });

  test("on day select", () => {
    const wrapper = render(<DayDropdown onSelect={() => {}} />);
    const dayItem = wrapper.container.querySelector(
      ".react-calendar__month-view__days__day"
    );

    fireEvent.click(dayItem);

    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
