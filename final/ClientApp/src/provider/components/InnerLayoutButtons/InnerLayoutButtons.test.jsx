import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { ROUTES, FLOW_TYPES } from "../../utils";
import InnerLayoutButtons from "./InnerLayoutButtons";

describe("InnerLayoutButtons", () => {
  [FLOW_TYPES.ADD, FLOW_TYPES.EDIT, FLOW_TYPES.SAVE].map((flow) =>
    test(`to match snapshot - ${flow}`, () => {
      const { baseElement } = render(
        <Router>
          <InnerLayoutButtons
            buttonsList={[
              {
                link: ROUTES.COMPANY,
                label: "Cancel",
                variant: "secondary",
                type: "button",
                flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
              },
              {
                label: "Add Company",
                variant: "primary",
                type: "submit",
                flow: [FLOW_TYPES.ADD],
              },
              {
                label: "",
                variant: "link",
                type: "button",
                flow: [FLOW_TYPES.EDIT],
                icon: faTimes,
              },
              {
                label: "",
                variant: "link",
                type: "button",
                flow: [FLOW_TYPES.EDIT],
                icon: faPencilAlt,
              },
              {
                label: "Save",
                variant: "primary",
                type: "submit",
                flow: [FLOW_TYPES.SAVE],
              },
            ]}
            flow={flow}
          />
        </Router>
      );
      expect(baseElement).toMatchSnapshot();
    })
  );
});
