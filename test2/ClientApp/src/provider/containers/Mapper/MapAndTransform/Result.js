import React, { useEffect } from "react";
import { Field } from "formik";
import { FieldInput } from "../../../components";
import { isEmpty } from "lodash";
export const Result = (props) => {
  const { values, index, setFieldValue, functionView, datum, touched } = props;
  useEffect(
    () => {
      if (!isEmpty(values[`fieldOperations[${index}].function`])) {
        isEmpty(values[`fieldOperations[${index}].result`])
          ? values[`fieldOperations[${index}]`].length > 1 &&
            values[`fieldOperations[${index}]`].length < 3
            ? setFieldValue(
                `fieldOperations[${index}].result`,
                functionView(
                  values[`fieldOperations[${index}].function`],
                  datum,
                  values[`fieldOperations[${index}].code0`]
                )
              )
            : setFieldValue(
                `fieldOperations[${index}].result`,
                functionView(
                  values[`fieldOperations[${index}].function`],
                  datum,
                  values[`fieldOperations[${index}].code0`],
                  values[`fieldOperations[${index}].code1`]
                )
              )
          : setFieldValue(
              `fieldOperations[${index}].result`,
              functionView(values[`fieldOperations[${index}].function`], datum)
            );
      }
    },
    [
      touched[`fieldOperations[${index}].function`],
      touched[`fieldOperations[${index}].code0`],
      touched[`fieldOperations[${index}].code1`],
      datum,
    ],
    values
  );
  return (
    <Field
      name={`fieldOperations[${index}].result`}
      type="text"
      isRequired
      label="Result"
      size="sm"
      disabled
      value={values[`fieldOperations[${index}].result`]}
      component={FieldInput}
    />
  );
};
