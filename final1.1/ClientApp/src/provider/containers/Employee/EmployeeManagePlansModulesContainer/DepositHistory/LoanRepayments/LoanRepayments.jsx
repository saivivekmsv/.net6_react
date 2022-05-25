import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { OverlayTrigger, Tooltip, Form, Button } from "react-bootstrap";
import {
  CsplTable as Table,
  DatePicker,
  FieldDropSide,
} from "../../../../../components";
import { useRequest, useRouterParams } from "../../../../../abstracts";
import { getPlansLoanRepayments } from "../../../../../services";
import {
  censusFormFields,
  usDateFormat,
  formFields,
  manageCensusFormNames,
} from "../../../../../utils";
import { Formik, Field } from "formik";

const defaultStartDate = new Date();
defaultStartDate.setDate(defaultStartDate.getDate() - 120);
const defaultEndDate = new Date();
const columns = [
  {
    label: "Loan ID",
    className: "column-loadId",
    columnName: "loanId",
  },
  {
    label: "Repayment Date",
    className: "column-repaymentDate",
    columnName: "repaymentDate",
  },
  {
    label: "Repayment Amount",
    className: "column-repaymentAmount",
    columnName: "repaymentAmount",
  },
  {
    label: "Updated Through",
    className: "column-updatedThrough",
    columnName: "uploadedThrough",
  },
  {
    label: "Date Time Loaded",
    className: "column-dateTimeLoaded",
    columnName: "uploadedDate",
  },
  {
    label: "Comments",
    className: "column-comments",
    columnName: "comments",
    link: `link`,
  },
];

const LoanRepayments = (props) => {
  const [filteredResponse] = useState([]);
  const { planId, censusId } = useRouterParams();
  const formName = manageCensusFormNames.HOURS;
  const fields = formFields[formName];
  const [response, setResponse] = useState([]);
  // const { response } = useRequest({
  //   method: getPlansLoanRepayments,
  //   payload: {
  //     planId: planId,
  //     employeeId: parseInt(censusId),
  //     startDate: defaultStartDate,
  //     endDate: defaultEndDate,
  //   },
  //   defaultResponse: filteredResponse,
  // });

  useEffect(() => {
    getPlansLoanRepayments({
      planId: parseInt(planId),
      employeeId: parseInt(censusId),
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    }).then((response) => {
      setResponse(response);
      console.log(response);
    });
  }, []);
  const onFormSubmit = {};
  const onFilter = (values) => {
    console.log(values);
    getPlansLoanRepayments({
      planId: parseInt(planId),
      employeeId: parseInt(censusId),
      startDate: values.startDate,
      endDate: values.endDate,
    }).then((response) => {
      setResponse(response);
    });
  };
  return (
    <>
      <div className="w-100">
        <div className="d-flex w-100 align-items-center justify-content-between">
          <div className="plan-sub-heading">Show records of period</div>
        </div>
        <Formik
          initialValues={{
            startDate: defaultStartDate,
            endDate: defaultEndDate,
          }}
          onSubmit={onFormSubmit}
          enableReinitialize
        >
          {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
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
                <div className="d-flex align-items-center justify-content-between compensation-container w-50">
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
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div className="w-100 loan-container">
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
            {response.map((compensation, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {compensation[item.columnName] === null ||
                        compensation[item.columnName] === "" ? (
                          "-"
                        ) : !isEmpty(item.link) ? (
                          <OverlayTrigger
                            overlay={<Tooltip>{compensation.tooltip}</Tooltip>}
                          >
                            <Link>{compensation[item.columnName]}</Link>
                          </OverlayTrigger>
                        ) : item.dataMapper ? (
                          item.dataMapper[compensation[item.columnName]]
                        ) : item.columnName === "repaymentAmount" ? (
                          "$" + compensation[item.columnName].toFixed(2)
                        ) : item.columnName === "repaymentDate" ? (
                          usDateFormat(compensation[item.columnName])
                        ) : (
                          compensation[item.columnName]
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
    </>
  );
};

export default LoanRepayments;
