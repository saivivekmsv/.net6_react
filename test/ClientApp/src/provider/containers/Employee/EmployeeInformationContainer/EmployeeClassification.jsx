import React, { useState, useEffect } from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { get, isEmpty } from "lodash";
import { usDateFormat, errors } from "../../../utils";
import {
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
  DatePicker,
  Link,
  SliderPanel,
} from "../../../components";
import EmployeeClassifictionSliderTable from "./EmployeeClassification/EmployeeClassifictionSliderTable";
import { getEmployeeClassificationType } from "../../../services";
import { useRequest } from "../../../abstracts";

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
    label: "Classification Start date",
    className: "column-startDate",
    columnName: "effectiveStartDate",
  },
  {
    label: "Classification End date",
    className: "column-endDate",
    columnName: "effectiveEndDate",
  },
];

const EmployeeClassificationFields = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sliderEdit, setSliderEdit] = useState(true);
  const [sidePanelData, setSidePanelData] = useState({});
  const [status, setStatus] = useState(false);
  const {
    fields,
    isEdit,
    isSave,
    classificationErrors,
    toggle,
    changeInCmpyId,
    isCmpy,
  } = props;

  const onViewButtonClick = (data) => {
    setSidePanelData(data);
    setModalOpen(true);
  };
  const { values, setFieldValue, setFieldError } = useFormikContext();
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
                            item.dataMapper[source[item.columnName]] || "-"
                          ) : item.columnName == "effectiveStartDate" ||
                            item.columnName == "effectiveEndDate" ? (
                            usDateFormat(source[item.columnName]) || "-"
                          ) : (
                            source[item.columnName] || "-"
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
                        return (
                          <Table.Tr key={index}>
                            {columns.map((item, cellIndex) => {
                              if (!status) {
                                var _ = changeInCmpyId(values.companyId);
                                if (_) {
                                  setStatus(true);
                                  setFieldValue(
                                    `employeeClassifications[${index}].${item.columnName}`,
                                    null
                                  );
                                }
                              }
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
                                        employeeClassificationList[index] !=
                                          undefined &&
                                        employeeClassificationList[index].code
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
                                            setFieldValue(fieldName, data.code);
                                            setFieldValue(
                                              fields.classificationCode,
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
                                            employeeClassificationList[index] !=
                                              undefined &&
                                            employeeClassificationList[index]
                                              .code
                                          }
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
                                      value={
                                        employeeClassificationList[index] !=
                                          undefined &&
                                        employeeClassificationList[index]
                                          .classificationName
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
                                            setFieldValue(fieldName, data.name);
                                            setFieldValue(
                                              fields.classificationName,
                                              data.name
                                            );
                                            setFieldValue(
                                              `employeeClassifications[${index}].code`,
                                              data.code
                                            );
                                          }}
                                          selectedValue={
                                            employeeClassificationList[index] !=
                                              undefined &&
                                            employeeClassificationList[index]
                                              .classificationName
                                          }
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
                                      name={`employeeClassifications[${index}].effectiveStartDate`}
                                      value={
                                        employeeClassificationList[index] !=
                                          undefined &&
                                        usDateFormat(
                                          employeeClassificationList[index]
                                            .effectiveStartDate
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
                                      disabled={isEdit && !isSave}
                                    />
                                  );
                                }

                                if (["effectiveEndDate"].includes(columnName)) {
                                  return (
                                    <Field
                                      size="sm"
                                      name={`employeeClassifications[${index}].effectiveEndDate`}
                                      value={
                                        employeeClassificationList[index] !=
                                          undefined &&
                                        usDateFormat(
                                          employeeClassificationList[index]
                                            .effectiveEndDate
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
                                              ?.effectiveEndDate
                                          }
                                        />
                                      }
                                      component={FieldDropSide}
                                      disabled={isEdit && !isSave}
                                    />
                                  );
                                }
                                if (isCmpy != undefined) {
                                  return (
                                    <Link
                                      onClick={() =>
                                        onViewButtonClick(
                                          employeeClassificationList[index]
                                        )
                                      }
                                    >
                                      {employeeDetails[columnName]}
                                    </Link>
                                  );
                                } else return employeeDetails[columnName];
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
          onClose={() => {
            setModalOpen(false);
            setSliderEdit(true);
          }}
          showEdit={sliderEdit}
          onEdit={() => setSliderEdit(false)}
          showSave={!sliderEdit}
          showCancel={sliderEdit}
          showCancelButton={!sliderEdit}
        >
          <EmployeeClassifictionSliderTable
            data={sidePanelData}
            changeInCmpyId={changeInCmpyId}
            isCmpy={isCmpy}
            fields={fields}
            companyId={values.companyId}
            isEdit={sliderEdit}
          />
        </SliderPanel>
        <br />
      </div>
    </div>
  );
};

export default EmployeeClassificationFields;
