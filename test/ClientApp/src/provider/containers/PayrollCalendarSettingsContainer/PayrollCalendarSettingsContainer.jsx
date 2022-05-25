import React, { useContext, useState } from "react";
import { Field, Formik } from "formik";
import { get, isEmpty, union, values } from "lodash";
import * as Yup from "yup";
import { Form, Row, Col, Button } from "react-bootstrap";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import {
  ManageCompanyLayout,
  InnerLayoutHeaderTabs,
  SearchableList,
  DatePicker,
  FieldDropSide,
  FieldInput,
  FieldButtonGroup,
  LoaderWrapper,
  FieldInputNumber,
  NotificationPopUp,
} from "../../components";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  yesNoOptions,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  usDateFormat,
  returnOnlyIfBoolean,
  tranformListToDropdownValues,
  required,
} from "../../utils";
import { useDeepEffect, useRouterParams } from "../../abstracts";
import {
  manageCompanyStore,
  saveCompanyDetails,
  setManageCompanyLocalCache,
  setManageCompanyToastInfo,
  generatePayrollSchedule,
} from "../../contexts";
import moment from "moment";

const payDateOptions = [
  {
    label: "No Change",
    value: 0,
  },
  {
    label: "Move To Next Business Date",
    value: 1,
  },
  {
    label: "Move To Previous Business Date",
    value: 2,
  },
];

