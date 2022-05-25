import React from "react";
import { render } from "@testing-library/react";
import UnderConstruction from "./UnderConstruction";

test("renders learn react link", () => {
  const wrapper = render(<UnderConstruction />);
  expect(wrapper.baseElement).toMatchSnapshot();
});
