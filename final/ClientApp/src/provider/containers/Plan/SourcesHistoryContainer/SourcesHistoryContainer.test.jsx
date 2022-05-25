import React from "react";
import { render } from "@testing-library/react";

import { BrowserRouter as Router } from "react-router-dom";
import SourcesHistoryContainer from "./SourcesHistoryContainer";
import useRequest from "../../../abstracts/useRequest";
import sourcesEffectiveDateHistory from "../../../mocks/sourcesEffectiveDateHistory.json";
import { CreatePlanProvider } from "../../../contexts";

jest.mock("../../../abstracts/useRequest", () =>
  jest.fn(() => {
    return {
      response: [],
      loading: true,
    };
  })
);

describe("SourcesHistoryContainer - sprint 4", () => {
  test("Should match snapshot with table", () => {
    useRequest.mockReturnValue({
      response: sourcesEffectiveDateHistory,
      loading: false,
    });
    const props = {};

    const wrapper = render(
      <CreatePlanProvider>
        <Router>
          <SourcesHistoryContainer {...props} />
        </Router>
      </CreatePlanProvider>
    );
    const tableBody = wrapper.container.querySelectorAll(".table-body");
    const tableHeadCell = wrapper.container.querySelectorAll(
      ".table-head-cell"
    );
    expect(tableBody.length).toBe(1);
    expect(tableHeadCell.length).toBe(4);
    expect(useRequest).toBeCalled();
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});
