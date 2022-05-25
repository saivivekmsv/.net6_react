import React, { useState, useContext, useEffect } from "react";
import { Field, FieldArray, Formik } from "formik";
import { Form, Button } from "react-bootstrap";
import { get, isNull } from "lodash";
import { faPencilAlt, faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CsplTable as Table,
  DatePicker,
  FieldDropSide,
  Link,
  LoaderWrapper,
  SliderPanel,
} from "../../../../components";
import {
  getEligibilityInformation,
  getEligibilityHistory,
  getComputationalPeriods,
} from "../../../../services";
import {
  manageCensusFormNames,
  getFlowBasedFormValues,
  usDateFormat,
  ROUTES,
  FLOW_TYPES,
} from "../../../../utils";
import { useRequest, useRouterParams } from "../../../../abstracts";
import {
  manageCensusStore,
  setManagePageLevelData,
} from "../../../../contexts";
import { saveEligibilityInformation } from "../../../../services";
import EligibilityOverrideSlideTable from "./EligibilityOverrideSlideTable";

const initialValues = {};
// const computationPeriodTable=[
//   {
//     startDate:"09/12/2019",
//     endDate:"09/21/2022",
//     computationHours:"223",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"01/10/2019",
//     endDate:"02/12/2022",
//     computationHours:"423",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"12/16/2018",
//     endDate:"12/16/2022",
//     computationHours:"456",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"07/25/2018",
//     endDate:"07/25/2021",
//     computationHours:"756",
//     computationType:"plan year after anniversary of hire"
//   },
//   {
//     startDate:"06/22/2018",
//     endDate:"06/22/2021",
//     computationHours:"123",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"11/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"233",
//     computationType:"plan year after anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   //added
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },

//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },
//   {
//     startDate:"09/09/2017",
//     endDate:"31/12/2019",
//     computationHours:"500",
//     computationType:"Anniversary of hire"
//   },

// ];

const columns = [
  {
    label: "Source Name",
    className: "column-sourceName",
    columnName: "sourceName",
  },
  {
    label: "Eligibility Requirement Met Date",
    className: "column-eligibilityRequirementMetDate",
    columnName: "eligibilityRequirementMetDate",
  },
  {
    label: "Eligibility Status",
    className: "column-eligiblityStatus",
    columnName: "eligibilityStatus",
    // dataMapper: OPTIONS_DATA_MAPPER.ELIBILITY_STATUS,
  },
  {
    label: "Entry Date",
    className: "column-entryDate",
    columnName: "entryDate",
  },
  {
    label: "Anchor Eligibility",
    className: "column-anchorEligibility",
    columnName: "anchorEligibility",
  },
  {
    label: "Payroll Based Eligibility",
    className: "column-payrollBasedEligibility",
    columnName: "payrollBasedEligibility",
    type: "boolean",
  },
  {
    label: "Eligibility History",
    className: "column-eligibilityHistory",
    columnName: "eligibilityHistory",
  },
  {
    label: "Computation Period",
    className: "column-computationPeriod",
    columnName: "computationPeriod",
  },
];

const columnsComputationPeriod = [
  {
    label: "Computation Period Start Date",
    className: "column-computationPeriodStartDate",
    columnName: "startDate",
  },
  {
    label: "Computation Period End Date",
    className: "column-computationPeriodEndDate",
    columnName: "endDate",
  },
  {
    label: "Computation Hours",
    className: "column-computationHours",
    columnName: "hours",
    // dataMapper: OPTIONS_DATA_MAPPER.ELIBILITY_STATUS,
  },
  {
    label: "Computation Type",
    className: "column-computationType",
    columnName: "computationType",
  },
];

