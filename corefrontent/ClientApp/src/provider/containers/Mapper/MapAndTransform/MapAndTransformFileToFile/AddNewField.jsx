import React, { useState } from "react";
import {
  FieldButtonGroup,
  SliderPanel,
  SearchList,
  FieldDropSide,
  SearchableList,
  SearchDrop,
  FieldInput,
} from "../../../../components";
import { Field, Formik, ErrorMessage } from "formik";
import { Form, Button } from "react-bootstrap";

const dataTypeOptions = [
  { value: 1, label: "String" },
  { value: 2, label: "Number" },
  { value: 4, label: "Date" },
];

const dateFormats = [
  { value: 0, label: "MM-DD-YYYY" },
  { value: 1, label: "DD-MM-YYYY" },
  { value: 2, label: "YYYY-MM-DD" },
];

const pickDataFromOptions = [
  { value: 0, label: "Direct Fields" },
  { value: 1, label: "Collection Fields" },
];

function AddNewField({ isOpen, setisOpen }) {
  const [pickDataFromState, setpickDataFromState] = useState(0);
  return (
    <div>
      <SliderPanel
        isOpen={isOpen}
        size="50"
        onClose={() => {}}
        showCancel={false}
      >
        <div className="d-flex justify-content-between align-baseline">
          <div>
            <p className="investment-heading">Add New Field</p>
          </div>
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                setisOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="ml-4"
              onClick={() => {
                //   setSave(values, itemConfigure);
                //   onCancel();
                setisOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <hr />

        <Field
          isRequired
          name="Pick data from"
          label="Pick data from"
          size="md"
          className="bg-transparent p-0"
          options={pickDataFromOptions}
          selectedValue={pickDataFromState}
          onChange={(value) => {
            // setApplyFilter(value);
            setpickDataFromState(value);
          }}
          component={FieldButtonGroup}
        />
        {/* pick data from Direct Fields */}
        {pickDataFromState == 0 && (
          <div>
            <Field
              type="text"
              name={"Field Label"}
              // value={"Field Label"}
              placeholder={"Enter the field label name"}
              label={"Field Label"}
              component={FieldInput}
              isRequired
            />

            <Field
              type="text"
              name={"Length"}
              // value={0}
              placeholder={"Enter the length"}
              label={"Length"}
              component={FieldInput}
              isRequired
            />

            <Field
              name={"Data type"}
              label={"Data type"}
              // value={1}
              options={dataTypeOptions}
              isRequired
              direction={"bottom"}
              disabled={false}
              popupContent={
                <SearchableList
                  label={"Data type"}
                  isNotTypeAhead
                  options={dataTypeOptions}
                  onSelect={() => {}}
                  selectedValue={1}
                />
              }
              component={FieldDropSide}
            />

            <Field
              name={"Format"}
              label={"Format"}
              // value={0}
              options={dateFormats}
              isRequired
              direction={"bottom"}
              disabled={false}
              popupContent={
                <SearchableList
                  label={"Format"}
                  isNotTypeAhead
                  options={dateFormats}
                  onSelect={() => {}}
                  selectedValue={1}
                />
              }
              component={FieldDropSide}
            />
          </div>
        )}

        {/* pick data from Collection Fields */}
        {pickDataFromState == 1 && (
          <div>
            <Field
              type="text"
              name={"Field Header Label"}
              // value={0}
              placeholder={"Enter the field header length"}
              label={"Field Header Label"}
              component={FieldInput}
              isRequired
            />

            <Field
              type="Field Value"
              name={"Length"}
              // value={0}
              placeholder={"Enter field value"}
              label={"Field Value"}
              component={FieldInput}
              isRequired
            />

            <Field
              type="text"
              name={"Effective Start Date"}
              // value={0}
              placeholder={"Enter effective start date"}
              label={"Effective Start Date"}
              component={FieldInput}
              isRequired
            />

            <Field
              type="text"
              name={"Effective End Date"}
              // value={0}
              placeholder={"Enter effective end date"}
              label={"Effective End Date"}
              component={FieldInput}
              isRequired
            />
          </div>
        )}
      </SliderPanel>
    </div>
  );
}

export default AddNewField;
