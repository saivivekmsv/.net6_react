import React, { useContext } from "react";
import { find, isEmpty, get } from "lodash";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { Row, Col, Form } from "react-bootstrap";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  inverseYesNoOptions,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  returnOnlyIfBoolean,
  required,
  clearFieldValues,
  usDateFormat,
} from "../../utils";
import {
  ManageCompanyLayout,
  SearchableList,
  DayDropdown,
  FieldDropSide,
  FieldButtonGroup,
  FieldInput,
  DatePicker,
} from "../../components";
import { useRouterParams } from "../../abstracts";
import {
  manageCompanyStore,
  setManageCompanyToastInfo,
  saveCompanyDetails,
} from "../../contexts";
import payrollFrequency from "../../mocks/payrollFrequency.json";
import weekdays from "../../mocks/weekdays.json";
import months from "../../mocks/months.json";
import days from "../../mocks/days.json";

const PayrollCalendarContainer = (props) => {
  const { history } = props;
  const { companyId, flow, frequencyId } = useRouterParams();
  const intFrequencyId = parseInt(frequencyId, 10);

  const { state, dispatch } = useContext(manageCompanyStore);
  const formName = manageCompanyFormNames.PAYROLL_FREQUENCY_MANAGE_COMPANY;
  const payrollFrequencyListData = get(
    state,
    "api.data.payrollFrequencies",
    []
  );
  const formValues = find(payrollFrequencyListData, {
    id: intFrequencyId,
  });
  const fields = formFields[formName];

  const getDataForSave = (values) => {
    if (isEmpty(formValues)) {
      return [
        ...payrollFrequencyListData,
        {
          ...values,
        },
      ];
    }

    return payrollFrequencyListData.map((item) => {
      if (item.id === intFrequencyId) {
        return { ...item, ...values };
      }
      return item;
    });
  };

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    saveCompanyDetails(
      {
        payrollFrequencies: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (!response.isSuccessful) {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, _.message);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      } else {
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_FREQUENCY,
            pathParam: [get(state, "flow"), companyId],
          })
        );
        dispatch(
          setManageCompanyToastInfo({
            showToast: true,
            toastMessage: "Data saved successfully",
          })
        );
      }
    });
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;
  const isDisabled = frequencyId !== undefined;
  return (
    <Formik
      initialValues={{
        ...formValues,
      }}
      // validationSchema={schema}
      onSubmit={onFormSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        values,
        setValues,
        setSubmitting,
        ...rest
      }) => {
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };
        const onFrequencyTypeChange = (value) => {
          console.log(value);
          const updatedValues = clearFieldValues({
            values,
            fieldsToExculde: [fields.frequencyType],
          });

          setValues({
            ...updatedValues,
            [fields.frequencyType]: value,
          });

          setFieldValue(fields.worksOnSaturday, true);
          setFieldValue(fields.worksOnSunday, true);
          setFieldValue(fields.frequencyType, value);
        };

        const onDeleteClick = () => {
          setSubmitting(true);
          const payrollFrequencyFormValues = get(state, formName, {});
          saveCompanyDetails(
            {
              payrollFrequencies: payrollFrequencyListData.filter(
                ({ id }) => id !== intFrequencyId
              ),
            },
            dispatch,
            state
          ).then(() => {
            dispatch(
              setManageCompanyToastInfo({
                showToast: true,
                toastMessage: `Payroll frequency ${get(
                  payrollFrequencyFormValues,
                  "frequencyName",
                  ""
                )} deleted successfully`,
              })
            );
            history.push(
              getAdvancedPathWithParam({
                path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_FREQUENCY,
                pathParam: [flow, companyId],
              })
            );
          });
        };
        const buttons = [
          {
            label: "Cancel",
            variant: "secondary",
            type: "button",
            flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
            link: getAdvancedPathWithParam({
              path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_FREQUENCY,
              pathParam: [flow, companyId],
            }),
          },
          {
            label: "Save",
            variant: "primary",
            type: "submit",
            flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faTimes,
            link: getAdvancedPathWithParam({
              path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_FREQUENCY,
              pathParam: [flow, companyId],
            }),
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faPencilAlt,
            onClick: () =>
              history.push(
                getAdvancedPathWithParam({
                  path: MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY,
                  pathParam: [FLOW_TYPES.SAVE, companyId, frequencyId],
                })
              ),
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faTrashAlt,
            onClick: onDeleteClick,
          },
        ];

        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={rest.submitCount > 0}
          >
            <ManageCompanyLayout buttons={buttons} pageFlow={flow}>
              <Row>
                <Col>
                  <Field
                    label="Payroll Frequency"
                    name={fields.frequencyType}
                    isRequired
                    value={values[fields.frequencyType]}
                    disabled={isEdit && !isSave}
                    options={payrollFrequency.data}
                    popupContent={
                      <SearchableList
                        label="Select a payroll frequency"
                        options={payrollFrequency.data}
                        onSelect={onFrequencyTypeChange}
                        selectedValue={values[fields.frequencyType]}
                        name={fields.frequencyType}
                        isNotTypeAhead
                        isRadio
                      />
                    }
                    component={FieldDropSide}
                  />
                  {values[fields.frequencyType] === 1 && (
                    <>
                      <Field
                        label="Exclude Saturdays?"
                        name={fields.worksOnSunday}
                        isRequired
                        size="sm"
                        options={inverseYesNoOptions}
                        selectedValue={returnOnlyIfBoolean(
                          values[fields.worksOnSaturday]
                        )}
                        onChange={(value) => {
                          setFieldValue(fields.worksOnSaturday, value);
                        }}
                        disabled={isEdit && !isSave}
                        component={FieldButtonGroup}
                      />
                      <Field
                        label="Exclude Sundays?"
                        name={fields.worksOnSunday}
                        isRequired
                        size="sm"
                        options={inverseYesNoOptions}
                        selectedValue={returnOnlyIfBoolean(
                          values[fields.worksOnSunday]
                        )}
                        onChange={(value) => {
                          setFieldValue(fields.worksOnSunday, value);
                        }}
                        disabled={isEdit && !isSave}
                        component={FieldButtonGroup}
                      />
                    </>
                  )}
                  {[2].includes(values[fields.frequencyType]) && (
                    <Field
                      label="Start day"
                      name={fields.startDay}
                      isRequired
                      value={values[fields.startDay]}
                      options={weekdays.data}
                      popupContent={
                        <SearchableList
                          label="Select day"
                          options={weekdays.data}
                          selectedValue={values[fields.startDay]}
                          onSelect={(value) =>
                            setFieldValue(fields.startDay, value)
                          }
                          isNotTypeAhead
                          isRadio
                        />
                      }
                      disabled={isEdit && !isSave}
                      component={FieldDropSide}
                    />
                  )}
                  {[8].includes(values[fields.frequencyType]) && (
                    <Field
                      name={fields.biWeeklyStartDate}
                      isRequired
                      label="Start Date"
                      value={usDateFormat(values[fields.biWeeklyStartDate])}
                      disabled={isEdit && !isSave}
                      isDatePicker
                      onClear={() =>
                        setFieldValue(fields.biWeeklyStartDate, null)
                      }
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            onDaySelected(fields.biWeeklyStartDate, value)
                          }
                          value={values[fields.biWeeklyStartDate]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  )}
                  {[3].includes(values[fields.frequencyType]) && (
                    <>
                      <Field
                        label="First begin day"
                        name={fields.firstBeginDay}
                        size="sm"
                        isRequired
                        value={values[fields.firstBeginDay]}
                        options={days.data}
                        popupContent={
                          <DayDropdown
                            fromMonthDate={new Date(2020, 0)}
                            onSelect={(value) =>
                              setFieldValue(
                                fields.firstBeginDay,
                                parseInt(value, 10)
                              )
                            }
                            value={values[fields.firstBeginDay]}
                          />
                        }
                        disabled={isEdit && !isSave}
                        component={FieldDropSide}
                      />
                      <Field
                        label="Second begin day"
                        name={fields.secondBeginDay}
                        size="sm"
                        isRequired
                        value={values[fields.secondBeginDay]}
                        options={days.data}
                        popupContent={
                          <DayDropdown
                            fromMonthDate={new Date(2020, 0)}
                            onSelect={(value) =>
                              setFieldValue(
                                fields.secondBeginDay,
                                parseInt(value, 10)
                              )
                            }
                            value={values[fields.secondBeginDay]}
                          />
                        }
                        disabled={isEdit && !isSave}
                        component={FieldDropSide}
                      />
                    </>
                  )}
                  {[4].includes(values[fields.frequencyType]) && (
                    <Field
                      label="Starting day of every month"
                      name={fields.startDate}
                      size="sm"
                      isRequired
                      value={values[fields.startDate]}
                      options={days.data}
                      popupContent={
                        <DayDropdown
                          fromMonthDate={new Date(2020, 0)}
                          onSelect={(value) =>
                            setFieldValue(fields.startDate, parseInt(value, 10))
                          }
                          value={values[fields.startDate]}
                        />
                      }
                      disabled={isEdit && !isSave}
                      component={FieldDropSide}
                    />
                  )}
                  {[5].includes(values[fields.frequencyType]) && (
                    <Field
                      label="Starting month for first quarter"
                      name={fields.startMonth}
                      isRequired
                      value={values[fields.startMonth]}
                      options={months.data}
                      popupContent={
                        <SearchableList
                          label="Select a month"
                          options={months.data}
                          onSelect={(value) =>
                            setFieldValue(fields.startMonth, value)
                          }
                          isNotTypeAhead
                          selectedValue={values[fields.startMonth]}
                        />
                      }
                      disabled={isEdit && !isSave}
                      component={FieldDropSide}
                    />
                  )}
                  {[6].includes(values[fields.frequencyType]) && (
                    <Field
                      label="Starting month for the half-year"
                      name={fields.startMonth}
                      isRequired
                      value={values[fields.startMonth]}
                      options={months.data}
                      popupContent={
                        <SearchableList
                          label="Select a month"
                          options={months.data}
                          onSelect={(value) =>
                            setFieldValue(fields.startMonth, value)
                          }
                          isNotTypeAhead
                          selectedValue={values[fields.startMonth]}
                        />
                      }
                      disabled={isEdit && !isSave}
                      component={FieldDropSide}
                    />
                  )}
                  {[7].includes(values[fields.frequencyType]) && (
                    <div className="d-flex">
                      <Field
                        label="Starting date"
                        name={fields.startMonth}
                        isRequired
                        size="sm"
                        value={values[fields.startMonth]}
                        options={months.data}
                        placeholder="Month"
                        popupContent={
                          <SearchableList
                            label="Select a month"
                            options={months.data}
                            onSelect={(value) =>
                              setFieldValue(fields.startMonth, value)
                            }
                            isNotTypeAhead
                            selectedValue={values[fields.startMonth]}
                          />
                        }
                        disabled={isEdit && !isSave}
                        component={FieldDropSide}
                      />
                      &nbsp; &nbsp;
                      <Field
                        label=" "
                        size="xs"
                        name={fields.startDate}
                        value={values[fields.startDate]}
                        placeholder="day"
                        popupContent={
                          <DayDropdown
                            fromMonthDate={
                              new Date(2020, values[fields.startMonth] - 1 || 0)
                            }
                            onSelect={(value) =>
                              setFieldValue(
                                fields.startDate,
                                parseInt(value, 10)
                              )
                            }
                            value={values[fields.startDate]}
                          />
                        }
                        disabled={isEdit && !isSave}
                        component={FieldDropSide}
                      />
                    </div>
                  )}
                  <Field
                    label="Frequency name"
                    name={fields.frequencyName}
                    isRequired
                    type="text"
                    value={values[fields.frequencyName]}
                    onChange={handleChange}
                    autoComplete="nope"
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />
                </Col>
              </Row>
            </ManageCompanyLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PayrollCalendarContainer;
