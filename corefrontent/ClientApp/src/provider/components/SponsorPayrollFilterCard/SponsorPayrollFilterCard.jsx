import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Form, Button } from "react-bootstrap";
import { Formik, Field } from "formik";
import { DatePicker, SearchableList, FieldDropSide } from "../../components";
import {
  MANAGE_PAYROLL_ROUTES,
  managePayrollFormNames,
  formFields,
  getPathWithParam,
  getFlowBasedFormValues,
  usDateFormat,
  clearFieldValues,
  errors,
} from "../../utils";
import {
  manageEligibilityStore,
  managePayrollStore,
  setManagePageLevelData,
} from "../../contexts";

import { useRouterParams, useRequest, useDeepEffect } from "../../abstracts";
import FileStatus from "../../mocks/fileStatus.json";
import "../../styles/components/SponsorPayrollFilterCard.scss";

const initialValues = {
  fileStatus: 0,
};

const SponsorPayrollFilterCard = (props) => {
  const { setFieldValues } = props;
  const { state } = useContext(manageEligibilityStore);
  const { flow } = useRouterParams();
  const formName = managePayrollFormNames.PAYROLL_FILTER;
  const fields = formFields[formName];

  const onSubmit = (values, { setFieldError }) => {
    if (
      Date.parse(values[fields.fromDate]) > Date.parse(values[fields.toDate])
    ) {
      setFieldError(
        fields.toDate,
        errors.payrollFilterDateOverlap.overlapError
      );
    } else {
      setFieldValues(values);
    }
  };
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...getFlowBasedFormValues(get(state, formName, {}), flow),
      }}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        setFieldError,
        handleSubmit,
        setValues,
        values,
        ...rest
      }) => {
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };

        return (
          <Form
            autoComplete="off"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <div className="payroll-filter-card ">
              <div>
                <Field
                  size="sm"
                  isRequired
                  label="Date range"
                  name={fields.fromDate}
                  value={usDateFormat(values[fields.fromDate])}
                  isDatePicker
                  placeholder="From date"
                  direction="bottom"
                  onClear={() => onDaySelected(fields.fromDate, "")}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(fields.fromDate, value)
                      }
                      value={values[fields.fromDate]}
                    />
                  }
                  component={FieldDropSide}
                />
              </div>
              <div className="mr-30">
                <Field
                  size="sm"
                  label=""
                  name={fields.toDate}
                  isRequired
                  placeholder="To date"
                  value={usDateFormat(values[fields.toDate])}
                  direction="bottom"
                  isDatePicker
                  onClear={() => {
                    onDaySelected(fields.toDate, "");
                    onDaySelected(fields.fromDate, "");
                  }}
                  onDefaultClearDisplay={values[fields.fromDate]}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(fields.toDate, value)
                      }
                      value={values[fields.toDate]}
                    />
                  }
                  component={FieldDropSide}
                />
              </div>
              <div className="mr-30">
                <Field
                  size="smdd"
                  isRequired
                  label="Field"
                  placeholder="-Select-"
                  name={fields.fileStatus}
                  value={FileStatus.data[values[fields.fileStatus]]}
                  direction="bottom"
                  popupContent={
                    <SearchableList
                      label="Select Status"
                      options={FileStatus.data.map((value, index) => ({
                        label: value,
                        value: index,
                      }))}
                      onSelect={(value) =>
                        setFieldValue(fields.fileStatus, value)
                      }
                      selectedValue={FileStatus.data[values[fields.fileStatus]]}
                    />
                  }
                  component={FieldDropSide}
                />
              </div>
              <div>
                <Button
                  className="payroll-search-button"
                  variant="secondary"
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SponsorPayrollFilterCard;
