import React from "react";
import { render } from "@testing-library/react";
import AddButton from "./AddButton";

describe("AddButton", () => {
  const props = {};
  test("to match snapshot", () => {
    const { baseElement } = render(<AddButton {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
