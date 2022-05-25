import React, { useState } from "react";
import { Formik, Field } from "formik";
import { Form, Button } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/pro-light-svg-icons";
import {
  FieldInput,
  SearchableList,
  FieldDropSide,
  SliderPanel,
  FieldButtonGroup,
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
  Operations: "Operation",
  CustomOperations: "CustomOperations",
};
export const CustomAggregateFunction = (props) => {
  const {
    CAFSlider,
    onCancel,
    setFields,
    setCAFSlider,
    Fields,
    selectedItem,
  } = props;

  const [CurrentField, setCurrentField] = useState(Fields[selectedItem]);
  const toOptionValuesFromMapper = (obj) => {
    return obj.map((elem) => ({
      label: elem,
      value: elem,
    }));
  };

  const toGetOptions = (elem) => {
    if (Fields[elem].type == 1) {
      return [["First", "Last"], []];
    } else if (Fields[elem].type == 2) {
      return [
        ["First", "Last", "Custom"],
        ["Min", "Max", "Avg", "Sum"],
      ];
    } else if (Fields[elem].type == 4) {
      return [
        ["First", "Last", "Custom"],
        ["Min", "Max"],
      ];
    } else {
      return [[], []];
    }
  };

  const cardDisplay = (item) => {
    return (
      <Card className="category-selection-cardSolo mt-4">
        <div className="category-selection-titleField">
          {item.fieldName.substring(1)}
        </div>
        <div className="category-selection-icon">
          <FontAwesomeIcon icon={faCog} />
        </div>
        <div
          className="category-selection-cardType"
          style={{ overflow: "visible" }}
        >
          {item.dataType}
        </div>
        <div className="category-selection-exampleData">
          {item.datum}
          {/* The variable to be substituted with the example data obtained from backend */}
        </div>
        <div className="category-selection-category">
          {item.operation.trim() != "" ? item.operation : "not found"}
          {/* Aggregate Category to be displayed over here */}
        </div>
      </Card>
    );
  };

  return (
    <SliderPanel
      isOpen={CAFSlider}
      size="35"
      onClose={() => onCancel()}
      showCancel={false}
    >
      <div className="inside-content">
        <div className="d-flex justify-content-between align-baseline">
          <div>
            <p className="investment-heading">Configure Aggregate Function</p>
          </div>
          <div>
            <Button variant="secondary" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="ml-4"
              onClick={() => {
                let temp = [...Fields];
                temp[selectedItem] = CurrentField;
                props.setFieldValue("aggregationOperationEntities", temp);
                setCAFSlider(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="break-bar"></div>
        {cardDisplay(CurrentField)}
        <Form autoComplete="off" className="h-100 my-2" onSubmit={() => {}}>
          <Field
            isRequired
            name={fields.Operations}
            label={"Operations"}
            placeholder="Operations"
            options={toOptionValuesFromMapper(toGetOptions(selectedItem)[0])}
            selectedValue={CurrentField.operation.split("-")[0]}
            // value={}
            type="text"
            autoComplete="off"
            // value={values[fields.category]}
            onChange={(value) => {
              // Fields[selectedItem].operation=value
              setCurrentField({ ...CurrentField, operation: value });
            }}
            component={FieldButtonGroup}
          />
          {toGetOptions(selectedItem)[1].length != 0 &&
          CurrentField &&
          CurrentField.operation.split("-")[0].trim() == "Custom" ? (
            <Field
              isRequired
              name={fields.CustomOperations}
              label={"Custom"}
              placeholder="Custom"
              options={toOptionValuesFromMapper(toGetOptions(selectedItem)[1])}
              selectedValue={CurrentField.operation.split("-")[1]}
              type="text"
              autoComplete="off"
              // value={values[fields.category]}
              onChange={(value) => {
                // Fields[selectedItem].operation=Fields[selectedItem].operation+'-'+value
                let temp = { ...CurrentField };
                temp.operation = temp.operation.split("-")[0] + "-" + value;
                setCurrentField(temp);
              }}
              component={FieldButtonGroup}
            />
          ) : (
            <></>
          )}
        </Form>
      </div>
    </SliderPanel>
  );
};
