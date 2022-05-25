import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { isEmpty, get, isUndefined } from "lodash";
import { Formik, Field } from "formik";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  CsplTable as Table,
  FieldDropSide,
  DatePicker,
  SliderPanel,
} from "../../../../../components";
import {
  manageEligibilityFormNames,
  formFields,
  getFlowBasedFormValues,
  usDateFormat,
  // formatDateForApiRequest,
} from "../../../../../utils";
import {
  useRouterParams,
  useRequest,
  useDeepEffect,
} from "../../../../../abstracts";
import { getPlansCompensation } from "../../../../../services";
import {
  manageEligibilityStore,
  setManagePageLevelData,
  manageCensusStore,
  setManageCensusPageLevelData,
} from "../../../../../contexts";
import AddCompensation from "./AddCompensation";
import { useEffect } from "react";
import AddToolTip from "../../../../../components/AddToolTip";

const initialValues = {};

const columns = [
  {
    label: "Pay date",
    className: "column-payDate",
    columnName: "payDate",
    link: `link`,
  },
  {
    label: "Pay Period Plan Compensation",
    className: "column-payPeriodPlanCompensation",
    columnName: "payPeriodPlanCompensation",
  },
  {
    label: "Eligible Plan Compensation",
    className: "column-eligiblePlanCompensation",
    columnName: "eligiblePlanCompensation",
  },
  {
    label: "Pay Period Gross Compensation",
    className: "column-payPeriodGrossCompensation",
    columnName: "payPeriodGrossCompensation",
  },
  {
    label: "Annual Salary",
    className: "column-annualSalary",
    columnName: "annualSalary",
  },
  {
    label: "Source Compensation",
    className: "column-sourceCompensation",
    columnName: "matchSourceCompensation",
  },
  // {
  //   label: "Comments",
  //   className: "column-comments",
  //   columnName: "comments",
  //   link: `link`,
  // },
  {
    label: "Updated Through",
    className: "column-uploadedThrough",
    columnName: "uploadedThrough",
  },
  {
    label: "Updated By",
    className: "column-updatedBy",
    columnName: "updatedBy",
  },
];

//const updatedBy = [null, "Admin"];
const defaultStartDate = new Date();
defaultStartDate.setDate(defaultStartDate.getDate() - 120);
const defaultEndDate = new Date();

