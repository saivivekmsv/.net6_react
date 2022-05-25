import React from "react";
import { Formik, Field } from "formik";
import { Form, Button } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import {
  FieldInput,
  SearchableList,
  FieldDropSide,
  SliderPanel,
} from "../../../components";
const initialValues = [];

const dataTypes = [
  {
    label: "string",
    value: 1,
  },
  {
    value: 2,
    label: "number",
  },
  {
    value: 3,
    label: "date",
  },
];

const fields = {
  customField: "customFieldName",
  length: "length",
  dataType: "dataType",
};
export const AddCustomFields = (props) => {
  const {
    addFieldSlider,
    onCancel,
    setCustomFields,
    setFieldSlider,
    customFields,
  } = props;

  return (
    <Formik
      initialValues={{ ...initialValues }}
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

        const saveCustomField = () => {
          const customField = {
            label: get(values, "customFieldName"),
            length: get(values, "length"),
            dataType: dataTypes.find((e) => e.value === get(values, "dataType"))
              .label,
          };
          setCustomFields([...customFields, customField]);
          setFieldSlider(false);
        };

        return (
          <SliderPanel
            isOpen={addFieldSlider}
            size="35"
            onClose={() => onCancel()}
            showCancel={false}
          >
            <div className="inside-content">
              <div className="d-flex justify-content-between align-baseline">
                <div>
                  <p className="investment-heading">Add New Field</p>
                </div>
                <div>
                  <Button variant="secondary" onClick={() => onCancel()}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="ml-4"
                    onClick={saveCustomField}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className="break-bar"></div>
              <Form
                autoComplete="off"
                className="h-100"
                onSubmit={handleSubmit}
                validated={!isEmpty(rest.errors)}
              >
                <div className="mt-3">
                  <Field
                    size="md"
                    isRequired
                    name={fields.customField}
                    label="Label Name"
                    component={FieldInput}
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  <Field
                    size="md"
                    isRequired
                    name={fields.length}
                    label="Length"
                    component={FieldInput}
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  <Field
                    label="Data Type"
                    size="md"
                    isRequired
                    placeholder="Select Data Type"
                    name={fields.dataType}
                    direction="right"
                    options={dataTypes}
                    value={values[fields.dataType]}
                    popupContent={
                      <SearchableList
                        label="Select Data Type"
                        options={dataTypes}
                        onSelect={(value) =>
                          setFieldValue(fields.dataType, value)
                        }
                        selectedValue={values[fields.dataType]}
                        name={fields.dataType}
                        isNotTypeAhead
                        isRadio
                      />
                    }
                    component={FieldDropSide}
                  />
                </div>
              </Form>
            </div>
          </SliderPanel>
        );
      }}
    </Formik>
  );
};
