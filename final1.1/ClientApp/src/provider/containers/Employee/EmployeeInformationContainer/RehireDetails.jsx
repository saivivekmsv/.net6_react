import { Field, Formik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { isEmpty } from "lodash";
import {
  DatePicker,
  FieldDropSide,
  CsplTable as Table,
} from "../../../components";
import { usDateFormat } from "../../../utils";

const columns = [
  {
    label: "Hire / rehire date",
    className: "column-rehireDate",
    columnName: "rehireDate",
  },
  {
    label: "Term date",
    className: "column-termDate",
    columnName: "terminationDate",
  },
];

export const RehireDetails = (props) => {
  const rehireDetails = props.rehireDetails;
  const isEdit = props.isEdit;
  const isSave = props.isSave;

  const onFormSubmit = (
    values,
    { setSubmitting, setFieldTouched, setFieldError }
  ) => {};

  return (
    <Formik
      initialValues={{ rehireDetails: rehireDetails }}
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
        console.log(values["rehireDetails"]);
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <div className="border-box w-100 census-rehire">
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
                  {rehireDetails &&
                    rehireDetails.map((source, index) => {
                      return (
                        <Table.Tr key={index}>
                          {columns.map((item, cellIndex) => {
                            return (
                              <Table.Td
                                key={cellIndex}
                                className={item.className}
                              >
                                <Field
                                  isRequired
                                  size="sm"
                                  name={`${index}-${cellIndex}`}
                                  value={usDateFormat(
                                    values["rehireDetails"][index][
                                      item.columnName
                                    ]
                                  )}
                                  isDatePicker
                                  onClear={() =>
                                    setFieldValue(
                                      "rehireDetails",
                                      rehireDetails.map((a, b) => {
                                        if (b == index)
                                          return {
                                            ...a,
                                            [item.columnName]: null,
                                          };
                                        return a;
                                      })
                                    )
                                  }
                                  popupContent={
                                    <DatePicker
                                      onDayClick={(value) =>
                                        setFieldValue(
                                          "rehireDetails",
                                          rehireDetails.map((a, b) => {
                                            if (b == index)
                                              return {
                                                ...a,
                                                [item.columnName]: value,
                                              };
                                            return a;
                                          })
                                        )
                                      }
                                      value={
                                        values["rehireDetails"][index][
                                          item.columnName
                                        ]
                                      }
                                    />
                                  }
                                  disabled={
                                    (isEdit && !isSave) ||
                                    (index == 0 && cellIndex == 0) ||
                                    (index == rehireDetails.length - 1 &&
                                      cellIndex == 1)
                                  }
                                  component={FieldDropSide}
                                />
                                {/* {!isEmpty(item.link)
                                                                    ? item.dataMapper[source[item.columnName]]
                                                                    : usDateFormat(source[item.columnName])} */}
                              </Table.Td>
                            );
                          })}
                        </Table.Tr>
                      );
                    })}
                </Table.Tbody>
              </Table>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
