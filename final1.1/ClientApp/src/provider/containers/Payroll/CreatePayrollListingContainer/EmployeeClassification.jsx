import React, { useState } from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { get, isEmpty } from "lodash";
import { usDateFormat } from "../../../utils";
import {
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
  DatePicker,
  Link,
  SliderPanel,
} from "../../../components";
import company from "../../../mocks/company.json";
import EmployeeClassifictionSliderTable from "./EmployeeClassification/EmployeeClassifictionSliderTable";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";

const columns = [
  {
    label: "Classification type",
    className: "column-classificationType",
    columnName: "classificationType",
    link: `link`,
  },
  {
    label: "Classification code",
    className: "column-classificationCode",
    columnName: "classificationCode",
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

const EmployeeClassificationFields = ({ fields, isEdit, isSave }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sidePanelData, setSidePanelData] = useState({});

  const onViewButtonClick = (data) => {
    setSidePanelData(data);
    setModalOpen(true);
  };

  const { values, setFieldValue } = useFormikContext();
  const employeeClassificationList = get(values, "employeeClassification", []);
  const disabled = isEdit && !isSave;

  useEffect(() => {
    setFieldValue("employeeClassification", employeeClassificationList);
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
            <FieldArray name="employeeClassification">
              {({ push, remove }) => {
                return (
                  <Table.Tbody>
                    {get(values, "employeeClassification", []).map(
                      (employeeDetails, index) => {
                        return (
                          <Table.Tr key={index}>
                            {columns.map((item, cellIndex) => {
                              const getContent = () => {
                                const columnName = item.columnName;
                                const fieldName = `employeeClassification[${index}].${columnName}`;
                                const onDaySelected = (name, value) => {
                                  setFieldValue(name, value);
                                };

                                if (item.dataMapper) {
                                  return item.dataMapper[
                                    employeeDetails[columnName]
                                  ];
                                }
                                if (
                                  ["classificationType"].includes(columnName)
                                ) {
                                  return (
                                    <Field
                                      size="sm"
                                      name={columnName}
                                      value={get(employeeDetails, columnName)}
                                      popupContent={
                                        <SearchableList
                                          label="Select Company"
                                          options={company.data.map(
                                            (value) => ({
                                              label: value,
                                              value,
                                            })
                                          )}
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
                                  ["classificationCode"].includes(columnName)
                                ) {
                                  return (
                                    <Field
                                      size="sm"
                                      name={columnName}
                                      value={get(employeeDetails, columnName)}
                                      popupContent={
                                        <SearchableList
                                          label="Select Company"
                                          options={company.data.map(
                                            (value) => ({
                                              label: value,
                                              value,
                                            })
                                          )}
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
                                      name={columnName}
                                      value={get(employeeDetails, columnName)}
                                      popupContent={
                                        <SearchableList
                                          label="Select Company"
                                          options={company.data.map(
                                            (value) => ({
                                              label: value,
                                              value,
                                            })
                                          )}
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
                                      name={columnName}
                                      value={usDateFormat(
                                        get(employeeDetails, columnName)
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
                                      name={columnName}
                                      value={usDateFormat(
                                        get(employeeDetails, columnName)
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
        <SliderPanel
          isOpen={isModalOpen}
          size="80"
          onClose={() => setModalOpen(false)}
        >
          <EmployeeClassifictionSliderTable data={sidePanelData} />
        </SliderPanel>
        <br />
      </div>
    </div>
  );
};

export default EmployeeClassificationFields;
