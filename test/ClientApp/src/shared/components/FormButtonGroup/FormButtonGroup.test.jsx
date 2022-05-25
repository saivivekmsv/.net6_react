import React from "react";
import { render } from "@testing-library/react";
import FormButtonGroup from "./FormButtonGroup";
import { yesNoOptions } from "../../utils";

describe("FormButtonGroup", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(<FormButtonGroup options={yesNoOptions} />);
    expect(baseElement).toMatchSnapshot();
  });
});
