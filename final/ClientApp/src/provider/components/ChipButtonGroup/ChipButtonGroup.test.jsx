import React from "react";
import { render } from "@testing-library/react";
import ChipButtonGroup from "./ChipButtonGroup";
import chipbuttons from "../../mocks/chipbuttons.json";

describe("ChipButtonGroup", () => {
  const props = { buttonList: chipbuttons.data };
  test("to match snapshot", () => {
    const { baseElement } = render(<ChipButtonGroup {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
