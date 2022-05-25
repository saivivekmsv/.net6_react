import { Field, FieldArray, useFormikContext, ErrorMessage } from "formik";
import { get, isEmpty } from "lodash";
import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useDeepEffect } from "../../../abstracts";
import {
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
  FieldInputDollar,
  FieldInput,
} from "../../../components";
import {
  getNullTableItem,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  usDateFormat,
} from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrashAlt,
  faTimes,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";

// const paydates = [
//   { label: "12/01/2021", value: "12/01/2021" },
//   { label: "13/02/2021", value: "13/02/2021" },
//   { label: "14/03/2021", value: "14/03/2021" },
// ];

// let x = paydates.length === 1 ? paydates[0].value : null;

const columns = [
  {
    label: "Plan ID",
    className: "column-loan-id ft-12",
    columnName: "rkPlanNumber",
  },
  {
    label: "Loan ID",
    className: "column-loan-id ft-12",
    columnName: "loanNumber",
  },
  {
    label: "Loan repayment amount",
    className: "column-outstanding-loan-amount ft-12",
    columnName: "repaymentAmount",
  },
  {
    label: "Action",
    className: "column-compensation-errormessage ft-12",
    columnName: "errorMessages",
  },
];

const PayrollErrorReport = ({ fields, data, paydate, pendingSubmission }) => {
  const {
    values,
    setFieldValue,
    handleChange,
    errors,
    setFieldError,
    setTouched,
  } = useFormikContext();
  // const errorReportDetails = get(values, fields.errorReport, []);
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [filteredValues, setFilteredValues] = useState([]);
  const [recordToDelete, setRecordToDelete] = useState({});
  const [showClass, setShowClass] = useState(true);

  let temp = data.map((_) => _.payDate);
  let paydates = temp.map((_) => usDateFormat(_));
  let uniquepaydates = [...new Set(paydates)];
  let x = uniquepaydates.length === 1 ? uniquepaydates[0] : null;

  useEffect(() => {
    if (data != null && data.length > 0) {
      setFieldValue(fields.errorReport, data);
      //setFieldError(`${fields.errorReport}[${0}].repaymentAmount`,data[0].repaymentAmount);

      data[0].errorMessages.forEach((_, i) => {
        //setTouched(`${fields.errorReport}[${0}].repaymentAmount`,true)
        setFieldError(
          `${fields.errorReport}[${i}].repaymentAmount`,
          _.messageDescCode
        );
      });
    }
  }, [data]);

  useEffect(() => {
    setFilteredValues(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeOne = (item) => {
    setIsModalOpen(true);
    setRecordToDelete(item);
  };

  const onDeleteConfirmClick = () => {
    const selectedId = get(recordToDelete, "loanId");
    setFilteredValues(
      filteredValues.filter((item) => {
        return item.loanId !== selectedId;
      })
    );
    setIsModalOpen(false);
    setRecordToDelete({});
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setRecordToDelete({});
  };

  const fullText = () => {
    setShowClass(!showClass);
  };

  return (
    <div className="payroll-error-report">
      <div className="plan-sub-heading">Error Report</div>
      <div className="ft-12 mb-20">
        Review and enter corrected data for Loan number and/ or Loan Repayment
        Amount.
      </div>
      <div className="d-flex">
        <Field
          isRequired
          label="Show"
          size="smd"
          disabled={pendingSubmission}
          placeholder="Show"
          name={fields.errorReportRecordType}
          value={values[fields.errorReportRecordType]}
          direction="bottom"
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.RECORD_TYPES_OPTIONS
          )}
          popupContent={
            <SearchableList
              label="Select record type"
              options={toOptionValuesFromMapper(
                OPTIONS_DATA_MAPPER.RECORD_TYPES_OPTIONS
              )}
              onSelect={(value) =>
                setFieldValue(fields.errorReportRecordType, value)
              }
              selectedValue={values[fields.errorReportRecordType]}
              name={fields.errorReportRecordType}
              isNotTypeAhead
              isRadio
            />
          }
          component={FieldDropSide}
        />{" "}
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Field
          isRequired
          label="Pay date"
          size="sm"
          placeholder=""
          name={fields.paydateError}
          value={x}
          disabled={x ? true : false || pendingSubmission || isEmpty(data)}
          direction="bottom"
          component={FieldInput}
        />
      </div>
      <FieldArray name={fields.errorReport}>
        {() => {
          return (
            <Table className="error-report-table">
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
                {filteredValues.map((errorItem, index) => {
                  const errorReportsError = get(
                    errors,
                    `errorReport[${index}].repaymentAmount`
                  );
                  let errorType = null;
                  if (!isEmpty(errorItem.errorMessages)) {
                    errorType = errorItem.errorMessages.filter(
                      (_) => _.errorType == 2
                    );
                  }
                  return (
                    <>
                      <Table.Tr key={index}>
                        {columns.map((item, cellIndex) => {
                          const getContent = () => {
                            const fieldName = `${fields.errorReport}[${index}].${item.columnName}`;
                            if (item.columnName === "repaymentAmount") {
                              return (
                                <>
                                  <Field
                                    name={fieldName}
                                    type="text"
                                    disabled={pendingSubmission}
                                    autoComplete="off"
                                    defaultValue={errorItem[item.columnName]}
                                    onChange={handleChange}
                                    component={FieldInputDollar}
                                  />
                                </>
                              );
                            }
                            if (item.columnName === "errorMessages") {
                              return (
                                <div className="mt-10">
                                  {!isEmpty(errorItem.errorMessages) ? (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        size="sm"
                                        color="#5ACE9F"
                                        className="mr-4 pointer"
                                      />
                                      <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        size="sm"
                                        color="#F16973"
                                        className="pointer"
                                        onClick={() => removeOne(errorItem)}
                                      />
                                    </>
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      size="sm"
                                      color="#F16973"
                                      className="pointer"
                                      onClick={() => removeOne(errorItem)}
                                    />
                                  )}
                                </div>
                              );
                            }
                            return errorItem[item.columnName];
                          };
                          return (
                            <Table.Td
                              key={cellIndex}
                              className={item.className}
                            >
                              {getNullTableItem(getContent())}
                            </Table.Td>
                          );
                        })}
                      </Table.Tr>
                      {errorReportsError && (
                        <div className="payroll-error d-block">
                          <div className="payroll-error-msg"></div>
                          <div
                            className={
                              showClass
                                ? "text-ellipse payroll-error-msg"
                                : "payroll-error-msg pointer"
                            }
                            onClick={fullText}
                          >
                            {errorReportsError}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
              </Table.Tbody>
            </Table>
          );
        }}
      </FieldArray>
      <Modal show={isModalOpen} onHide={handleClose}>
        <Modal.Body style={{ borderTop: "5px solid #f94f50" }}>
          <div className="text-right">
            <FontAwesomeIcon
              icon={faTimes}
              color="#000"
              onClick={handleClose}
            />
          </div>
          <div className="d-flex">
            <div className="pd-15">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                color="#f94f50"
                size="3x"
              />
            </div>
            <div className="remove-text">
              <h4>Delete Error ?</h4>
              <p>
                Are you sure you want to delete selected Loan details? Deleted
                information cannot be retrieved or restored
              </p>
              <br />
              <Button
                className="remove-btn mr-4"
                onClick={onDeleteConfirmClick}
              >
                Delete
              </Button>
              <Button className="cancel-btn" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PayrollErrorReport;
