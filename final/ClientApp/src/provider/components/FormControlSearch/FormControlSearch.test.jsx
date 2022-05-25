import React from "react";
import { fireEvent, render } from "@testing-library/react";
import FormControlSearch from "./FormControlSearch";

describe("FormControlSearch", () => {
  const props = {
    onChange: jest.fn(),
  };
  test(`to match default snapshot`, () => {
    const wrapper = render(<FormControlSearch id="text-box" {...props} />);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test(`to match default with value`, () => {
    const wrapper = render(<FormControlSearch id="text-box" {...props} />);
    const inputElem = wrapper.container.querySelectorAll("#text-box");
    expect(inputElem.length).toBe(1);
    fireEvent.change(inputElem[0], {
      target: {
        value: "ABCD",
      },
    });
    expect(props.onChange).toHaveBeenCalled();
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test(`to match default with clear button click`, () => {
    const wrapper = render(<FormControlSearch id="text-box" {...props} />);
    const inputElem = wrapper.container.querySelector("#text-box");
    fireEvent.change(inputElem, {
      target: {
        value: "ABCD",
      },
    });
    const clearButton = wrapper.container.querySelectorAll(".close-button");
    expect(clearButton.length).toBe(1);
    fireEvent.click(clearButton[0]);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test(`to match default with mouse move`, () => {
    const wrapper = render(<FormControlSearch id="text-box" {...props} />);
    const inputElem = wrapper.container.querySelector("#text-box");
    inputElem.value = "ABCD";
    fireEvent.mouseMove(inputElem);
    const clearButton = wrapper.container.querySelectorAll(
      ".close-button-wrapper.active"
    );
    expect(clearButton.length).toBe(1);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test(`to match default with mouse move no value`, () => {
    const wrapper = render(<FormControlSearch id="text-box" {...props} />);
    const inputElem = wrapper.container.querySelector("#text-box");
    inputElem.value = "";
    fireEvent.mouseMove(inputElem);
    const clearButton = wrapper.container.querySelectorAll(
      ".close-button-wrapper.active"
    );
    expect(clearButton.length).toBe(0);
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test(`to match default with mouse out`, () => {
    const wrapper = render(<FormControlSearch id="text-box" {...props} />);
    const inputElem = wrapper.container.querySelector("#text-box");
    inputElem.value = "ABCD";
    fireEvent.mouseOut(inputElem);
    const clearButton = wrapper.container.querySelectorAll(
      ".close-button-wrapper.active"
    );
    expect(clearButton.length).toBe(0);
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
