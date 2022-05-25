import React from "react";
import { render } from "@testing-library/react";
import { Formik, Field } from "formik";
import { SponsoringOrgDropdown } from "../../";
import FieldDropSide from "./FieldDropSide";
import { required } from "../../../utils";
import sponsoringOrganisation from "../../../mocks/sponsoringOrganisation.json";

describe("FieldDropSide - sprint 4", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Formik>
        {() => (
          <Field
            isRequired
            label="Sponsoring organization"
            name="sponsoringOrganizationId"
            value={260}
            options={sponsoringOrganisation}
            popupContent={
              <SponsoringOrgDropdown data={sponsoringOrganisation} />
            }
            validate={required}
            component={FieldDropSide}
          />
        )}
      </Formik>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
