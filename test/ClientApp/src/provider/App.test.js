import React from "react";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

test("full app rendering/navigating", () => {
  const history = createMemoryHistory();
  history.push("/home");
  render(
    <Router history={history}>
      <App />
    </Router>
  );
  expect(history.location.pathname).toBe("/home");
});
