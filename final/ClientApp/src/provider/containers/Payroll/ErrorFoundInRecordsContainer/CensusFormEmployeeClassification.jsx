import React, { useState } from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { get, isEmpty, toLower } from "lodash";
import { usDateFormat } from "../../../utils";
import {
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
  DatePicker,
  Link,
  SliderPanel,
} from "../../../components";
import { useEffect } from "react";
import { useDeepEffect, useRequest } from "../../../abstracts";
import {
  getEmployeeClassificationType,
  getClassificationCodes,
} from "../../../services";
import EmployeeClassifictionSliderTable from "../../Employee/EmployeeInformationContainer/EmployeeClassification/EmployeeClassifictionSliderTable";

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
    columnName: "effectiveStartDate",
  },
  {
    label: "End date",
    className: "column-endDate",
    columnName: "effectiveEndDate",
  },
  {
    label: " ",
    className: "column-removebutton",
    columnName: "removebutton",
  },
];

const CensusFormEmployeeClassification = ({
  id,
  isEdit,
  isSave,
  awaitingFunding,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sidePanelData, setSidePanelData] = useState({});
  const [showClass, setShowClass] = useState(true);

  const fullText = () => {
    setShowClass(!showClass);
  };
  const onViewButtonClick = (data) => {
    setSidePanelData(data);
    setModalOpen(true);
  };

  const { response: classifications } = useRequest({
    method: getEmployeeClassificationType,
    payload: id,
    defaultResponse: [],
  });

  const { values, setFieldValue, errors } = useFormikContext();
  const employeeClassificationList = get(values, "employeeClassifications", []);
  const disabled = isEdit && !isSave;

  useEffect(() => {
    setFieldValue("employeeClassifications", employeeClassificationList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNameNull = (index, code) => {
    const name = classifications[index].classifications.filter(
      (_) => toLower(_.code) === toLower(code)
    );
    return name[0]?.name;
  };

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
                            <Link onClick={() => onViewButtonClick(source)}>
                              {source[item.columnName]}
                            </Link>
                          ) : item.dataMapper ? (
                            item.dataMapper[source[item.columnName]]
                          ) : item.columnName == "effectiveStartDate" ||
                            item.columnName == "effectiveEndDate" ? (
                            usDateFormat(source[item.columnName])
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
                    {classifications &&
                      classifications.map((employeeDetails, index) => {
                        const employeeError = get(
                          errors,
                          `employeeClassifications[${index}].type`
                        );
                        return (
                          <>
                            <Table.Tr key={index}>
                              {columns.map((item, cellIndex) => {
                                if (isEmpty(employeeClassificationList)) {
                                  setFieldValue(
                                    `employeeClassifications[${index}].${item.columnName}`,
                                    null
                                  );
                                }
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
                                  if (["code"].includes(columnName)) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={`employeeClassifications[${index}].code`}
                                        value={
                                          !isEmpty(
                                            employeeClassificationList
                                          ) &&
                                          employeeClassificationList[index]
                                            ?.code
                                        }
                                        popupContent={
                                          <SearchableList
                                            label="Select Classification Code"
                                            options={
                                              classifications &&
                                              classifications[
                                                index
                                              ].classifications.map(
                                                (classification, index) => ({
                                                  label: classification.code,
                                                  value: index,
                                                })
                                              )
                                            }
                                            onSelect={(value) => {
                                              var data =
                                                classifications[index]
                                                  .classifications[value];
                                              setFieldValue(
                                                fieldName,
                                                data.code
                                              );
                                              setFieldValue(
                                                `employeeClassifications[${index}].classificationId`,
                                                data.id
                                              );
                                              setFieldValue(
                                                `employeeClassifications[${index}].classificationName`,
                                                data.name
                                              );
                                              setFieldValue(
                                                `employeeClassifications[${index}].classificationTypeName`,
                                                classifications[index]
                                                  .classificationTypeName
                                              );
                                            }}
                                            selectedValue={
                                              !isEmpty(
                                                employeeClassificationList
                                              ) &&
                                              employeeClassificationList[index]
                                                ?.code
                                            }
                                          />
                                        }
                                        disabled={
                                          (isEdit && !isSave) || awaitingFunding
                                        }
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
                                        value={
                                          !isEmpty(
                                            employeeClassificationList
                                          ) &&
                                          employeeClassificationList[index] &&
                                          employeeClassificationList[index]
                                            ?.classificationName == null
                                            ? (employeeClassificationList[
                                                index
                                              ].classificationName = isNameNull(
                                                index,
                                                employeeClassificationList[
                                                  index
                                                ]?.code
                                              ))
                                            : employeeClassificationList[index]
                                                ?.classificationName
                                        }
                                        popupContent={
                                          <SearchableList
                                            label="Select Classification"
                                            options={
                                              classifications &&
                                              classifications[
                                                index
                                              ].classifications.map(
                                                (classification, index) => ({
                                                  label: classification.name,
                                                  value: index,
                                                })
                                              )
                                            }
                                            onSelect={(value) => {
                                              var data =
                                                classifications[index]
                                                  .classifications[value];
                                              setFieldValue(
                                                fieldName,
                                                data.name
                                              );
                                              setFieldValue(
                                                `employeeClassifications[${index}].code`,
                                                data.code
                                              );
                                            }}
                                            selectedValue={
                                              !isEmpty(
                                                employeeClassificationList
                                              ) &&
                                              employeeClassificationList[index]
                                                ?.classificationName
                                            }
                                          />
                                        }
                                        disabled={
                                          (isEdit && !isSave) || awaitingFunding
                                        }
                                        component={FieldDropSide}
                                      />
                                    );
                                  }

                                  if (
                                    ["effectiveStartDate"].includes(columnName)
                                  ) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={`employeeClassifications[${index}].effectiveStartDate`}
                                        value={
                                          !isEmpty(
                                            employeeClassificationList
                                          ) &&
                                          usDateFormat(
                                            employeeClassificationList[index]
                                              ?.effectiveStartDate
                                          )
                                        }
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
                                            value={
                                              employeeClassificationList[index]
                                                ?.effectiveStartDate
                                            }
                                          />
                                        }
                                        component={FieldDropSide}
                                        disabled={
                                          (isEdit && !isSave) || awaitingFunding
                                        }
                                      />
                                    );
                                  }

                                  if (
                                    ["effectiveEndDate"].includes(columnName)
                                  ) {
                                    return (
                                      <Field
                                        size="sm"
                                        name={`employeeClassifications[${index}].effectiveEndDate`}
                                        value={
                                          !isEmpty(
                                            employeeClassificationList
                                          ) &&
                                          usDateFormat(
                                            employeeClassificationList[index]
                                              ?.effectiveEndDate
                                          )
                                        }
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
                                            value={
                                              employeeClassificationList[index]
                                                ?.effectiveStartDate
                                            }
                                          />
                                        }
                                        component={FieldDropSide}
                                        disabled={
                                          (isEdit && !isSave) || awaitingFunding
                                        }
                                      />
                                    );
                                  }
                                  return (
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "normal",
                                      }}
                                    >
                                      <Link
                                        onClick={() =>
                                          onViewButtonClick(
                                            employeeClassificationList[index]
                                          )
                                        }
                                      >
                                        {employeeDetails[columnName]}
                                      </Link>
                                    </div>
                                  );
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
                      })}
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

export default CensusFormEmployeeClassification;
