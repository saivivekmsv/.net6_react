import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import AddCompanyItemsLayout from "./AddCompanyItemsLayout";

describe("AddCompanyItemsLayout", () => {
  const props = {
    content: (
      <>
        line1 <br /> line2
      </>
    ),
    buttonLabel: "Add New classification",
    link: "/",
  };
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Router>
        <AddCompanyItemsLayout {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
