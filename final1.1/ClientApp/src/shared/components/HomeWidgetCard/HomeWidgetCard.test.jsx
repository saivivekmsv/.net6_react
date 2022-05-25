import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HomeWidgetCard from "./HomeWidgetCard";

describe("HomeWidgetCard", () => {
  const props = {
    name: "Plan",
    count: 270,
    onAddClick: () => {},
  };
  test("to match snapshot active", () => {
    const { baseElement } = render(
      <Router>
        <HomeWidgetCard {...props} />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot disabled", () => {
    const { baseElement } = render(
      <Router>
        <HomeWidgetCard {...props} isDisabled />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot loading", () => {
    const { baseElement } = render(
      <Router>
        <HomeWidgetCard {...props} isLoading />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot showAdd", () => {
    const { baseElement } = render(
      <Router>
        <HomeWidgetCard {...props} showAdd />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test("to match snapshot no count", () => {
    const { baseElement } = render(
      <Router>
        <HomeWidgetCard {...props} showAdd count="" />
      </Router>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
