import { Field, Formik } from "formik";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useRequest, useRouterParams } from "shared/abstracts";
import {
  DatePicker,
  FieldDropSide,
  ManageCensusLayout,
  MultiSelectDropdown,
  CsplTable as Table,
  Link,
} from "shared/components";
import { getCensusHistory } from "sponsor/services";
import {
  FLOW_TYPES,
  formFields,
  manageCensusFormNames,
  toMultiSelectValue,
  usDateFormat,
  censusFormFields,
} from "shared/utils"
import { useContext } from "react";
import {
  manageCensusStore,
  setManageCensusPageLevelData,
} from "sponsor/contexts";

const columns = [
  {
    label: "Field",
    className: "column-field",
    columnName: "field",
  },
  {
    label: "Date/Time Modified",
    className: "column-dateTimeModified",
    columnName: "dateTimeModified",
  },
  {
    label: "Previous Value",
    className: "column-previousValue",
    columnName: "previousValue",
  },
  {
    label: "Updated Value",
    className: "column-updatedValue",
    columnName: "updatedValue",
  },
  {
    label: "Comments",
    className: "column-comments",
    columnName: "comments",
    link: `link`,
  },
];

const fieldsOptions = [
  {
    value: 1,
    label: "Email",
  },
  {
    value: 2,
    label: "Employee ID",
  },
  {
    value: 3,
    label: "Hire Date",
  },
];

const ManageCensusHistoryContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useContext(manageCensusStore);
  const { censusId } = useRouterParams();
  const formName = manageCensusFormNames.CENSUS_HISTORY;
  const fields = formFields[formName];

  const { response, loading } = useRequest({
    method: getCensusHistory,
    payload: {
      employeeId: censusId,
    },
    defaultResponse: [],
  });

  const onFormSubmit = (values) => {
    // console.log(values);
    setIsLoading(true);
    getCensusHistory({
      ...values,
      employeeId: censusId,
    })
      .then((res) => {
        response = res;
        dispatch(
          setManageCensusPageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
      })
      .catch((error) => {
        //Handle Errors
      });
    setIsLoading(false);
  };

  return (
    <ManageCensusLayout pageFlow={FLOW_TYPES.EDIT}>
      <div className="w-100">
        <Formik
          initialValues={{}}
          onSubmit={onFormSubmit}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
            const onDaySelected = (fieldName, value) => {
              setFieldValue(fieldName, value);
            };
            const selectedFields = values[fields.fields];
            return (
              <Form
                autoComplete="off"
                className="h-100"
                onSubmit={handleSubmit}
              >
                <div className="d-flex justify-content-between compensation-container w-100">
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="plan-sub-heading">
                      Show records of period
                    </div>
                    <Field
                      size="smd"
                      label="Start Date"
                      name={fields.startDate}
                      value={usDateFormat(values[fields.startDate])}
                      isDatePicker
                      onClear={() => onDaySelected(fields.startDate, "")}
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            onDaySelected(fields.startDate, value)
                          }
                          value={values[fields.startDate]}
                        />
                      }
                      direction="bottom"
                      component={FieldDropSide}
                    />
                    <Field
                      size="smd"
                      label="End Date"
                      name={fields.endDate}
                      value={usDateFormat(values[fields.endDate])}
                      isDatePicker
                      onClear={() => onDaySelected(fields.endDate, "")}
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            onDaySelected(fields.endDate, value)
                          }
                          value={values[fields.endDate]}
                        />
                      }
                      direction="bottom"
                      component={FieldDropSide}
                    />
                    <Field
                      size="smd"
                      label="fields"
                      name={fields.fields}
                      value={toMultiSelectValue(selectedFields, fieldsOptions)}
                      isMultiSelect
                      popupContent={
                        <MultiSelectDropdown
                          label="Fields"
                          name={fields.fields}
                          onSelect={(value) =>
                            setFieldValue(fields.fields, value)
                          }
                          value={values[fields.fields]}
                          options={fieldsOptions}
                        />
                      }
                      direction="bottom"
                      component={FieldDropSide}
                    />
                    <Button type="submit" className="align-center">
                      Go
                    </Button>
                    <div className="mr-4">{response.length} records</div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
        <Table isLoading={loading || isLoading} className="contributions-table">
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
            {response &&
              response.map((contributions, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      const getContent = () => {
                        if (!isEmpty(item.link)) {
                          return (
                            <OverlayTrigger
                              overlay={
                                <Tooltip>{contributions.tooltip}</Tooltip>
                              }
                            >
                              <Link>{contributions[item.columnName]}</Link>
                            </OverlayTrigger>
                          );
                        }
                        if (item.dataMapper) {
                          return item.dataMapper[
                            contributions[item.columnName]
                          ];
                        }
                        return contributions[item.columnName];
                      };
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {getContent()}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </div>
    </ManageCensusLayout>
  );
};

export default ManageCensusHistoryContainer;
