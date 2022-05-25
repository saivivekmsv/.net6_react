import React from "react";
import { render } from "@testing-library/react";
import { Formik, Field } from "formik";
import FieldTextarea from "./FieldTextarea";
import { required } from "../../../utils";

describe("FieldTextarea - sprint 4", () => {
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
              component={FieldTextarea}
              validate={required}
            />
          </form>
        )}
      </Formik>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
