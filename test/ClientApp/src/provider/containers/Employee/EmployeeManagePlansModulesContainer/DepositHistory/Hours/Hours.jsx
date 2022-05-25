import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get, isEmpty } from "lodash";
import { Button, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import {
  CsplTable as Table,
  SliderPanel,
  DatePicker,
  FieldDropSide,
} from "../../../../../components";
import {
  useRequest,
  useRouterParams,
  useDeepEffect,
} from "../../../../../abstracts";
import { getPlansHours } from "../../../../../services";
import AddHours from "./AddHours";
import {
  censusFormFields,
  usDateFormat,
  formFields,
  manageCensusFormNames,
} from "../../../../../utils";
import { Formik, Field } from "formik";
const columns = [
  {
    label: "Pay date",
    className: "column-payDate",
    columnName: "payDate",
  },
  {
    label: "Pay period hours",
    className: "column-payPeriodHours",
    columnName: "payPeriodHours",
  },
  {
    label: "Updated Through",
    className: "column-updatedThrough",
    columnName: "uploadedThrough",
  },
  {
    label: "Updated By",
    className: "column-updatedBy",
    columnName: "updatedBy",
  },
  {
    label: "Comments",
    className: "column-comments",
    columnName: "comments",
    link: `link`,
  },
];
//const updatedBy = [null, "Admin"];
const Hours = (props) => {
  const [filteredResponse] = useState([]);
  const [showHoursForm, setShowHoursForm] = useState(false);
  const [isLoading] = useState(false);
  const { censusId } = useRouterParams();
  const [totalPay, setTotalPay] = useState(0);
  const [hoursList, setHoursList] = useState([]);
  const [toggle, setToggle] = useState(false);
  const formName = manageCensusFormNames.HOURS;
  const fields = formFields[formName];
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 120);
  const defaultEndDate = new Date();
  useDeepEffect(() => {
    getPlansHours({
      employeeId: parseInt(censusId),
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    }).then((response) => {
      setHoursList(response);
      console.log(response);
    });
  }, [toggle]);

  var totPayHours = 0;
  if (!isEmpty(hoursList)) {
    hoursList.map((hr, initValue) => {
      totPayHours = totPayHours + hr.payPeriodHours;
    });
  }
  console.log(totPayHours, "payPeriodHours");

  const toggleHoursForm = () => {
    setShowHoursForm(!showHoursForm);
  };

  const onFormSubmit = {};
  const onFilter = (values) => {
    getPlansHours({
      employeeId: parseInt(censusId),
      startDate: values.startDate,
      endDate: values.endDate,
    }).then((response) => {
      setHoursList(response);
    });
  };

  return (
    <>
      {!showHoursForm && (
        <div className="w-100 hours-table">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <div className="plan-sub-heading">Show records of period</div>
            <div className="plan-sub-heading">
              Total Pay Period Hours &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{totPayHours}
            </div>
          </div>
          {/* <div className="plan-sub-heading">
              Total Pay Period Hours &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{totPayHours}
            </div> */}
          <Formik
            initialValues={{
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
                    <div
                      className="d-flex align-items-center justify-content-between hoursHeader"
                      style={{ width: "80%" }}
                    >
                      <Field
                        size="smd"
                        label="Start Date"
                        name={fields.startDate}
                        className="startDate"
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
                        {/* Total Pay Period Hours {totPayHours} */}
                        {hoursList.length} Record
                      </div>
                    </div>
                    <div className="align-center">
                      <Button
                        type="button"
                        className="add-btn"
                        onClick={toggleHoursForm}
                        variant="secondary"
                      >
                        Add PayPeriod Hours
                      </Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>

          <Table>
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
            <Table.Tbody>
              {hoursList.map((hours, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {hours[item.columnName] === null ||
                          hours[item.columnName] === "" ? (
                            "-"
                          ) : !isEmpty(item.link) ? (
                            <OverlayTrigger
                              overlay={<Tooltip>{hours.tooltip}</Tooltip>}
                            >
                              <Link>{hours[item.columnName]}</Link>
                            </OverlayTrigger>
                          ) : item.dataMapper ? (
                            item.dataMapper[hours[item.columnName]]
                          ) : item.columnName === "payDate" ? (
                            usDateFormat(hours[item.columnName])
                          ) : item.columnName === "updatedBy" ? (
                            hours[item.columnName]
                          ) : (
                            hours[item.columnName]
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
      {/* {showHoursForm && (
        <AddHours
          {...props}
          toggleHoursForm={toggleHoursForm}
          setToggle={setToggle}
          toggle={toggle}
        />

        
      )} */}
      <SliderPanel isOpen={showHoursForm} size="55" showCancel={false}>
        <div className="d-flex mr-600">
          <AddHours
            {...props}
            toggleHoursForm={toggleHoursForm}
            setToggle={setToggle}
            toggle={toggle}
          />
        </div>
      </SliderPanel>
    </>
  );
};

export default Hours;
