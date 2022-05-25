import React from "react";
import { Field, FieldArray, Formik } from "formik";
import { get, isEmpty } from "lodash";
import { usDateFormat } from "../../../../utils";
import {
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
  DatePicker,
  Link,
} from "../../../../components";
import { Form } from "react-bootstrap";
import { useState } from "react";
import { useRequest } from "../../../../abstracts";
import { getEmployeeClassificationType } from "../../../../services";

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
  // {
  //     label: "Classification name",
  //     className: "column-classificationName",
  //     columnName: "classificationName",
  // },
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

export const EmployeeClassificationTable = (props) => {
  const [status, setStatus] = useState(false);

  const classifications = props.data;
  const changeInCmpyId = props.changeInCmpyId;
  const isCmpy = props.isCmpy;
  const fields = props.fields;
  const disabled = props.isEdit;

  const onFormSubmit = (
    values,
    { setSubmitting, setFieldTouched, setFieldError }
  ) => {};

  return (
    <Formik
      initialValues={{ employeeClassifications: classifications }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formProps) => {
        const {
          handleChange,
          setFieldValue,
          handleSubmit,
          setValues,
          setTouched,
          values,
          setSubmitting,
          setFieldError,
          fieldValue,
          ...rest
        } = formProps;
        const employeeClassificationList = get(
          values,
          "employeeClassifications",
          []
        );
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
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
                            <Table.Td
                              key={cellIndex}
                              className={item.className}
                            >
                              {!isEmpty(item.link)
                                ? // <Link onClick={() => onViewButtonClick(source)}>
                                  source[item.columnName]
                                : // </Link>
                                item.dataMapper
                                ? item.dataMapper[source[item.columnName]]
                                : item.columnName == "effectiveStartDate" ||
                                  item.columnName == "effectiveEndDate"
                                ? usDateFormat(source[item.columnName])
                                : source[item.columnName]}
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
                                      return employeeClassificationList[index]
                                        ?.code;
                                    }
                                    if (
                                      ["effectiveStartDate"].includes(
                                        columnName
                                      )
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
                                              onDayClick={(value) => {
                                                onDaySelected(fieldName, value);
                                                if (
                                                  index > 0 &&
                                                  employeeClassificationList[
                                                    index
                                                  ]?.isMandatory
                                                ) {
                                                  var d = new Date(value);
                                                  d.setDate(d.getDate() - 1);
                                                  onDaySelected(
                                                    `employeeClassifications[${
                                                      index - 1
                                                    }].effectiveEndDate`,
                                                    d
                                                  );
                                                }
                                              }}
                                              value={
                                                employeeClassificationList[
                                                  index
                                                ]?.effectiveStartDate
                                              }
                                            />
                                          }
                                          component={FieldDropSide}
                                          disabled={disabled}
                                        />
                                      );
                                    }

                                    if (
                                      ["effectiveEndDate"].includes(columnName)
                                    ) {
                                      return (
                                        <Field
                                          size="sm"
                                          name={columnName}
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
                                                employeeClassificationList[
                                                  index
                                                ]?.effectiveEndDate
                                              }
                                            />
                                          }
                                          component={FieldDropSide}
                                          disabled={
                                            disabled ||
                                            employeeClassificationList[index]
                                              ?.isMandatory
                                          }
                                        />
                                      );
                                    }
                                    if (isCmpy != undefined) {
                                      return employeeDetails[columnName];
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
          </Form>
        );
      }}
    </Formik>
  );
};
