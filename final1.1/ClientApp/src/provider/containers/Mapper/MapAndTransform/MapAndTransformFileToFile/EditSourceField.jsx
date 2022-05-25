import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
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

function EditSourceField({
  fieldHeader,
  dataType,
  isOpen = false,
  setisOpen,
  fields,
  setfields,
  index,
}) {
  const [newDataType, setnewDataType] = useState(dataType);
  const [newFieldHeader, setnewFieldHeader] = useState(fieldHeader);
  const [dateFormatValue, setdateFormatValue] = useState(null);

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
            <p className="investment-heading">Edit Source Field</p>
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
                let tempfields = [...fields];
                tempfields[index].field = newFieldHeader;
                tempfields[index].dataType = newDataType;
                tempfields[index]["Date Format"] = dateFormatValue;
                setfields(tempfields);
                setisOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <hr />

        <Field
          type="text"
          name={newFieldHeader}
          value={newFieldHeader}
          placeholder={"Enter the field name"}
          label={"Field Header"}
          onChange={(e) => {
            setnewFieldHeader(e.target.value);
          }}
          component={FieldInput}
          isRequired
        />
        <Field
          name={"Data type"}
          label={"Data type"}
          value={newDataType}
          options={dataTypeOptions}
          // onChange={(e)=>{setnewDataType(e.target.value)}}
          isRequired
          direction={"bottom"}
          disabled={false}
          popupContent={
            <SearchableList
              label={"Data type"}
              isNotTypeAhead
              options={dataTypeOptions}
              onSelect={(e) => {
                setnewDataType(e);
              }}
              selectedValue={newDataType}
            />
          }
          component={FieldDropSide}
        />
        {newDataType == 4 && (
          <Field
            name={"Format"}
            label={"Format"}
            value={dateFormatValue}
            options={dateFormats}
            isRequired
            direction={"bottom"}
            disabled={false}
            popupContent={
              <SearchableList
                label={"Format"}
                isNotTypeAhead
                options={dateFormats}
                onSelect={(e) => {
                  setdateFormatValue(e);
                }}
                selectedValue={dateFormatValue}
              />
            }
            component={FieldDropSide}
          />
        )}
      </SliderPanel>
    </div>
  );
}

export default EditSourceField;
