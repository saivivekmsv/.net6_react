import React, { useState } from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { get, isEmpty } from "lodash";
import { usDateFormat } from "../../../../shared/utils";
import {
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
  DatePicker,
  Link,
  EmployeeClassificationTypeDropdown,
} from "../../../../shared/components";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { useDeepEffect } from "../../../../shared/abstracts";
import {
  getEmployeeClassificationType,
  getClassificationCodes,
  getCompanyDetails,
} from "../../../services";

const columns = [
  {
    label: "Classification type",
    className: "column-classificationType",
    columnName: "classificationTypeName",
    link: `link`,
  },
  {
    label: "Classification code",
    className: "column-classificationCode",
    columnName: "code",
  },
  {
    label: "Classification name",
    className: "column-classificationName",
    columnName: "classificationName",
  },
  {
    label: "Start date",
    className: "column-startDate",
    columnName: "startDate",
  },
  {
    label: "End date",
    className: "column-endDate",
    columnName: "endDate",
  },
  {
    label: " ",
    className: "column-removebutton",
    columnName: "removebutton",
  },
];

const CensusFormEmployeeClassification = ({ fields, isEdit, isSave }) => {
  const [setModalOpen] = useState(false);
  const [setSidePanelData] = useState({});
  const [showClass, setShowClass] = useState(true);

  const fullText = () => {
    setShowClass(!showClass);
  };

  const onViewButtonClick = (data) => {
    setSidePanelData(data);
    setModalOpen(true);
  };

  const { values, setFieldValue, errors } = useFormikContext();
  const employeeClassificationList = get(values, "employeeClassifications", []);
  const disabled = isEdit && !isSave;

  const [
    employeeClassificationTypes,
    setEmployeeClassificationTypes,
  ] = useState([]);
  const [
    employeeClassificationCodes,
    setEmployeeClassificationCodes,
  ] = useState([]);
  const [
    employeeClassificationNames,
    setEmployeeClassificationNames,
  ] = useState([]);
  const [company, setCompany] = useState({});

  useDeepEffect(() => {
    getEmployeeClassificationType(values.companyId)
      .then((response) => {
        setEmployeeClassificationTypes(
          response.map((val) => ({
            label: val.classificationTypeName,
            value: val.classificationTypeName,
          }))
        );
      })
      .catch((error) => {
        //Handle Error
      });

    getClassificationCodes(values.companyId)
      .then((response) => {
        setEmployeeClassificationCodes(
          response.map((val) => ({
            label: val.code,
            value: val.code,
          }))
        );
        setEmployeeClassificationNames(
          response.map((val) => ({
            label: val.classificationName,
            value: val.classificationName,
          }))
        );
      })
      .catch((error) => {
        //Handle Error
      });
  }, []);

  useEffect(() => {
    setFieldValue("employeeClassifications", employeeClassificationList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="census-employee-classification">
        <div className="w-100">
          <div className="d-flex justify-content-between mb-4">
            <div className="">
              <div className="m-0 plan-sub-heading mt-2">
                Employee Classification{" "}
              </div>
            </div>
          </div>
        </div>
        {disabled === true ? (
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
              {employeeClassificationList.map((source, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {!isEmpty(item.link) ? (
                            <Link
                              onClick={() =>
                                onViewButtonClick({
                                  sourceName: get(source, "sourceName"),
                                  data: get(source, "history", []),
                                })
                              }
                            >
                              {source[item.columnName]}
                            </Link>
                          ) : item.dataMapper ? (
                            item.dataMapper[source[item.columnName]]
                          ) : (
                            source[item.columnName]
                          )}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        ) : (
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
            <FieldArray name="employeeClassifications">
              {({ push, remove }) => {
                return (
                  <Table.Tbody>
                    {get(values, "employeeClassifications", []).map(
                      (employeeDetails, index) => {
                        const employeeError = get(
                          errors,
                          `employeeClassifications[${index}].type`
                        );
                        return (
                          <>
                            <Table.Tr key={index}>
                              {columns.map((item, cellIndex) => {
                                const getContent = () => {
                                  const columnName = item.columnName;
                                  const fieldName = `employeeClassifications[${index}].${columnName}`;
                                  const onDaySelected = (name, value) => {
                                    setFieldValue(name, value);
                                  };

                                  if (item.dataMapper) {
                                    return item.dataMapper[
                                      employeeDetails[columnName]
                                    ];
                                  }
                                  if (
                                    ["classificationTypeName"].includes(
                                      columnName
                                    )
                                  ) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={fieldName}
                                        value={get(
                                          employeeDetails,
                                          "classificationTypeName"
                                        )}
                                        //options={company.data.map((value) => ({
                                        //   label: value,
                                        //   value,
                                        // }))}
                                        popupContent={
                                          <SearchableList
                                            label="Select Classification Type"
                                            options={
                                              employeeClassificationTypes
                                            }
                                            onSelect={(value) =>
                                              setFieldValue(fieldName, value)
                                            }
                                            selectedValue={get(
                                              employeeDetails,
                                              columnName
                                            )}
                                          />
                                        }
                                        disabled={isEdit && !isSave}
                                        component={FieldDropSide}
                                      />
                                    );
                                  }

                                  if (["code"].includes(columnName)) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={fieldName}
                                        value={get(employeeDetails, "code")}
                                        popupContent={
                                          <SearchableList
                                            label="Select Classification code"
                                            options={
                                              employeeClassificationCodes
                                            }
                                            onSelect={(value) =>
                                              setFieldValue(fieldName, value)
                                            }
                                            selectedValue={get(
                                              employeeDetails,
                                              columnName
                                            )}
                                          />
                                        }
                                        disabled={isEdit && !isSave}
                                        component={FieldDropSide}
                                      />
                                    );
                                  }

                                  if (
                                    ["classificationName"].includes(columnName)
                                  ) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={fieldName}
                                        value={get(
                                          employeeDetails,
                                          "classificationName"
                                        )}
                                        popupContent={
                                          <SearchableList
                                            label="Select Classification Name"
                                            options={
                                              employeeClassificationNames
                                            }
                                            onSelect={(value) =>
                                              setFieldValue(fieldName, value)
                                            }
                                            selectedValue={get(
                                              employeeDetails,
                                              columnName
                                            )}
                                          />
                                        }
                                        disabled={isEdit && !isSave}
                                        component={FieldDropSide}
                                      />
                                    );
                                  }

                                  if (["startDate"].includes(columnName)) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={fieldName}
                                        value={usDateFormat(
                                          get(
                                            employeeDetails,
                                            "effectiveStartDate"
                                          )
                                        )}
                                        direction="bottom"
                                        isDatePicker
                                        onClear={() =>
                                          onDaySelected(fieldName, "")
                                        }
                                        popupContent={
                                          <DatePicker
                                            onDayClick={(value) =>
                                              onDaySelected(fieldName, value)
                                            }
                                            value={values[fieldName]}
                                          />
                                        }
                                        component={FieldDropSide}
                                        disabled={isEdit && !isSave}
                                      />
                                    );
                                  }

                                  if (["endDate"].includes(columnName)) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={fieldName}
                                        value={usDateFormat(
                                          get(
                                            employeeDetails,
                                            "effectiveEndDate"
                                          )
                                        )}
                                        direction="bottom"
                                        isDatePicker
                                        onClear={() =>
                                          onDaySelected(fieldName, "")
                                        }
                                        popupContent={
                                          <DatePicker
                                            onDayClick={(value) =>
                                              onDaySelected(fieldName, value)
                                            }
                                            value={values[fieldName]}
                                          />
                                        }
                                        component={FieldDropSide}
                                        disabled={isEdit && !isSave}
                                      />
                                    );
                                  }

                                  if (item.columnName === "removebutton") {
                                    return (
                                      <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        onClick={() => remove(index)}
                                      />
                                    );
                                  }
                                  return employeeDetails[columnName];
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
                            {employeeError && (
                              <div className="payroll-error d-block">
                                <div
                                  className={
                                    showClass
                                      ? "text-ellipse payroll-error-msg"
                                      : "payroll-error-msg pointer"
                                  }
                                  onClick={fullText}
                                >
                                  {employeeError}
                                  {/* <ul className="error-list-style">
                                    {employeeError.map((item) => (
                                      <li>{item}</li>
                                    ))}
                                  </ul> */}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      }
                    )}
                    <Link onClick={() => push({})} className="link-area">
                      Add Employee Classification
                    </Link>
                  </Table.Tbody>
                );
              }}
            </FieldArray>
          </Table>
        )}
      </div>
    </div>
  );
};

export default CensusFormEmployeeClassification;