const Compensations = (props) => {
  const { censusId, planId, flow } = useRouterParams();
  const { state, dispatch } = useContext(manageCensusStore);
  const [showCompensationForm, setShowCompensationForm] = useState(false);
  const [formValues, setFormvalues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [compensations, setCompensations] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  // const { response, loading } = useRequest({
  //   method: getPlansCompensation,
  //   payload: {
  //     employeeId: parseInt(censusId),
  //     startDate: defaultStartDate,
  //     endDate: defaultEndDate,
  //   },
  //   defaultResponse: [],
  // });

  useDeepEffect(() => {
    getPlansCompensation({
      employeeId: parseInt(censusId),
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    }).then((response) => {
      setCompensations(response);
    });
  }, [toggle]);

  var totPlanCompensations = 0;
  var totGrossCompensations = 0;
  if (!isEmpty(compensations)) {
    compensations.map((Comp, initValue) => {
      totPlanCompensations =
        totPlanCompensations + Comp.payPeriodPlanCompensation;
      totGrossCompensations =
        totGrossCompensations + Comp.payPeriodGrossCompensation;
    });
  }
  console.log(totPlanCompensations, "totPlanCompensations");
  console.log(totGrossCompensations, "totGrossCompensations");
  //useDeepEffect(() => setCompensations(response), [response]);

  console.log(compensations, "comp");
  const formName = manageEligibilityFormNames.ELIGIBILITY_SUMMARY_FILTER;
  const fields = formFields[formName];

  const onFormSubmit = (values) => {
    dispatch(
      setManageCensusPageLevelData({
        formName: formName,
        fieldData: values,
      })
    );
  };

  const onFilter = (values) => {
    //setIsLoading(true);
    getPlansCompensation({
      employeeId: parseInt(censusId),
      // planId: planId,
      startDate: values.startDate,
      endDate: values.endDate,
    })
      .then((response) => {
        setCompensations(response);
      })
      .catch((error) => {
        //Handle Errors
      });
    //setIsLoading(false);
    // console.log({ compensations });
  };

  const toggleCompensationForm = () => {
    setShowCompensationForm(!showCompensationForm);
    setIsEdit(false);
  };
  //const toggleEdit
  console.log(formValues, "fv");
  return (
    <>
      {!showCompensationForm && (
        <div className="w-100 compensation-container">
          <div className="d-flex w-100 align-items-center justify-content-around">
            <div className="plan-sub-heading">
              Total Pay Period Plan Compensation &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$
              {totPlanCompensations.toFixed(2)}
            </div>
            <div className="plan-sub-heading">
              Total Pay Period Gross Compensation
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${totGrossCompensations.toFixed(2)}
            </div>
          </div>

          <Formik
            initialValues={{
              ...initialValues,
              ...getFlowBasedFormValues(get(state, formName, {}), flow),
              startDate: defaultStartDate,
              endDate: defaultEndDate,
            }}
            onSubmit={onFormSubmit}
            enableReinitialize
          >
            {({
              handleChange,
              setFieldValue,
              handleSubmit,
              values,
              ...rest
            }) => {
              const onDaySelected = (fieldName, value) => {
                setFieldValue(fieldName, value);
              };
              return (
                <Form
                  autoComplete="off"
                  className="h-100"
                  onSubmit={handleSubmit}
                  validated={!isEmpty(rest.errors)}
                >
                  <div className="d-flex justify-content-between compensation-container w-100">
                    <div className="d-flex align-items-center justify-content-between w-75">
                      <Field
                        size="smd"
                        label="Start Date"
                        name={fields.startDate}
                        value={usDateFormat(values[fields.startDate])}
                        isDatePicker
                        onClear={() => onDaySelected(fields.startDate, "")}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.startDate, value)
                            }
                            value={values[fields.startDate]}
                          />
                        }
                        component={FieldDropSide}
                      />
                      <Field
                        size="smd"
                        label="End Date"
                        name={fields.endDate}
                        value={usDateFormat(values[fields.endDate])}
                        isDatePicker
                        onClear={() => onDaySelected(fields.endDate, "")}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.endDate, value)
                            }
                            value={values[fields.endDate]}
                          />
                        }
                        component={FieldDropSide}
                      />
                      <Button
                        onClick={() => onFilter(values)}
                        type="button"
                        className="align-center"
                      >
                        Go
                      </Button>
                      <div className="mr-4 mt-12">
                        {compensations.length} records
                      </div>
                    </div>
                    <div className="align-center">
                      <Button
                        type="button"
                        className="add-btn"
                        size="sm"
                        onClick={toggleCompensationForm}
                        variant="secondary"
                      >
                        Add PayPeriod Compensation
                      </Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
          <br />
          <Table style={{ maxWidth: "200px !important" }}>
            <Table.Thead>
              <Table.Tr>
                {columns.map((item, index) => {
                  // console.log(item.className);
                  return (
                    <Table.Th key={index} className={item.className}>
                      {item.label}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {compensations &&
                compensations.map((compensation, index) => {
                  return (
                    <Table.Tr key={index}>
                      {columns.map((item, cellIndex) => {
                        //console.log(item.className);
                        return (
                          <Table.Td key={cellIndex} className={item.className}>
                            {compensation[item.columnName] === null ||
                            compensation[item.columnName] === "" ? (
                              "-"
                            ) : item.columnName === "comments" ? (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip>{compensation.tooltip}</Tooltip>
                                }
                              >
                                <Link>{compensation[item.columnName]}</Link>
                              </OverlayTrigger>
                            ) : item.dataMapper ? (
                              item.dataMapper[compensation[item.columnName]]
                            ) : item.columnName === "payDate" ? (
                              <Link
                                onClick={() => {
                                  setShowCompensationForm(true);
                                  setFormvalues(compensations[index]);
                                  setIsEdit(true);
                                  setIsView(true);
                                }}
                              >
                                {usDateFormat(compensation[item.columnName])}
                              </Link>
                            ) : item.columnName === "uploadedThrough" ? (
                              compensation[item.columnName]
                            ) : item.columnName === "updatedBy" ? (
                              compensation[item.columnName]
                            ) : item.columnName ===
                              "eligiblePlanCompensation" ? (
                              compensation[item.columnName]
                            ) : item.columnName ===
                              "matchSourceCompensation" ? (
                              //data=compensation[item.columnName]
                              <AddToolTip
                                name={compensation[item.columnName]}
                              />
                            ) : isUndefined(compensation[item.columnName]) ||
                              compensation[item.columnName] === null ? null : (
                              (console.log(compensation[item.columnName]),
                              "$" + compensation[item.columnName].toFixed(2))
                            )}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}
            </Table.Tbody>
          </Table>
        </div>
      )}

      {/* <SliderPanel isOpen={showEditCompensationForm} size="55" showCancel={false}>
        <AddCompensation
          {...props}
          setToggle={setToggle}
          toggle={toggle}
          toggleCompensationForm={toggleCompensationForm}
        />
        </SliderPanel> */}

      <SliderPanel isOpen={showCompensationForm} size="55" showCancel={false}>
        <div className="d-flex mr-600">
          <AddCompensation
            {...props}
            setToggle={setToggle}
            toggle={toggle}
            formValues={formValues}
            setFormvalues={setFormvalues}
            isEdit={isEdit}
            isView={isView}
            setIsView={setIsView}
            toggleCompensationForm={toggleCompensationForm}
          />
        </div>
      </SliderPanel>
    </>
  );
};

export default Compensations;
