import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { BrowserRouter as Router } from "react-router-dom";
import CompanyContainer from "./CompanyContainer";
import useRequest from "../../abstracts/useRequest";
import sponsoringOrganisation from "../../mocks/sponsoringOrganisation.json";
import companies from "../../mocks/companies.json";

jest.mock("../../abstracts/useRequest", () =>
  jest.fn(() => {
    return {
      response: [],
      loading: true,
    };
  })
);

describe("CompanyContainer", () => {
  test("Expect to match snapshots", () => {
    const wrapper = render(
      <Router>
        <CompanyContainer />
      </Router>
    );
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test("Render generic table", () => {
    useRequest
      .mockReturnValueOnce({
        response: 40,
      })
      .mockReturnValueOnce({
        response: sponsoringOrganisation,
        loading: false,
      })
      .mockReturnValue({
        response: companies,
        loading: false,
      });
    const props = { handleSort: jest.fn() };

    const wrapper = render(
      <Router>
        <CompanyContainer {...props} />
      </Router>
    );
    expect(wrapper.baseElement).toMatchSnapshot();
    const tableBody = wrapper.container.querySelectorAll(".table-body");
    const tableHeadCell = wrapper.container.querySelectorAll(
      ".table-head-cell"
    );
    expect(tableBody.length).toBe(1);
    expect(tableHeadCell.length).toBe(6);

    fireEvent.click(tableHeadCell[0]);
    fireEvent.scroll(tableBody[0], { target: { scrollY: 1000 } });
    expect(useRequest).toBeCalled();
  });

  test("Render sponsoring org table", () => {
    useRequest
      .mockReturnValueOnce({
        response: 40,
      })
      .mockReturnValueOnce({
        response: companies,
        loading: false,
      })
      .mockReturnValue({
        response: sponsoringOrganisation,
        loading: false,
      });

    const wrapper = render(
      <Router>
        <CompanyContainer />
      </Router>
    );
    const sponsorOrgChipButton = wrapper.container.querySelector(
      "#chip-buttons-3"
    );
    fireEvent.click(sponsorOrgChipButton);

    const firstHeadCell = wrapper.container.querySelector(".table-head-cell");
    fireEvent.click(firstHeadCell);

    expect(wrapper.baseElement).toMatchSnapshot();
    const sponsoredOrgItem = wrapper.container.querySelector(
      ".sponsored-org-item"
    );

    fireEvent.click(sponsoredOrgItem);

    const searchBox = wrapper.container.querySelector("#company-search-box");
    fireEvent.change(searchBox, {
      target: {
        value: "asdsa",
      },
    });
  });
});
