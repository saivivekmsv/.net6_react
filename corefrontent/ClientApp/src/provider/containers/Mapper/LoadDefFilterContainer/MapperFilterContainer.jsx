import React, { useState, useContext, useEffect, useRef } from "react";
import { FieldArray, Formik, Field } from "formik";
import { useLocation, useParams } from "react-router-dom";
import { Form, Card } from "react-bootstrap";
import FilterSource from "./FilterSource";
import sampleData from "./sampleData";
import "../../../styles/containers/MapperLoadDefinitionFilter.scss";
import {
  FieldButtonGroup,
  FieldDropSide,
  DatePicker,
  SearchableList,
  FieldInput,
  ManageMapperLayout,
  LoaderWrapper,
} from "../../../components";
import { isEmpty, get, isNull } from "lodash";

import {
  manageMapperStore,
  UploadSourceFile,
  setManageMapperToastInfo,
  setManageMapperPageLevelData,
  setMapperPageLevelData,
  setManageMapperFlow,
} from "../../../contexts";
import {
  getPathWithParam,
  MANAGE_MAPPER_ROUTES,
  manageMapperFormNames,
  usDateFormat,
  FLOW_TYPES,
  ROUTES,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import { onFilterSave } from "../../../services";

const MapperFilterCondition = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(manageMapperStore);
  const location = useLocation();
  const { flow, profileId } = useRouterParams();
  const data = get(state, "api.data", []);
  const fileuploadData = get(state, "api.fileuploadData", []);
  const [applyFilter, setApplyFilter] = useState(false);
  const [optCont, setOptCont] = useState(false);
  const [selopt, setSelopt] = useState(null);
  const isFilterApplied = get(data, "isFilterApplied", false);
  // const isFilterApplied = true;
  const fieldHeadersJson = isEmpty(data)
    ? get(fileuploadData, "row")
    : get(data, "headerMapJson", []);
  const filterObjectJson =
    !isEmpty(get(data, "filterObjectJson", {})) &&
    JSON.parse(get(data, "filterObjectJson", {}));
  const [FilterConditionFields, setFilterConditionFields] = useState([]);
  const isEdit = flow === FLOW_TYPES.EDIT;
  let i = 0;
  const [controlVar, setControlVar] = useState(true);
  const ref1 = useRef(null);
  useEffect(() => {
    !isEmpty(FilterConditionFields) &&
      FilterConditionFields.map((item) => {
        if (i == 0 && controlVar && item.selected) {
          i = i + 1;
          setControlVar(false);
          setSelopt(item.id);
        }
      });
  });

  useEffect(() => {
    if (!isEmpty(get(state, formName, []))) {
      setApplyFilter(get(state, formName, []).isFilterApplied);
    } else {
      setApplyFilter(isFilterApplied);
    }
  }, [isFilterApplied]);

  //If filter is already applied
  useEffect(() => {
    if (!isEmpty(get(state, formName, []))) {
      const filterObjectJsonFromState = get(state, formName, [])
        .filterObjectJson
        ? JSON.parse(get(state, formName, []).filterObjectJson)
        : [];
      // console.log("1234get(state, formName, [])", get(state, formName, []))
      // setFilterConditionFields(filterObjectJsonFromState);
    } else {
      if (isFilterApplied && filterObjectJson && !isEdit) {
        setFilterConditionFields(filterObjectJson);
      }
      if (!isEdit && !isEmpty(fieldHeadersJson) && isEmpty(data)) {
        setFilterConditionFields(
          fieldHeadersJson
            .map((element, ind) => {
              return {
                order: element.order,
                field: element.fieldName.substring(1),
                id: element.order,
                dataType: element.type,
                selected: false,
                filterSelect: false,
                firstchoice: "",
                value: element.datum,
                selectedFilter: "",
              };
            })
            .map((item, index) => {
              if (item.dataType === 1) {
                return {
                  ...item,
                  options: [
                    [
                      "Is Not Null",
                      "Is Null",
                      "Between",
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
                  SimOpt: "",
                };
              } else if (item.dataType === 2) {
                return {
                  ...item,
                  options: [
                    [
                      "Is Not Null",
                      "Is Null",
                      "Between",
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
                    ],
                  ],
                  From: "",
                  To: "",
                  SimOpt: "",
                };
              } //selectOption - is for selecting the Operation and selectCustomOption is for selecting custom Operation.
              else if (item.dataType === 4) {
                return {
                  ...item,
                  options: [
                    [
                      "Is Not Null",
                      "Is Null",
                      "Between",
                      "Is equal to",
                      "Greater than",
                      "Lesser than",
                      "Greater than or equal to",
                      "Lesser than or equal to",
                    ],
                  ],
                  From: "",
                  To: "",
                  SimOpt: "",
                };
              } else {
                return item;
              }
            })
        );
      }
      if (isEmpty(filterObjectJson) && !isEmpty(data)) {
        setFilterConditionFields(
          JSON.parse(fieldHeadersJson) &&
            JSON.parse(fieldHeadersJson)
              .map((element, ind) => {
                return {
                  order: element.order,
                  field: element.fieldName.substring(1),
                  id: element.order,
                  dataType: element.type,
                  selected: false,
                  filterSelect: false,
                  firstchoice: "",
                  value: element.datum,
                  selectedFilter: "",
                };
              })
              .map((item, index) => {
                if (item.dataType === 1) {
                  return {
                    ...item,
                    options: [
                      [
                        "Is Not Null",
                        "Is Null",
                        "Between",
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
                    SimOpt: "",
                  };
                } else if (item.dataType === 2) {
                  return {
                    ...item,
                    options: [
                      [
                        "Is Not Null",
                        "Is Null",
                        "Between",
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
                      ],
                    ],
                    From: "",
                    To: "",
                    SimOpt: "",
                  };
                } //selectOption - is for selecting the Operation and selectCustomOption is for selecting custom Operation.
                else if (item.dataType === 4) {
                  return {
                    ...item,
                    options: [
                      [
                        "Is Not Null",
                        "Is Null",
                        "Between",
                        "Is equal to",
                        "Greater than",
                        "Lesser than",
                        "Greater than or equal to",
                        "Lesser than or equal to",
                      ],
                    ],
                    From: "",
                    To: "",
                    SimOpt: "",
                  };
                } else {
                  return item;
                }
              })
        );
      }
    }
  }, [
    filterObjectJson,
    isFilterApplied,
    fieldHeadersJson,
    isEdit,
    data,
    state,
  ]);

  //If filter is not already applied

  const toOptionValuesFromMapper = (obj) => {
    return Object.keys(obj).map((key) => ({
      label: obj[key],
      value: !isNaN(key) ? parseInt(key, 10) : key,
    }));
  };

  const formName = manageMapperFormNames.FILTER;

  const AlterOnClick = () => {
    setApplyFilter(!applyFilter);
  };

  const toSubmit = (values) => {
    const { history } = props;
    onFilterSave({
      ...data,
      isFilterApplied: applyFilter,
      filterObjectJson: JSON.stringify(ref1.current.values),
    }).then((res) => {
      if (!isEmpty(res)) {
        dispatch(
          setManageMapperToastInfo({
            showToast: true,
            toastMessage: `Filter Save Succesfull`,
          })
        );
        dispatch(
          setMapperPageLevelData({
            formName: formName,
            fieldData: {
              isFilterApplied: applyFilter,
              filterObjectJson: JSON.stringify(values),
            },
          })
        );
      }
    });

    isEdit
      ? history.push(
          getPathWithParam({
            path: MANAGE_MAPPER_ROUTES.AGGREGATE,
            pathParam: [FLOW_TYPES.EDIT, profileId],
          })
        )
      : history.push(`${MANAGE_MAPPER_ROUTES.AGGREGATE}/${profileId}`);
  };

  const onSubmit = async (values, setSubmitting, touched) => {
    setSubmitting(true);
    toSubmit(values);
  };
  // const onNext = () =>{
  //   const isEdit = flow === FLOW_TYPES.EDIT;

  //   isEdit
  //         ? history.push(
  //             getPathWithParam({
  //               path: MANAGE_MAPPER_ROUTES.TARGET,
  //               pathParam: [FLOW_TYPES.EDIT, profileId],
  //             })
  //           )
  //         : history.push(
  //             getPathWithParam({
  //               path: MANAGE_MAPPER_ROUTES.TARGET,
  //               pathParam: [profileId],
  //             })
  //           );
  //       // history.push(`${MANAGE_MAPPER_ROUTES.TARGET}/${profileId}`);
  //     }

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      link: ROUTES.MAPPER_HOME,
    },

    {
      label: "Next",
      variant: "primary",
      type: "submit",
      onClick: toSubmit,
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
      innerRef={ref1}
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
          touched,
          ...rest
        } = formProps;
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };
        return (
          <Form autoComplete="off" className="h-100" onSubmit={handleSubmit}>
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
                  <div
                    style={{
                      paddingBottom: "0.5rem",
                      color: "#494F5A",
                      fontSize: "18px",
                      fontWeight: "550",
                    }}
                  >
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

              {applyFilter && !isEmpty(FilterConditionFields) ? (
                <div style={{ display: "flex" }}>
                  <FilterSource
                    fields={FilterConditionFields}
                    setfields={setFilterConditionFields}
                  />
                  <div className="FilterConditionContainer">
                    <div className="FilterConditionTitleText">
                      Selected Filter Condition
                    </div>
                    <div>
                      <FieldArray name="info">
                        {() => (
                          <div
                            style={{
                              border: "1px solid #E5E5E5",
                              borderRadius: "5px",
                              // border: "2px solid yellow",
                              width: "42rem",
                              height: "28rem",
                              display: "flex",
                            }}
                          >
                            <div className="FilterList">
                              {FilterConditionFields.map((item, index) => {
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
                                      <div className="FTitle">
                                        {" "}
                                        {item.field}
                                      </div>
                                    </Card>
                                  </>
                                ) : (
                                  <> </>
                                );
                              })}
                            </div>
                            <div className="OptionContainer">
                              {FilterConditionFields.map((item, index) => {
                                return item.selected ? (
                                  <>
                                    {item.filterSelect && selopt == item.id && (
                                      <>
                                        <div className="OptTitle">
                                          Filter Options
                                        </div>
                                        <div className="ConTitle">
                                          Condition
                                        </div>
                                        <div
                                          key={item.id}
                                          style={{
                                            width: "20rem",
                                            fontSize: "14px",
                                            font: "Poppins",
                                            fontWeight: "400",
                                            paddingBottom: "1rem",
                                          }}
                                        >
                                          <Field
                                            name={`${index}.SimOpt`}
                                            value={values[index]["SimOpt"]}
                                            options={toOptionValuesFromMapper(
                                              item.options[0]
                                            )}
                                            isRequired
                                            direction={"bottom"}
                                            popupContent={
                                              <SearchableList
                                                label="Profile Type"
                                                isNotTypeAhead
                                                options={toOptionValuesFromMapper(
                                                  item.options[0]
                                                )}
                                                onSelect={(value) =>
                                                  setFieldValue(
                                                    `${index}.SimOpt`,
                                                    value
                                                  )
                                                }
                                                selectedValue={
                                                  values[index]["SimOpt"]
                                                }
                                              />
                                            }
                                            component={FieldDropSide}
                                          />
                                          {!(
                                            values[index]["SimOpt"] == 0 ||
                                            values[index]["SimOpt"] == 1 ||
                                            values[index]["SimOpt"] == ""
                                          ) ? (
                                            !(item.dataType == "Date") ? (
                                              !(
                                                values[index]["SimOpt"] == 2
                                              ) ? (
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
                                                    component={FieldInput}
                                                    isRequired
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
                                                    component={FieldInput}
                                                    isRequired
                                                  />
                                                  <div className="ConTitle">
                                                    To
                                                  </div>
                                                  <Field
                                                    type="text"
                                                    name={`${index}.To`}
                                                    values={`values[${index}].To`}
                                                    component={FieldInput}
                                                    isRequired
                                                  />
                                                </div>
                                              )
                                            ) : !(
                                                values[index]["SimOpt"] == 2
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
                                                  value={usDateFormat(
                                                    item.From
                                                  )}
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
                                                <div className="ConTitle">
                                                  To
                                                </div>
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
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <> </>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="FilterUnavailable"> Filter not applied</div>
                </>
              )}
              {/* <pre>{JSON.stringify(FilterConditionFields, null, 2)}</pre> */}
            </ManageMapperLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default MapperFilterCondition;
