import React from "react";
import { render } from "@testing-library/react";
import { Formik, Field } from "formik";
import FieldInput from "./FieldInput";
import { required } from "../../../utils";

describe("FieldInput - sprint 4", () => {
  test("to match snapshot", () => {
    const { baseElement } = render(
      <Formik>
        {() => (
          <form>
            <Field
              isRequired
              name="companyName"
              label="New company name"
              hasSuggestion
              type="text"
              autoComplete="none"
              value="121212"
              autoFocus
              component={FieldInput}
              validate={required}
            />
          </form>
        )}
      </Formik>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
