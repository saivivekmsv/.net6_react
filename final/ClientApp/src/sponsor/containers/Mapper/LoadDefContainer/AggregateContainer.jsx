import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import CategorySelectionContainer from "./CategorySelectionContainer";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import SelectFields from "./SelectFields";
import sampleData from "./sampleData";
import AggregateKeys from "./AggregateKeys";
// import "./loadDef.css";

const initialValues = [];

const AggregateContainer = (props) => {
  let [fields, setfields] = useState(sampleData);
  const [selectFields, setselectFields] = useState(false);

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
    },
  ];

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formProps) => {
        const {
          handleChange,
          setFieldValue,
          handleSubmit,
          setValues,
          setTouched,
          values,
          setSubmitting,
          ...rest
        } = formProps;

        return (
          <ManageMapperLayout buttons={buttons}>
            <div className="load-container">
              <AggregateKeys
                setselectFields={setselectFields}
                fields={fields}
                setfields={setfields}
              />
              <CategorySelectionContainer />
              <div
                id="fade-in-aggcontainer"
                className={
                  "border rounded px-3 bg-white " +
                  (() => (selectFields ? "show" : "box"))()
                }
              >
                <SelectFields
                  setselectFields={setselectFields}
                  fields={fields}
                  setfields={setfields}
                  selectFields={selectFields}
                />
              </div>
            </div>
          </ManageMapperLayout>
        );
      }}
    </Formik>
  );
};

export default AggregateContainer;
