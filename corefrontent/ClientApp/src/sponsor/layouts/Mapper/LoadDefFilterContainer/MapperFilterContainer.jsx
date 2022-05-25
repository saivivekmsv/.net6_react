import { FieldArray, Formik, Field } from "formik";
import { Form, Card } from "react-bootstrap";
import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import FilterSource from "./FilterSource";
import sampleData from "./sampleData";
import "../../../styles/containers/MapperLoadDefinitionFilter.scss";
import Select from "react-select";
import {
  FieldButtonGroup,
  FieldDropSide,
  DatePicker,
} from "../../../../shared/components";
import { usDateFormat } from "../../../../shared/utils";

const MapperFilterCondition = (props) => {
  const [applyFilter, setApplyFilter] = useState(true);
  const [optCont, setOptCont] = useState(false);
  const [selopt, setSelopt] = useState(null);

  const [FilterConditionFields, setFilterConditionFields] = useState(
    sampleData.map((item) => {
      if (item.dataType == "String") {
        return {
          ...item,
          options: [
            [
              "Is Not Null",
              "Is Null",
              "Is equal to",
              "Contains",
              "Starts With",
              "Ends With",
              "In",
              "Length Equal to",
              "Length Greater than",
              "Length Lesser than",
              "Length Greater than or equal to",
              "Length Lesser than or equal to",
              "Greater than",
              "Lesser than",
              "Greater than or equal to",
              "Lesser than or equal to",
            ],
          ],
        };
      } else if (item.dataType == "Numeric") {
        return {
          ...item,
          options: [
            [
              "Is Not Null",
              "Is Null",
              "Is equal to",
              "Length Equal to",
              "Length Greater than",
              "Length Lesser than",
              "Length Greater than or equal to",
              "Length Lesser than or equal to",
              "Greater than",
              "Lesser than",
              "Greater than or equal to",
              "Lesser than or equal to",
              "Between",
            ],
          ],
          From: "",
          To: "",
        };
      } //selectOption - is for selecting the Operation and selectCustomOption is for selecting custom Operation.
      else if (item.dataType == "Date") {
        return {
          ...item,
          options: [
            [
              "Is Not Null",
              "Is Null",
              "Is equal to",
              "Greater than",
              "Lesser than",
              "Greater than or equal to",
              "Lesser than or equal to",
              "Between",
            ],
          ],
          From: "",
          To: "",
        };
      } else {
        return item;
      }
    })
  );

  const toOptionValuesFromMapper = (obj) => {
    return Object.keys(obj).map((key) => ({
      label: obj[key],
      value: !isNaN(key) ? parseInt(key, 10) : key,
    }));
  };

  const AlterOnClick = () => {
    setApplyFilter(!applyFilter);
  };

  const onSubmit = async (values) => {
    console.log(values);
  };

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

  const yesNoOptions = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];

  return (
    <Formik
      initialValues={FilterConditionFields}
      onSubmit={onSubmit}
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

        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };
        return (
          <Form>
            <ManageMapperLayout buttons={buttons} layoutHeader="Filter">
              <div>
                <div
                  style={{
                    display: "block",
                    font: "Poppins",
                    fontSize: "18px",
                    fontWeight: "500",
                    alignItems: "center",
                    paddingBottom: "0",
                  }}
                >
                  <div style={{ paddingBottom: "0.5rem", color: "#494F5A" }}>
                    Apply Filter
                  </div>
                  <div style={{ display: "flex" }}>
                    <Field
                      isRequired
                      name="Apply filter"
                      size="md"
                      className="bg-transparent p-0"
                      options={yesNoOptions}
                      selectedValue={applyFilter}
                      onChange={(value) => {
                        setApplyFilter(value);
                      }}
                      component={FieldButtonGroup}
                    />
                  </div>
                </div>
              </div>
              {applyFilter ? (
                <div style={{ display: "flex" }}>
                  <FilterSource
                    data={sampleData}
                    fields={FilterConditionFields}
                    setfields={setFilterConditionFields}
                  />
                  <div className="FilterConditionContainer">
                    <div className="FilterConditionTitleText">
                      Selected Filter Condition
                    </div>
                    <div
                      style={{
                        border: "1px solid #E5E5E5",
                        display: "flex",
                        borderRadius: "5px",
                      }}
                    >
                      <div className="FilterList">
                        <FieldArray name="info">
                          {() =>
                            FilterConditionFields.map((item, index) => {
                              return item.selected ? (
                                <>
                                  <Card
                                    className={
                                      selopt == item.id
                                        ? "FTargetCard-selected"
                                        : "FTargetCard-normal"
                                    }
                                    id={item.id}
                                    onClick={() => {
                                      setOptCont(true);
                                      let newfields = [
                                        ...FilterConditionFields,
                                      ];
                                      newfields[index]["filterSelect"] = true;
                                      setFilterConditionFields(newfields);
                                      setSelopt(item.id);
                                    }}
                                  >
                                    <div className="FTitle"> {item.field}</div>
                                  </Card>
                                  {item.filterSelect && selopt == item.id && (
                                    <div className="OptionContainer">
                                      <div className="OptTitle">
                                        Filter Options
                                      </div>
                                      <div className="ConTitle">Condition</div>
                                      <div
                                        key={selopt.id}
                                        style={{
                                          width: "20rem",
                                          fontSize: "14px",
                                          font: "Poppins",
                                          fontWeight: "400",
                                          paddingBottom: "1rem",
                                        }}
                                      >
                                        <Select
                                          name={item.field}
                                          options={toOptionValuesFromMapper(
                                            item.options[0]
                                          )}
                                          components={{
                                            IndicatorSeparator: () => null,
                                          }}
                                          isSearchable={false}
                                          placeholder={
                                            <div className="select-placeholder-text">
                                              {item.firstchoice}
                                            </div>
                                          }
                                          onChange={(selectedOption) => {
                                            // let event = {
                                            //   target: {
                                            //     name: item.field,
                                            //     value: selectedOption
                                            //   },
                                            // };
                                            // handleChange(event);
                                            let newfields = [
                                              ...FilterConditionFields,
                                            ];
                                            newfields[index]["firstchoice"] =
                                              selectedOption.label;
                                            setFilterConditionFields(newfields);
                                          }}
                                        />
                                        {/* <FilterDropdown 
                                               data = {toOptionValuesFromMapper(item.options[0])}
                                               setSelectedOptn= {item.firstchoice}
                                            /> */}
                                        {!(
                                          item.firstchoice == "Is Null" ||
                                          item.firstchoice == "Is Not Null" ||
                                          item.firstchoice == ""
                                        ) ? (
                                          !(item.dataType == "Date") ? (
                                            !(item.firstchoice == "Between") ? (
                                              <div>
                                                <>
                                                  <div className="ConTitle">
                                                    Input
                                                  </div>
                                                </>
                                                <Field
                                                  type="text"
                                                  name={`${index}.selectedFilter`}
                                                  values={`values[${index}].selectedFilter`}
                                                  className="FInputs"
                                                />
                                                <div>
                                                  {/* {values[index].selectedFilter} */}
                                                </div>
                                              </div>
                                            ) : (
                                              <div>
                                                <>
                                                  <div className="ConTitle">
                                                    From
                                                  </div>
                                                </>
                                                <Field
                                                  type="text"
                                                  name={`${index}.From`}
                                                  values={`values[${index}].From`}
                                                  className="FInputs"
                                                />
                                                <div className="ConTitle">
                                                  To
                                                </div>
                                                <Field
                                                  type="text"
                                                  name={`${index}.To`}
                                                  values={`values[${index}].To`}
                                                  className="FInputs"
                                                />
                                              </div>
                                            )
                                          ) : !(
                                              item.firstchoice == "Between"
                                            ) ? (
                                            <div>
                                              <div className="ConTitle">
                                                Select date
                                              </div>
                                              <Field
                                                name={`${index}.selectedFilter`}
                                                isRequired
                                                size="sm"
                                                value={usDateFormat(
                                                  item.selectedFilter
                                                )}
                                                onClear={() =>
                                                  setFieldValue(
                                                    `${index}.selectedFilter`,
                                                    null
                                                  )
                                                }
                                                popupContent={
                                                  <DatePicker
                                                    onDayClick={(value) => {
                                                      onDaySelected(
                                                        `${index}.selectedFilter`,
                                                        value
                                                      );
                                                      item.selectedFilter = value;
                                                      let newfields = [
                                                        ...FilterConditionFields,
                                                      ];
                                                      newfields[index][
                                                        "selectedFilter"
                                                      ] = usDateFormat(value);
                                                      setFilterConditionFields(
                                                        newfields
                                                      );
                                                    }}
                                                    value={
                                                      values[
                                                        `${index}.selectedFilter`
                                                      ]
                                                    }
                                                  />
                                                }
                                                component={FieldDropSide}
                                              />
                                            </div>
                                          ) : (
                                            <div>
                                              <div className="ConTitle">
                                                From
                                              </div>
                                              <Field
                                                name={`${index}.From`}
                                                isRequired
                                                size="sm"
                                                value={usDateFormat(item.From)}
                                                onClear={() =>
                                                  setFieldValue(
                                                    `${index}.From`,
                                                    null
                                                  )
                                                }
                                                popupContent={
                                                  <DatePicker
                                                    onDayClick={(value) => {
                                                      onDaySelected(
                                                        `${index}.From`,
                                                        value
                                                      );
                                                      item.From = value;
                                                      let newfields = [
                                                        ...FilterConditionFields,
                                                      ];
                                                      newfields[index][
                                                        "From"
                                                      ] = usDateFormat(value);
                                                      setFilterConditionFields(
                                                        newfields
                                                      );
                                                    }}
                                                    value={
                                                      values[`${index}.From`]
                                                    }
                                                  />
                                                }
                                                component={FieldDropSide}
                                              />
                                              <div className="ConTitle">To</div>
                                              <Field
                                                name={`${index}.To`}
                                                isRequired
                                                size="sm"
                                                value={usDateFormat(item.To)}
                                                onClear={() =>
                                                  setFieldValue(
                                                    `${index}.To`,
                                                    null
                                                  )
                                                }
                                                popupContent={
                                                  <DatePicker
                                                    onDayClick={(value) => {
                                                      onDaySelected(
                                                        `${index}.To`,
                                                        value
                                                      );
                                                      item.To = value;
                                                      let newfields = [
                                                        ...FilterConditionFields,
                                                      ];
                                                      newfields[index][
                                                        "To"
                                                      ] = usDateFormat(value);
                                                      setFilterConditionFields(
                                                        newfields
                                                      );
                                                    }}
                                                    value={
                                                      values[`${index}.To`]
                                                    }
                                                  />
                                                }
                                                component={FieldDropSide}
                                              />
                                            </div>
                                          )
                                        ) : (
                                          <> </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <> </>
                              );
                            })
                          }
                        </FieldArray>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="FilterUnavailable"> Filter not applied</div>
                </>
              )}
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            </ManageMapperLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default MapperFilterCondition;
