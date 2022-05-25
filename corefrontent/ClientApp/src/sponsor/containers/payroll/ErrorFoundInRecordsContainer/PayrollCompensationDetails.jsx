import { filter, get, uniq } from "lodash";
import { Field, FieldArray, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import {
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
  FieldInputDollar,
} from "../../../../shared/components";
import {
  getNullTableItem,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  usDateFormat,
} from "../../../../shared/utils";
import { useDeepEffect } from "../../../../shared/abstracts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrashAlt,
  faTimes,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { Button, Modal } from "react-bootstrap";

// const paydates = [
//   { label: "12/01/2021", value: "12/01/2021" },
//   { label: "13/02/2021", value: "13/02/2021" },
//   { label: "14/03/2021", value: "14/03/2021" },
// ];
// let x = paydates.length === 1 ? paydates[0].value : null;
// console.log(x);

const columns = [
  {
    label: "Compensation",
    className: "column-contribution-description ft-12",
    columnName: "compensationType",
  },
  {
    label: "Amount",
    isField: true,
    className: "column-contribution-amount ft-12",
    columnName: "payPeriodAmount",
  },
  {
    label: "Action",
    className: "column-removebutton",
    columnName: "removebutton",
  },
];

const columns1 = [
  {
    label: "Description",
    className: "column-contribution-description ft-12",
    columnName: "compensationType",
  },
  {
    label: "Amount",
    isField: true,
    className: "column-contribution-amount ft-12",
    columnName: "ytdAmount",
  },
  {
    label: "Action",
    className: "column-removebutton",
    columnName: "removebutton",
  },
];

const hoursColumns = [
  {
    label: "PayDate",
    className: "column-select ft-12",
    columnName: "payDate",
  },
  {
    label: "Description",
    className: "column-contribution-description ft-12",
    columnName: "compensationType",
  },
  {
    label: "YTD",
    className: "column-contribution-amount ft-12",
    columnName: "ytdHours",
  },
  {
    label: "PayPeriod",
    className: "column-contribution-amount ft-12",
    columnName: "payPeriodHours",
  },
  {
    label: "AnnualSalary",
    className: "column-annual-salary ft-12",
    columnName: "annualSalary",
  },
];

const PayrollCompensationDetails = ({ fields, data, paydate }) => {
  const { values, setFieldValue, handleChange, errors } = useFormikContext();
  // const compensationDetails = get(values, fields.compensations, []);
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [filteredValues, setFilteredValues] = useState([]);
  const [recordToDelete, setRecordToDelete] = useState({});
  const [showClass, setShowClass] = useState(true);
  const [payDates, setPayDates] = useState([]);

  // useDeepEffect(() => {
  //   setFieldValue(fields.compensations, data);
  // }, [data]);

  let temp = data.map((_) => _.payDate);
  let paydates = temp.map((_) => usDateFormat(_));
  let uniquepaydates = [...new Set(paydates)];
  let x = uniquepaydates.length === 1 ? uniquepaydates[0] : null;

  useDeepEffect(() => {
    setFilteredValues(
      data.filter(
        (compensation) => compensation.payDate === values[fields.paydate]
      )
    );
  }, [values[fields.paydate]]);

  useDeepEffect(() => {
    const tempPayDates = data.map((compensation) => compensation.payDate);
    setPayDates(
      tempPayDates.filter(
        (item, i, tempPayDates) => tempPayDates.indexOf(item) === i
      )
    );
  }, [data]);

  const compensationDetailsRecordType =
    values[fields.compensationDetailsRecordType];

  useDeepEffect(
    () => {
      setFieldValue(
        fields.compensationDetails,
        filter(data, (item) => {
          return (
            !compensationDetailsRecordType ||
            (compensationDetailsRecordType === 1 && item.isError)
          );
        })
      );
    },
    [compensationDetailsRecordType],
    true
  );

  useEffect(() => {
    setFilteredValues(data);
    // console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const removeOne = (item, index) => {
    setIsModalOpen(true);
    setRecordToDelete(item);
  };

  const onDeleteConfirmClick = () => {
    const selectedId = get(recordToDelete, "planId");
    setFilteredValues(
      filteredValues.filter((item) => {
        return item.planId !== selectedId;
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
    <div className="payroll-compensation-details">
      <div className="plan-sub-heading">Compensation Details</div>
      <div className="ft-12 mb-20">
        Review and correct the compensation amounts. Use the action buttons
        above to update the employee’s record
      </div>
      <div className="d-flex justify-content-start">
        <Field
          isRequired
          label="Show"
          size="smd"
          placeholder="Show"
          name={`fields.compensationDetailsRecordType`}
          value={values[fields.compensationDetailsRecordType]}
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
                setFieldValue(fields.compensationDetailsRecordType, value)
              }
              selectedValue={values[fields.compensationDetailsRecordType]}
              name={fields.compensationDetailsRecordType}
              isNotTypeAhead
              isRadio
            />
          }
          component={FieldDropSide}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Field
          isRequired
          label="Pay date"
          size="smd"
          placeholder=""
          name={fields.paydate}
          value={x ? x : values[fields.paydate.value]}
          disabled={x ? "true" : null}
          direction="bottom"
          popupContent={
            <SearchableList
              label="Select pay date"
              options={uniquepaydates.map((date) => ({
                label: date,
                value: date,
              }))}
              onSelect={(value) => setFieldValue([fields.paydate.value], value)}
              selectedValue={values[fields.paydate]}
              name={fields.paydate}
              isNotTypeAhead
              isRadio
            />
          }
          component={FieldDropSide}
        />
      </div>
      <FieldArray name={fields.compensationDetails}>
        {({ push, remove }) => {
          return (
            <Table className="compensationDetails">
              <Table.Thead>
                <Table.Tr colSpan="2">
                  {columns.map((item, index) => {
                    return (
                      <Table.Th
                        colSpan="10"
                        key={index}
                        className={item.className}
                        className="col-md-4"
                      >
                        {item.label}
                      </Table.Th>
                    );
                  })}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredValues.map((compensation, index) => {
                  const contributionError = get(
                    errors,
                    `compensationDetails[${index}].errors`
                  );
                  return (
                    <>
                      <Table.Tr key={index}>
                        {compensation.compensationType
                          ? columns.map((item, cellIndex) => {
                              const getContent = () => {
                                const fieldName = `${fields.compensationDetails}[${index}].${item.columnName}`;
                                if (item.columnName === "errorMessage") {
                                  return (
                                    <div className="mt-10">
                                      {compensation.errorMessage ? (
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
                                            onClick={() =>
                                              removeOne(compensation)
                                            }
                                          />
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                }
                                if (item.columnName === "compensationType") {
                                  return compensation[item.columnName] === "GRP"
                                    ? "Pay Period Gross"
                                    : "Pay Period Plan";
                                }
                                if (item.columnName === "removebutton") {
                                  return [
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      size="sm"
                                      color="#F16973"
                                      className="pointer"
                                      onClick={() => removeOne(item, index)}
                                    />,
                                    <span>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>,
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      size="md"
                                      color="green"
                                      className="pointer"
                                    />,
                                  ];
                                }

                                return item.isField ? (
                                  <Field
                                    size="xs"
                                    name={fieldName}
                                    autoComplete="off"
                                    disabled={values.modeOfCompensation !== 1}
                                    //value={0}
                                    // value={values[fieldName]}
                                    onChange={handleChange}
                                    component={FieldInputDollar}
                                  />
                                ) : (
                                  compensation[item.columnName]
                                );
                              };
                              return (
                                <Table.Td
                                  key={cellIndex}
                                  className="compensationDetails col-md-4"
                                >
                                  {getNullTableItem(getContent())}
                                </Table.Td>
                              );
                            })
                          : null}
                      </Table.Tr>

                      <Table.Tr key={index}>
                        {compensation.compensationType
                          ? columns1.map((item, cellIndex) => {
                              const getContent = () => {
                                const fieldName = `${fields.compensationDetails}[${index}].${item.columnName}`;
                                if (item.columnName === "errorMessage") {
                                  return (
                                    <div className="mt-10">
                                      {compensation.errorMessage ? (
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
                                            onClick={() =>
                                              removeOne(compensation)
                                            }
                                          />
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                }
                                if (item.columnName === "compensationType") {
                                  return compensation[item.columnName] === "GRP"
                                    ? "Calendar YTD Gross"
                                    : "Calendar YTD Plan";
                                }
                                // if (item.columnName === "removebutton") {
                                //   return (
                                //     <FontAwesomeIcon
                                //       icon={faTrashAlt}
                                //       size="sm"
                                //       color="#F16973"
                                //       className="pointer"
                                //       onClick={() =>
                                //         remove(index)
                                //       }
                                //     />
                                //   );
                                // }
                                return item.isField ? (
                                  <Field
                                    size="xs"
                                    name={fieldName}
                                    autoComplete="off"
                                    disabled={values.modeOfCompensation === 1}
                                    // value={values[fieldName]}
                                    //value={0}
                                    onChange={handleChange}
                                    component={FieldInputDollar}
                                  />
                                ) : (
                                  compensation[item.columnName]
                                );
                              };
                              return (
                                <Table.Td
                                  key={cellIndex}
                                  className="compensationDetails col-md-4"
                                >
                                  {getNullTableItem(getContent())}
                                </Table.Td>
                              );
                            })
                          : null}
                      </Table.Tr>
                      {contributionError && (
                        <div className="payroll-error d-block">
                          <div className="payroll-error-msg">
                            Error code: {compensation.errorCode}
                          </div>
                          <div
                            className={
                              showClass
                                ? "text-ellipse payroll-error-msg"
                                : "payroll-error-msg pointer"
                            }
                            onClick={fullText}
                          >
                            {contributionError}
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
                Are you sure you want to delete selected Compensation details?
                Deleted information cannot be retrieved or restored
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

export default PayrollCompensationDetails;
