import { Field, FieldArray, useFormikContext } from "formik";
import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
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
// import plan from "shared/mockslanName.json";
import { filter, get } from "lodash";
import { useDeepEffect } from "../../../../shared/abstracts";
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
  // {
  //   label: "Select",
  //   className: "column-select",
  //   columnName: "",
  // },
  {
    label: "Plan ID",
    className: "column-compensation-planid ft-12",
    columnName: "planId",
  },
  {
    label: "Contribution source",
    className: "column-compensation-contribution-src ft-12",
    columnName: "sourceName",
  },
  {
    label: "Contribution Amount",
    className: "column-compensation-contribution-amt ft-12",
    columnName: "contributionAmount",
  },
  {
    label: "Calculated value",
    className: "column-compensation-calculated-value ft-12",
    columnName: "calculatedValue",
  },
  {
    label: "Action",
    className: "column-removebutton",
    columnName: "removebutton",
  },
];

const PayrollContributionDetails = ({ fields, data, paydate }) => {
  const {
    values,
    setFieldValue,
    handleChange,
    errors,
    setFieldError,
  } = useFormikContext();
  // const contributionsDetails = get(values, fields.contributionsDetails, []);
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [filteredValues, setFilteredValues] = useState([]);
  const [recordToDelete, setRecordToDelete] = useState({});
  const [showClass, setShowClass] = useState(true);
  const [payDates, setPayDates] = useState([]);
  let contAmt = 0,
    calcAmt = 0;

  let temp = data.map((_) => _.payDate);
  let paydates = temp.map((_) => usDateFormat(_));
  let uniquepaydates = [...new Set(paydates)];
  let x = uniquepaydates.length === 1 ? uniquepaydates[0] : null;
  useEffect(() => {
    // console.log("s")
    data.forEach((contribution, index) => {
      if (
        !values[fields.planId] ||
        contribution.rkPlanNumber === values[fields.planId]
      ) {
        contribution?.errorMessages?.forEach((_, i) => {
          setFieldError(
            `${fields.contributionsDetails}[${index}].contributionAmount`,
            _.messageDescCode
          );
        });
      }
    });
  }, [data]);
  useDeepEffect(() => {
    setFilteredValues(
      values[fields.planId]
        ? data.filter(
            (contribution) =>
              contribution.rkPlanNumber === values[fields.planId] &&
              contribution.payDate === values[fields.paydateContribution]
          )
        : data.filter(
            (contribution) =>
              contribution.payDate === values[fields.paydateContribution]
          )
    );
  }, [values[fields.paydateContribution]]);

  useDeepEffect(() => {
    let tempPayDates = values[fields.planId]
      ? data.filter(
          (contribution) => contribution.rkPlanNumber === values[fields.planId]
        )
      : data;
    tempPayDates = tempPayDates.map((contribution) => contribution.payDate);
    setPayDates(
      tempPayDates.filter(
        (item, i, tempPayDates) => tempPayDates.indexOf(item) === i
      )
    );
  }, [data]);

  useDeepEffect(() => {
    setFieldValue(fields.contributionsDetails, data);
  }, [data]);

  const contributionDetailsRecordType =
    values[fields.contributionDetailsRecordType];

  useDeepEffect(
    () => {
      setFieldValue(
        fields.contributionsDetails,
        filter(data, (item) => {
          return (
            !contributionDetailsRecordType ||
            (contributionDetailsRecordType === 1 && item.isError)
          );
        })
      );
    },
    [contributionDetailsRecordType],
    true
  );

  useEffect(() => {
    setFilteredValues(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const removeOne = (item) => {
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
    <div className="payroll-contribution-details">
      <div className="plan-sub-heading">Contribution Details</div>
      <div className="ft-12 mb-20">
        Review and correct the contribution amounts. Use the action buttons
        above to update the employee’s record
      </div>
      <div className="d-flex">
        <Field
          isRequired
          label="Show"
          size="smd"
          placeholder="Show"
          name={fields.contributionDetailsRecordType}
          value={values[fields.contributionDetailsRecordType]}
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
                setFieldValue(fields.contributionDetailsRecordType, value)
              }
              selectedValue={values[fields.contributionDetailsRecordType]}
              name={fields.contributionDetailsRecordType}
              isNotTypeAhead
              isRadio
            />
          }
          component={FieldDropSide}
        />
        &nbsp;&nbsp;&nbsp;
        {/* <Field
          isRequired
          label="Pay date"
          size="smd"
          placeholder=""
          name={fields.paydateContribution}
          // value={usDateFormat(values[fields.paydateContribution])}
          value={x ? x : usDateFormat(values[fields.paydateContribution])}
          disabled={x ? "true" : null}
          direction="bottom"
          popupContent={
            <SearchableList
              label="Select pay date"
              options={payDates.map((date) => ({
                label: usDateFormat(date),
                value: date,
              }))}
              // options = {paydates}
              onSelect={(value) =>
                setFieldValue(fields.paydateContribution, value)
              }
              selectedValue={usDateFormat(values[fields.payDates])}
              name={fields.paydateContribution}
              isNotTypeAhead
              isRadio
            />
          }
          component={FieldDropSide}
        /> */}
        <Field
          isRequired
          label="Pay date"
          size="smd"
          placeholder=""
          name={fields.paydateContribution}
          value={x ? x : values[fields.paydateContribution.value]}
          disabled={x ? "true" : null}
          direction="bottom"
          popupContent={
            <SearchableList
              label="Select pay date"
              options={uniquepaydates.map((date) => ({
                label: date,
                value: date,
              }))}
              onSelect={(value) =>
                setFieldValue([fields.paydateContribution.value], value)
              }
              selectedValue={values[fields.paydate]}
              name={fields.paydateContribution}
              isNotTypeAhead
              isRadio
            />
          }
          component={FieldDropSide}
        />
      </div>
      <FieldArray name={fields.contributionsDetails}>
        {() => {
          return (
            <Table className="compensation-details">
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
                {filteredValues.map((contribution, index) => {
                  const contributionError = get(
                    errors,
                    `contributions[${index}].contributionAmount`
                  );
                  return (
                    <>
                      <Table.Tr key={index}>
                        {columns.map((item, cellIndex) => {
                          const getContent = () => {
                            const fieldName = `${fields.contributionsDetails}[${index}].${item.columnName}`;
                            if (item.columnName === "planId") {
                              return contribution.rkPlanNumber;
                            } else if (
                              item.columnName === "contributionAmount"
                            ) {
                              // contAmt=contribution[item.columnName]
                              return (
                                <>
                                  <Field
                                    name={fieldName}
                                    autoComplete="off"
                                    // value={
                                    //   values[contribution[item.columnName]]
                                    // }
                                    // value={contAmt}
                                    onChange={handleChange}
                                    component={FieldInputDollar}
                                  />
                                </>
                              );
                            } else if (item.columnName === "calculatedValue") {
                              if (
                                contribution.sourceType === "EmployerSources" &&
                                (contribution.responsibleMode === "Core" ||
                                  contribution.responsibleMode === "Validate")
                              ) {
                                return (
                                  <>
                                    {contribution.calculatedContributionAmount}
                                  </>
                                );
                              }
                              return <></>;
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

                            if (item.columnName === "errorMessage") {
                              return (
                                <div className="mt-10">
                                  {contribution.errorMessage &&
                                  contribution.errorMessages ? (
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
                                        onClick={() => removeOne(contribution)}
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              );
                            }
                            return contribution[item.columnName];
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
                      {contributionError && (
                        <div className="payroll-error d-block">
                          <div className="payroll-error-msg">
                            {contribution.errorCode}
                          </div>
                          <div
                            className={
                              showClass
                                ? "text-ellipse payroll-error-msg"
                                : "payroll-error-msg pointer"
                            }
                            onClick={fullText}
                          >
                            {`${contributionError}`}
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
                Are you sure you want to delete selected Contribution details?
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

export default PayrollContributionDetails;