const PayrollCalendarSettingsContainer = (props) => {
  const { state, dispatch } = useContext(manageCompanyStore);
  const { companyId, flow, frequencyId } = useRouterParams();
  const intFrequencyId = parseInt(frequencyId, 10);

  const formName =
    manageCompanyFormNames.PAYROLL_CALENDAR_SETTINGS_MANAGE_COMPANY;
  const fields = formFields[formName];
  const payrollCalendarApiData = get(state, "api.data.payrollCalendars", []);
  const payrollCalendarListData = get(state, "payrollCalendar", []);
  const payrollFrequencyListData = get(
    state,
    "api.data.payrollFrequencies",
    []
  );
  const frequencyDropdownList = tranformListToDropdownValues(
    payrollFrequencyListData,
    "frequencyName",
    "id"
  );
  const formValues = get(payrollCalendarListData, intFrequencyId, {});
  const existingValues = get(payrollCalendarApiData, intFrequencyId, {});
  const existingPayPeriods = get(existingValues, "payPeriods", []);
  const { history } = props;
  const [show, setShow] = useState(false);
  var newFrequencyId = null;
  const [freqId, setFreqId] = useState();

  useDeepEffect(() => {
    if (isEmpty(formValues)) {
      console.log(payrollCalendarApiData);
      dispatch(
        setManageCompanyLocalCache({
          model: "payrollCalendar",
          data: payrollCalendarApiData,
        })
      );
    }
    dispatch(
      setManageCompanyLocalCache({
        model: "payrollCalendarPayPeriods",
        data: existingPayPeriods,
      })
    );
  }, [payrollCalendarApiData, existingPayPeriods]);
  const schema = Yup.object().shape({
    id: Yup.number()
      .required("CM047 : Required")
      .test(
        "id",
        "CM040 : Schedule already exists for this Frequency Name.",
        (val) => !checkFrequencyAlreadyExsists(val)
      ),
    effectivePayDateCount: Yup.number()
      .required("CM041 : Required")
      .lessThan(32, "CM042 : Effective Pay Date Count range is 0 to 31")
      .moreThan(-1, "CM042 : Effective Pay Date Count range is 0 to 31."),
    scheduleBeginDate: Yup.date().nullable().required("CM043 : Required"),
    scheduleEndDate: Yup.date()
      .nullable()
      .required("CM044 : Required")
      .when("scheduleBeginDate", {
        is: null,
        otherwise: Yup.date().when("scheduleEndDate", {
          is: null,
          otherwise: Yup.date().min(
            Yup.ref("scheduleBeginDate"),
            "CM045 : Schedule Begin Date should be equal or prior to the Schedule End Date."
          ),
        }),
      }),
  });

  const checkFrequencyAlreadyExsists = (id) => {
    const temp = payrollCalendarListData.map((item, index) => {
      if (item.id === id && index !== intFrequencyId) return true;
      else return false;
    });
    return temp.includes(true);
  };

  const onDeleteClick = () => {
    const frequencyName = payrollCalendarListData[intFrequencyId].frequencyName;
    saveCompanyDetails(
      {
        payrollCalendars: payrollCalendarListData.filter(
          ({ id }, index) => index != intFrequencyId
        ),
      },
      dispatch,
      state
    ).then(() => {
      dispatch(
        setManageCompanyToastInfo({
          showToast: true,
          toastMessage: `Payroll calendar ${frequencyName} deleted successfully`,
        })
      );
      history.push(
        getAdvancedPathWithParam({
          path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
          pathParam: [flow, companyId],
        })
      );
    });
  };

  const getValuesForSave = (values) => {
    if (isEmpty(formValues)) {
      return [
        ...payrollCalendarListData,
        {
          ...values,
        },
      ];
    }

    return payrollCalendarListData.map((item, index) => {
      if (index === intFrequencyId) {
        return { ...item, ...values };
      }
      return item;
    });
  };

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    var freqDate = get(state, "api.data.payrollFrequencies", []).filter(
      (data) => data.id == values[fields.id]
    );
    freqDate = freqDate[0].biWeeklyStartDate;
    if (
      new Date(usDateFormat(values[fields.scheduleBeginDate])) <
      new Date(usDateFormat(freqDate))
    ) {
      setFieldTouched(
        "scheduleBeginDate",
        "CM069 : The Schedule Begin Date should be equal to or later than the Start Date defined under respective Biweekly Payroll Frequency Setup. Please correct the date and submit again."
      );
      setFieldError(
        "scheduleBeginDate",
        "CM069 : The Schedule Begin Date should be equal to or later than the Start Date defined under respective Biweekly Payroll Frequency Setup. Please correct the date and submit again."
      );
    } else {
      var previousEndDate = get(existingValues, "scheduleEndDate", null);
      if (
        existingPayPeriods.length > 0 &&
        new Date(usDateFormat(previousEndDate)) >
          new Date(usDateFormat(values[fields.scheduleEndDate]))
      ) {
        setFieldTouched(
          "scheduleEndDate",
          "CM070 : Schedule End Date must be equal to or later than Previous Schedule End Date."
        );
        setFieldError(
          "scheduleEndDate",
          "CM070 : Schedule End Date must be equal to or later than Previous Schedule End Date."
        );
      } else {
        const updatedData = getValuesForSave(values);
        newFrequencyId =
          frequencyId === undefined ? updatedData.length - 1 : frequencyId;
        dispatch(
          setManageCompanyLocalCache({
            model: "payrollCalendar",
            data: updatedData,
          })
        );
        if (
          existingPayPeriods.length > 0 &&
          usDateFormat(previousEndDate) ===
            usDateFormat(values[fields.scheduleEndDate])
        ) {
          dispatch(
            setManageCompanyLocalCache({
              model: "payrollCalendarPayPeriods",
              data: existingPayPeriods || [],
            })
          );
          history.push(
            getAdvancedPathWithParam({
              path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
              pathParam: [flow, companyId, newFrequencyId], // put the company id after crated
            })
          );
        } else {
          if (
            new Date(usDateFormat(values[fields.scheduleBeginDate])) <
            new Date(usDateFormat(freqDate))
          ) {
            setFieldTouched(
              "scheduleBeginDate",
              "CM069 : The Schedule Begin Date should be equal to or later than the Start Date defined under respective Biweekly Payroll Frequency Setup. Please correct the date and submit again."
            );
            setFieldError(
              "scheduleBeginDate",
              "CM069 : The Schedule Begin Date should be equal to or later than the Start Date defined under respective Biweekly Payroll Frequency Setup. Please correct the date and submit again."
            );
          } else {
            const newbeginDate =
              existingPayPeriods.length > 0
                ? moment(
                    existingPayPeriods[existingPayPeriods.length - 1].endDate
                  ).add(1, "days")
                : values[fields.scheduleBeginDate];
            generatePayrollSchedule(
              {
                ...values,
                scheduleBeginDate: newbeginDate,
              },
              dispatch,
              state
            ).then((res) => {
              if (res === undefined || res === null || res.length === 0) {
                setFieldTouched(
                  "scheduleEndDate",
                  "CM071 : No Pay Periods were created. Please review schedule date range."
                );
                setFieldError(
                  "scheduleEndDate",
                  "CM071 : No Pay Periods were created. Please review schedule date range."
                );
              } else {
                if (
                  existingPayPeriods.length === 0 &&
                  usDateFormat(res[0].beginDate) !=
                    usDateFormat(values[fields.scheduleBeginDate])
                ) {
                  setShow(true);
                  setFreqId(newFrequencyId);
                  // dispatch(
                  //   setManageCompanyToastInfo({
                  //     showToast: true,
                  //     toastMessage:
                  //       "The Schedule Begin Date is not aligned with first pay period begin date.",
                  //   })
                  // );
                } else {
                  setShow(false);
                }
                var payPeriods = [];
                (existingPayPeriods || []).forEach((_) => payPeriods.push(_));
                (res || []).forEach((_) => payPeriods.push(_));
                dispatch(
                  setManageCompanyLocalCache({
                    model: "payrollCalendarPayPeriods",
                    data: payPeriods || [],
                  })
                );
                history.push(
                  getAdvancedPathWithParam({
                    path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
                    pathParam: [flow, companyId, newFrequencyId], // put the company id after crated
                  })
                );
              }
            });
          }
        }
      }
    }
  };
  const onClickOk = (isTrue) => {
    if (!isTrue) {
      setShow(false);
    }
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
        pathParam: [flow, companyId, freqId], // put the company id after crated
      })
    );
  };

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      link: getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
        pathParam: [flow, companyId],
      }),
    },
    {
      label: "Generate",
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
        path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
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
            path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
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

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;
  const menuList = [
    {
      label: "SETTINGS",
      path: getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
        pathParam: [flow, companyId, frequencyId],
      }),
      selected: true,
    },
    {
      label: "PAYDATES",
      path: getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
        pathParam: [flow, companyId, frequencyId],
      }),
      disabled: !isEdit && !isSave,
    },
  ];

  const initialValues = {
    [fields.isScheduleExtensionApplicable]: true,
    [fields.holiday]: 0,
    [fields.saturday]: 0,
    [fields.sunday]: 0,
  };
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
      }}
      validationSchema={schema}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        values,
        setValues,
        ...rest
      }) => {
        const isScheduleExtendable =
          !(
            values[fields.isScheduleExtensionApplicable] ||
            existingPayPeriods.length === 0
          ) && isSave;

        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={rest.submitCount > 0}
          >
            <ManageCompanyLayout
              tabs={<InnerLayoutHeaderTabs menuList={menuList} />}
              buttons={buttons}
              pageFlow={flow}
            >
              {show && (
                <NotificationPopUp
                  msg={
                    "CM073 : The Schedule Begin Date is not aligned with first pay period begin date."
                  }
                  onClickOk={onClickOk}
                />
              )}
              <Row>
                <Col>
                  <Field
                    isRequired
                    label="Frequency name"
                    name={fields.id}
                    value={values[fields.id]}
                    options={frequencyDropdownList}
                    popupContent={
                      <SearchableList
                        options={frequencyDropdownList}
                        selectedValue={values[fields.id]}
                        onSelect={(value, label) => {
                          setValues({
                            ...values,
                            [fields.id]: value,
                            [fields.frequencyName]: label,
                          });
                        }}
                        isNotTypeAhead
                        isRadio
                      />
                    }
                    disabled={isEdit || isSave}
                    component={FieldDropSide}
                  />
                  <Field
                    isRequired
                    label="Schedule begin date"
                    name={fields.scheduleBeginDate}
                    size="md"
                    value={usDateFormat(values[fields.scheduleBeginDate])}
                    isDatePicker
                    onClear={() =>
                      onDaySelected(fields.scheduleBeginDate, null)
                    }
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.scheduleBeginDate, value)
                        }
                        value={values[fields.scheduleBeginDate]}
                      />
                    }
                    disabled={isEdit || isSave}
                    component={FieldDropSide}
                  />
                  <Field
                    isRequired
                    label="Schedule end date"
                    name={fields.scheduleEndDate}
                    size="md"
                    value={usDateFormat(values[fields.scheduleEndDate])}
                    isDatePicker
                    onClear={() => onDaySelected(fields.scheduleEndDate, null)}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.scheduleEndDate, value)
                        }
                        value={values[fields.scheduleEndDate]}
                      />
                    }
                    disabled={isEdit || isScheduleExtendable}
                    component={FieldDropSide}
                  />
                  <Field
                    isRequired
                    name={fields.effectivePayDateCount}
                    label="Effective pay date count"
                    size="sm"
                    type="number"
                    onChange={handleChange}
                    value={values[fields.effectivePayDateCount]}
                    disabled={isEdit || isScheduleExtendable}
                    component={FieldInputNumber}
                    min={0}
                    max={99}
                  />
                </Col>
              </Row>
              <div className="line-separator"></div>
              <Row>
                <Col>
                  <Field
                    isRequired
                    name={fields.isScheduleExtensionApplicable}
                    label="Schedule Extension applicable?"
                    size="sm"
                    options={yesNoOptions}
                    selectedValue={returnOnlyIfBoolean(
                      values[fields.isScheduleExtensionApplicable]
                    )}
                    onChange={(value) => {
                      setFieldValue(
                        fields.isScheduleExtensionApplicable,
                        value
                      );
                    }}
                    disabled={isEdit && !isSave}
                    validate={required}
                    component={FieldButtonGroup}
                  />
                  <div className="company-sub-heading">Pay date handling</div>
                  <Field
                    isRequired
                    name={fields.holiday}
                    label="Holidays"
                    size="xxl"
                    options={payDateOptions}
                    selectedValue={values[fields.holiday]}
                    onChange={(value) => {
                      setFieldValue(fields.holiday, value);
                    }}
                    disabled={isEdit || isScheduleExtendable}
                    validate={required}
                    component={FieldButtonGroup}
                  />
                  <Field
                    isRequired
                    name={fields.saturday}
                    label="Saturday"
                    size="xxl"
                    options={payDateOptions}
                    selectedValue={values[fields.saturday]}
                    onChange={(value) => {
                      setFieldValue(fields.saturday, value);
                    }}
                    disabled={isEdit || isScheduleExtendable}
                    validate={required}
                    component={FieldButtonGroup}
                  />
                  <Field
                    isRequired
                    name={fields.sunday}
                    label="Sunday"
                    size="xxl"
                    options={payDateOptions}
                    selectedValue={values[fields.sunday]}
                    onChange={(value) => {
                      setFieldValue(fields.sunday, value);
                    }}
                    disabled={isEdit || isScheduleExtendable}
                    validate={required}
                    component={FieldButtonGroup}
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

export default PayrollCalendarSettingsContainer;
