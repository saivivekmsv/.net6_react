import React from "react";
import { render } from "@testing-library/react";
import LoaderWrapper from "./LoaderWrapper";

describe("LoaderWrapper", () => {
  const props = {};
  test("to match snapshot active", () => {
    const { baseElement } = render(<LoaderWrapper {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot disabled", () => {
    const { baseElement } = render(
      <LoaderWrapper {...props} isLoading>
        This is the content
      </LoaderWrapper>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
