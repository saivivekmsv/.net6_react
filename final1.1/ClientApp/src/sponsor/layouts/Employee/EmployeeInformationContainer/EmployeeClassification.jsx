import React, { useState } from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { get, isEmpty } from "lodash";
import { usDateFormat, errors } from "../../../../shared/utils"
import {
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
  DatePicker,
  Link,
  SliderPanel,
} from "../../../../shared/components";
import EmployeeClassifictionSliderTable from "./EmployeeClassification/EmployeeClassifictionSliderTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import {
  getEmployeeClassificationName,
  getEmployeeClassificationType,
} from "../../../services";
import { useRequest } from "../../../../shared/abstracts"

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

const EmployeeClassificationFields = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sidePanelData, setSidePanelData] = useState({});
  const [classificationList, setClassificationList] = useState([]);
  const { fields, isEdit, isSave } = props;

  const onViewButtonClick = (data) => {
    setSidePanelData(data);
    setModalOpen(true);
  };
  const { values, setFieldValue } = useFormikContext();
  const employeeClassificationList = get(values, "employeeClassifications", []);
  const disabled = isEdit && !isSave;

  const { response: classifications } = useRequest({
    method: getEmployeeClassificationType,
    payload: values.companyId,
    defaultResponse: [],
  });

  // useEffect(() => {
  //   setFieldValue("employeeClassifications", employeeClassificationList);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div>
      <div className="census-employee-classification">
        <div className="w-100">
          <div className="d-flex justify-content-between mb-4">
            <div className="">
              <div className="m-0 plan-sub-heading mt-2">
                Employee Classification
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
                    {employeeClassificationList.map(
                      (employeeDetails, index) => {
                        return (
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
                                {
                                  /* if (
                                  ["classificationTypeName"].includes(
                                    columnName
                                  ) &&
                                  !isEmpty(get(employeeDetails, columnName))
                                ) {
                                  return (
                                    <Link
                                      onClick={() =>
                                        onViewButtonClick(employeeDetails)
                                      }
                                    >
                                      {employeeDetails[item.columnName]}
                                    </Link>
                                  );
                                } else if ( */
                                }
                                if (
                                  ["classificationTypeName"].includes(
                                    columnName
                                  )
                                ) {
                                  return (
                                    <Field
                                      size="sm"
                                      name={columnName}
                                      value={get(employeeDetails, columnName)}
                                      popupContent={
                                        <SearchableList
                                          label="Select Classification Type"
                                          options={
                                            classifications &&
                                            classifications.map(
                                              (classification, index) => ({
                                                label:
                                                  classification.classificationTypeName,
                                                value: classification.id,
                                              })
                                            )
                                          }
                                          onSelect={(value) => {
                                            setFieldValue(
                                              fieldName,
                                              classifications.find(
                                                (_) => _.id === value
                                              ).classificationTypeName
                                            );
                                            setFieldValue(
                                              fields.classificationType,
                                              classifications.find(
                                                (_) => _.id === value
                                              ).classificationTypeName
                                            );
                                            getEmployeeClassificationName(value)
                                              .then((response) => {
                                                setClassificationList(response);
                                              })
                                              .catch((error) => {
                                                console.log(error);
                                              });
                                          }}
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
                                      name={columnName}
                                      value={get(employeeDetails, columnName)}
                                      popupContent={
                                        <SearchableList
                                          label="Select Classification Code"
                                          options={
                                            classificationList &&
                                            classificationList.map(
                                              (classification, index) => ({
                                                label: classification.code,
                                                value: index,
                                              })
                                            )
                                          }
                                          onSelect={(value) => {
                                            setFieldValue(
                                              fieldName,
                                              classificationList[value].code
                                            );
                                            setFieldValue(
                                              fields.classificationName,
                                              classificationList[value].code
                                            );
                                          }}
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
                                          label="Select Classification"
                                          options={
                                            classificationList &&
                                            classificationList.map(
                                              (classification, index) => ({
                                                label: classification.name,
                                                value: index,
                                              })
                                            )
                                          }
                                          onSelect={(value) => {
                                            setFieldValue(
                                              fieldName,
                                              classificationList[value].name
                                            );
                                            setFieldValue(
                                              fields.classificationName,
                                              classificationList[value].name
                                            );
                                          }}
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
                                  ["effectiveStartDate"].includes(columnName)
                                ) {
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

                                if (["effectiveEndDate"].includes(columnName)) {
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
