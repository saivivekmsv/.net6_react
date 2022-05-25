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
    FieldButtonGroup
} from "../../../../shared/components";
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

    const [CurrentField, setCurrentField] = useState(Fields[selectedItem])
    const toOptionValuesFromMapper = (obj) => {
        return Object.keys(obj).map((key) => ({
            label: obj[key],
            value: !isNaN(key) ? parseInt(key, 10) : key,
        }));
    };

    const cardDisplay = (item) => {
        return (
            <Card className="category-selection-cardSolo mt-4">
                <div className="category-selection-titleField">{item.label}</div>
                <div className="category-selection-icon">
                    <FontAwesomeIcon icon={faCog} />
                </div>
                <div className="category-selection-cardType" style={{overflow:'visible'}}>{item.dataType}</div>
                <div className="category-selection-exampleData">
                    {item.length}
                    {/* The variable to be substituted with the example data obtained from backend */}
                </div>
                <div className="category-selection-category">
                    {item["options"] ? item["options"][0][item['selectedOption']] : 'not found'}
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
                                            let temp_Fields = [...Fields];
                                            temp_Fields[selectedItem] = CurrentField;
                                            setFields(temp_Fields);
                                            setCAFSlider(false);
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                            <div className="break-bar"></div>
                            {cardDisplay(CurrentField)}
                            <Form
                                autoComplete="off"
                                className="h-100 my-2"
                                onSubmit={()=>{}}
                            >
                                <Field
                                    isRequired
                                    name={fields.Operations}
                                    label={"Operations"}
                                    placeholder="Operations"
                                    options={toOptionValuesFromMapper(
                                        CurrentField.options[0]
                                    )}
                                    selectedValue={CurrentField.selectedOption}
                                    // value={}
                                    type="text"
                                    autoComplete="off"
                                    // value={values[fields.category]}
                                    onChange={(value) => {
                                        let temp_Field = { ...CurrentField }
                                        temp_Field.selectedOption = value
                                        setCurrentField(temp_Field)
                                    }}
                                    component={FieldButtonGroup}
                                />
                                {CurrentField.options[0][CurrentField.selectedOption] == 'Custom' ?
                                    <Field
                                    isRequired
                                        name={fields.CustomOperations}
                                        label={"Custom"}
                                        placeholder="Custom"
                                        options={toOptionValuesFromMapper(
                                            CurrentField.options[1]
                                        )}
                                        selectedValue={CurrentField.selectedCustomOption}
                                        type="text"
                                        autoComplete="off"
                                        // value={values[fields.category]}
                                        onChange={(e) => {
                                            let temp_field = { ...CurrentField }
                                            temp_field.selectedCustomOption = e
                                            setCurrentField(temp_field)
                                        }}
                                        component={FieldButtonGroup}
                                    /> : <></>}
                           </Form>
                        </div>
                    </SliderPanel>
                
    );
};
