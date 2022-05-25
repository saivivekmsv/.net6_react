import React from "react";
import { render } from "@testing-library/react";
import Error from "./Error";

test("renders learn react link", () => {
  const wrapper = render(<Error />);
  expect(wrapper.baseElement).toMatchSnapshot();
});
