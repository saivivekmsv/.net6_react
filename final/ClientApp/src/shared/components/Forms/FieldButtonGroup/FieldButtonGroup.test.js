import React from "react";
import { render } from "@testing-library/react";
import { Formik, Field } from "formik";
import FieldButtonGroup from "./FieldButtonGroup";
import { yesNoOptions, required } from "../../../utils";

describe("FieldButtonGroup - sprint 4", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Formik>
        {() => (
          <Field
            name="companyType"
            isRequired
            label="Company type"
            options={yesNoOptions}
            selectedValue={true}
            component={FieldButtonGroup}
            validate={required}
          />
        )}
      </Formik>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