const EligibilityOverride = ({
  isEdit,
  isSave,
  isInnerFormDirty,
  setIsInnerFormDirty,
  onClickEdit,
  onClickSave,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sidePanelData, setSidePanelData] = useState({});
  const [isSliderOpen, setSliderOpen] = useState(false);
  const { flow } = useRouterParams();
  const [newFlow, setNewFlow] = useState();
  const { state, dispatch } = useContext(manageCensusStore);
  const formName = manageCensusFormNames.ADD_COMPENSATIONS;
  const [computationPeriodTable, setComputationPeriodTable] = useState([]);
  const [isEligible, setIsEligible] = useState([]);
  const [toggle, setToggle] = useState();
  const [eligibilityOverride, setEligibilityOverride] = useState();

  useEffect(() => {
    return () => setIsInnerFormDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getEligibilityInformation({
      planId: planId,
      employeeId: censusId,
    }).then((response) => {
      setEligibilityOverride(response);
    });
  }, []);

  const onViewComputationPeriodClick = (data) => {
    getComputationalPeriods({
      planId: planId,
      sourceId: data.sourceId,
      employeeId: censusId,
    }).then((response) => {
      setComputationPeriodTable(response);
      setSliderOpen(true);
    });
  };

  const onFormSubmit = (values) => {
    setIsLoading(true);
    let data = values["eligibilityOverride"];
    data = data.filter((_) => {
      return _ !== undefined;
    });
    const eligiblityData = {
      sourceEligibilityInformation: data != undefined ? data : null,
    };
    if (isNull(eligiblityData.sourceEligibilityInformation)) {
      setIsLoading(false);
      onClickSave();
    } else {
      saveEligibilityInformation(eligiblityData).then((res) => {
        if (res) {
          getEligibilityInformation({
            planId: planId,
            employeeId: censusId,
          }).then((response) => {
            setEligibilityOverride(response);
            setIsLoading(false);
            onClickSave();
          });
        }
      });
    }
  };
  const onViewButtonClick = (data) => {
    getEligibilityHistory({
      planId: planId,
      employeeId: censusId,
      sourceId: data.sourceId,
    })
      .then((response) => {
        data = {
          ...data,
          history: response,
        };
        setSidePanelData(data);
        setModalOpen(true);
      })
      .catch((error) => {
        //HandleError
      });
  };

  const { planId } = useRouterParams();
  const { censusId } = useRouterParams();
  const intPlanId = parseInt(planId, 10);
  const intEmployeeId = parseInt(censusId, 10);

  return (
    <div className="mt-4 h-100">
      <Formik
        initialValues={{
          ...initialValues,
          ...getFlowBasedFormValues(get(state, formName, {}), flow),
        }}
        onSubmit={onFormSubmit}
        enableReinitialize
      >
        {({
          handleChange,
          setFieldValue,
          handleSubmit,
          values,
          dirty,
          ...rest
        }) => {
          {
            /* if (isInnerFormDirty !== dirty) {
            setIsInnerFormDirty(dirty);
          } */
          }
          return (
            <Form
              autoComplete="off"
              name="eligibility-override"
              className="h-100"
              onSubmit={handleSubmit}
            >
              <LoaderWrapper isLoading={isLoading}>
                <div className="d-flex flex-column mt-10 mb-10">
                  <div className="d-flex align-items-center">
                    <p className="h-50 font-weight-500">Eligibility Override</p>
                    {isSave ? (
                      <div className="ml-auto">
                        <Link to={ROUTES.MANAGE_EMPLOYEE}>
                          <Button
                            label="Cancel"
                            variant="secondary"
                            type="button"
                          >
                            Cancel
                          </Button>
                        </Link>
                        <Button
                          label="Save"
                          variant="primary"
                          type="submit"
                          className="px-2 mx-2"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="ml-auto">
                        <div>
                          <Link
                            to={ROUTES.MANAGE_EMPLOYEE}
                            className="px-3 mx-3"
                          >
                            <FontAwesomeIcon
                              icon={faTimes}
                              color="#212529"
                              style={{ fontSize: "1.5rem" }}
                            />
                          </Link>
                          <FontAwesomeIcon
                            icon={faPencilAlt}
                            color="#212529"
                            style={{ fontSize: "1.5rem" }}
                            onClick={() => {
                              onClickEdit();
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Table className="eligibility-override">
                  <Table.Thead>
                    <Table.Tr>
                      {columns.map((item, index) => {
                        return (
                          <Table.Th key={index} className={item.className}>
                            {item.label}
                          </Table.Th>
                        );
                      })}
                    </Table.Tr>
                  </Table.Thead>
                  <FieldArray name="eligibleOverride">
                    <Table.Tbody>
                      {eligibilityOverride &&
                        eligibilityOverride.map((eligibilityDetail, index) => {
                          return (
                            <Table.Tr key={index}>
                              {columns.map((item, cellIndex) => {
                                const getContent = () => {
                                  const columnName = item.columnName;
                                  const fieldName = `eligibilityOverride[${index}].${columnName}`;
                                  const data = get(
                                    eligibilityDetail,
                                    columnName
                                  );
                                  const anchorEligibilityValue = get(
                                    values,
                                    `eligibilityOverride[${index}].anchorEligibility`,
                                    eligibilityDetail["anchorEligibility"]
                                  );
                                  const isDateEnabled =
                                    anchorEligibilityValue == true;

                                  const onDaySelected = (name, value) => {
                                    setFieldValue(name, value);
                                  };
                                  if (item.dataMapper) {
                                    return item.dataMapper[
                                      eligibilityDetail[columnName]
                                    ];
                                  }
                                  if (
                                    [
                                      "eligibilityRequirementMetDate",
                                      "entryDate",
                                    ].includes(columnName)
                                  ) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={`${columnName}${[index]}`}
                                        value={
                                          isDateEnabled
                                            ? usDateFormat(
                                                get(values, fieldName, data)
                                              )
                                            : usDateFormat(
                                                get(
                                                  eligibilityDetail,
                                                  columnName
                                                )
                                              )
                                        }
                                        isDatePicker
                                        onClear={() =>
                                          onDaySelected(fieldName, "")
                                        }
                                        validate={
                                          isDateEnabled
                                            ? (value) => {
                                                let cur_date = new Date();
                                                let selected_date = get(
                                                  values,
                                                  fieldName,
                                                  data
                                                );
                                                return [
                                                  undefined,
                                                  null,
                                                  "",
                                                ].includes(selected_date)
                                                  ? "Required"
                                                  : selected_date > cur_date
                                                  ? get(
                                                      eligibilityDetail,
                                                      "sourceName"
                                                    ) +
                                                    `-` +
                                                    `${item.label}` +
                                                    ` cannot be future date`
                                                  : undefined;
                                              }
                                            : undefined
                                        }
                                        popupContent={
                                          <DatePicker
                                            onDayClick={(value) => {
                                              onDaySelected(fieldName, value);
                                              if (
                                                values[
                                                  `eligibilityOverride[${index}].anchorEligibility`
                                                ] == undefined
                                              ) {
                                                setFieldValue(
                                                  `eligibilityOverride[${index}].eligibilityStatus`,
                                                  true
                                                );
                                                setFieldValue(
                                                  `eligibilityOverride[${index}].anchorEligibility`,
                                                  true
                                                );
                                                setFieldValue(
                                                  `eligibilityOverride[${index}].sourceId`,
                                                  eligibilityDetail.sourceId
                                                );
                                                setFieldValue(
                                                  `eligibilityOverride[${index}].planId`,
                                                  intPlanId
                                                );
                                                setFieldValue(
                                                  `eligibilityOverride[${index}].employeeId`,
                                                  intEmployeeId
                                                );
                                              }
                                            }}
                                            value={values[fieldName]}
                                          />
                                        }
                                        component={FieldDropSide}
                                        disabled={isEdit || !isDateEnabled}
                                      />
                                    );
                                  }

                                  if (
                                    ["anchorEligibility"].includes(columnName)
                                  ) {
                                    return (
                                      <Form.Check
                                        name={fieldName}
                                        type="switch"
                                        id={`custom-switch-${index}`}
                                        label=" "
                                        defaultChecked={
                                          eligibilityDetail[columnName]
                                        }
                                        value={anchorEligibilityValue}
                                        onChange={() => {
                                          var toggle = !anchorEligibilityValue;
                                          setIsEligible({
                                            status: toggle,
                                            index: index,
                                          });
                                          if (
                                            toggle &&
                                            eligibilityDetail.eligibilityStatus ==
                                              "InEligible"
                                          )
                                            setFieldValue(
                                              `eligibilityOverride[${index}].eligibilityStatus`,
                                              true
                                            );
                                          else if (
                                            !toggle &&
                                            eligibilityDetail.eligibilityStatus ==
                                              "InEligible"
                                          )
                                            setFieldValue(
                                              `eligibilityOverride[${index}].eligibilityStatus`,
                                              false
                                            );
                                          else
                                            setFieldValue(
                                              `eligibilityOverride[${index}].eligibilityStatus`,
                                              true
                                            );
                                          setFieldValue(
                                            `eligibilityOverride[${index}].anchorEligibility`,
                                            toggle
                                          );
                                          setFieldValue(
                                            `eligibilityOverride[${index}].eligibilityRequirementMetDate`,
                                            get(
                                              eligibilityDetail,
                                              "eligibilityRequirementMetDate"
                                            )
                                          );
                                          setFieldValue(
                                            `eligibilityOverride[${index}].entryDate`,
                                            get(eligibilityDetail, "entryDate")
                                          );
                                          setFieldValue(
                                            `eligibilityOverride[${index}].sourceId`,
                                            eligibilityDetail.sourceId
                                          );
                                          setFieldValue(
                                            `eligibilityOverride[${index}].planId`,
                                            intPlanId
                                          );
                                          setFieldValue(
                                            `eligibilityOverride[${index}].employeeId`,
                                            intEmployeeId
                                          );
                                        }}
                                        disabled={isEdit && !isSave}
                                      />
                                    );
                                  }
                                  if (item.type === "boolean") {
                                    return eligibilityDetail[columnName]
                                      ? "Yes"
                                      : "No";
                                  }

                                  if (cellIndex === columns.length - 2) {
                                    return (
                                      <Link
                                        onClick={() =>
                                          onViewButtonClick({
                                            sourceName: get(
                                              eligibilityDetail,
                                              "sourceName"
                                            ),
                                            sourceId: get(
                                              eligibilityDetail,
                                              "sourceId"
                                            ),
                                          })
                                        }
                                      >
                                        View
                                      </Link>
                                    );
                                  }
                                  if (cellIndex === columns.length - 1) {
                                    return (
                                      <Link
                                        onClick={() => {
                                          onViewComputationPeriodClick({
                                            sourceId: get(
                                              eligibilityDetail,
                                              "sourceId"
                                            ),
                                          });
                                        }}
                                      >
                                        View
                                      </Link>
                                    );
                                  }
                                  if (
                                    isEligible.status &&
                                    index == isEligible.index &&
                                    eligibilityDetail[columnName] ==
                                      "InEligible"
                                  ) {
                                    setToggle(true);
                                    return (eligibilityDetail[columnName] =
                                      "Eligible");
                                  } else if (
                                    toggle &&
                                    !isEligible.status &&
                                    index == isEligible.index &&
                                    eligibilityDetail[columnName] == "Eligible"
                                  ) {
                                    return (eligibilityDetail[columnName] =
                                      "InEligible");
                                  }
                                  return eligibilityDetail[columnName];
                                };
                                return (
                                  <Table.Td
                                    key={cellIndex}
                                    className={item.className}
                                  >
                                    {getContent()}
                                  </Table.Td>
                                );
                              })}
                            </Table.Tr>
                          );
                        })}
                    </Table.Tbody>
                  </FieldArray>
                </Table>
              </LoaderWrapper>
            </Form>
          );
        }}
      </Formik>

      <SliderPanel isOpen={isSliderOpen} size="55" showCancel={false}>
        <div className="mw-810">
          <div className="d-flex mr-600">
            {/* style={{display:"flex",marginLeft:"5px",justifyContent:"space-between",maxWidth:"810px"}} */}
            <div className="fw-500 lh-21 mw-450 " style={{ fontSize: "14px" }}>
              <h6>Computation Period</h6>
            </div>
            <div>
              <Link onClick={() => setSliderOpen(false)}>
                <i class="fal fa-times slidercrossicon"></i>
              </Link>
            </div>
          </div>
          <hr className=" w-800"></hr>
          {/* <div className="mt-20" style={{width:"790px"}}> */}
          <Table className="computation-period">
            <Table.Thead>
              <Table.Tr>
                {columnsComputationPeriod.map((item, index) => {
                  return (
                    <Table.Th key={index} className={item.className}>
                      {item.label}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {computationPeriodTable.map((data) => (
                <Table.Tr>
                  <Table.Td className="computationPeriodStartDate">
                    {usDateFormat(data.startDate)}
                  </Table.Td>
                  <Table.Td className="computationPeriodEndDate">
                    {usDateFormat(data.endDate)}
                  </Table.Td>
                  <Table.Td className="computationPeriodHours">
                    {data.hours}
                  </Table.Td>
                  <Table.Td className="computationPeriodType">
                    {data.computationType}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </SliderPanel>

      <SliderPanel
        isOpen={isModalOpen}
        size="80"
        onClose={() => setModalOpen(false)}
      >
        <EligibilityOverrideSlideTable data={sidePanelData} />
      </SliderPanel>
    </div>
  );
};

export default EligibilityOverride;
