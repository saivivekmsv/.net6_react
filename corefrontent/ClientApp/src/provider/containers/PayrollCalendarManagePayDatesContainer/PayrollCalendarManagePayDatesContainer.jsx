import React, { useContext } from "react";
import { isEmpty, get } from "lodash";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { Form, Row, Col } from "react-bootstrap";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import {
  ManageCompanyLayout,
  FormControl,
  DatePicker,
  FieldDropSide,
} from "../../components";
import {
  manageCompanyStore,
  setManageCompanyLocalCache,
  setManageCompanyToastInfo,
} from "../../contexts";
import { useRouterParams } from "../../abstracts";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  usDateFormat,
  required,
} from "../../utils";

const PayrollCalendarManagePayDatesContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(manageCompanyStore);
  const { companyId, flow, frequencyId, payDateId } = useRouterParams();
  const intFrequencyId = parseInt(frequencyId, 10);
  const intPayDateId = parseInt(payDateId, 10);

  const formName =
    manageCompanyFormNames.PAYROLL_CALENDAR_ADDPAYDATES_MANAGE_COMPANY;
  const fields = formFields[formName];
  const payrollCalendarListData = get(state, "payrollCalendar", []);
  const payrollCalendarForFrquencyId = get(
    payrollCalendarListData,
    intFrequencyId,
    {}
  );
  const payPeriodsListData = get(state, "payrollCalendarPayPeriods", []);
  const patPeriodsForPayDateId = get(payPeriodsListData, intPayDateId, {});

  const schema = Yup.object().shape({
    beginDate: Yup.date().nullable().required("CM061 : Required"),
    endDate: Yup.date()
      .nullable()
      .required("CM062 : Required")
      .when("beginDate", {
        is: null,
        otherwise: Yup.date().when("endDate", {
          is: null,
          otherwise: Yup.date().min(
            Yup.ref("beginDate"),
            "CM063 : Period Begin Date should be prior or equal to the Period End Date."
          ),
        }),
      }),
    payDate: Yup.date()
      .nullable()
      .required("CM064 : Required")
      .when("endDate", {
        is: null,
        otherwise: Yup.date().when("payDate", {
          is: null,
          otherwise: Yup.date().min(
            Yup.ref("endDate"),
            "CM065 : Pay Date should be equal or later than Period End Date"
          ),
        }),
      }),
  });
  const checkOverlapPayPeriodForBeginDate = (beginDate) => {
    var overlap = false;
    payPeriodsListData.map((item, index) => {
      if (
        index != intPayDateId &&
        new Date(usDateFormat(beginDate)) >=
          new Date(usDateFormat(item.beginDate)) &&
        new Date(usDateFormat(beginDate)) <=
          new Date(usDateFormat(item.endDate))
      ) {
        overlap = true;
        return true;
      }
    });
    console.log(overlap, beginDate);
    return overlap;
  };
  const checkOverlapPayPeriodForEndDate = (endDate) => {
    var overlap = false;
    payPeriodsListData.map((item, index) => {
      if (
        index != intPayDateId &&
        new Date(usDateFormat(endDate)) >=
          new Date(usDateFormat(item.beginDate)) &&
        new Date(usDateFormat(endDate)) <= new Date(usDateFormat(item.endDate))
      ) {
        overlap = true;
        return true;
      }
    });
    console.log(overlap, endDate);
    return overlap;
  };
  const getDataForSave = (values) => {
    let payPeriods = [];
    if (isEmpty(patPeriodsForPayDateId) && !isEmpty(values)) {
      payPeriods = [
        ...payPeriodsListData,
        {
          ...values,
        },
      ];
    } else {
      payPeriods = payPeriodsListData.map((item, index) => {
        if (index === intPayDateId) {
          return { ...item, ...values };
        }
        return item;
      });
    }

    return payPeriods;
  };

  const onDeleteClick = () => {
    const payrollCalendarFormValues = get(state, formName, {});
    const payPeriods = payPeriodsListData.filter(
      (_, index) => index !== intPayDateId
    );
    dispatch(
      setManageCompanyLocalCache({
        model: "payrollCalendarPayPeriods",
        data: payPeriods,
      })
    );
    dispatch(
      setManageCompanyToastInfo({
        showToast: true,
        toastMessage: `Pay Date for ${frequencyName} deleted successfully`,
      })
    );
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
        pathParam: [flow, companyId, frequencyId],
      })
    );
  };

  const onFormSubmit = (values, { setFieldError }) => {
    if (
      checkOverlapPayPeriodForEndDate(values[fields.endDate]) ||
      checkOverlapPayPeriodForBeginDate(values[fields.beginDate])
    ) {
      setFieldError(
        "endDate",
        "CM072 : Pay Period overlaps with existing Pay Period"
      );
    } else {
      dispatch(
        setManageCompanyLocalCache({
          model: "payrollCalendarPayPeriods",
          data: getDataForSave(values),
        })
      );

      dispatch(
        setManageCompanyToastInfo({
          showToast: true,
          toastMessage:
            flow === FLOW_TYPES.ADD
              ? `Pay Date for ${frequencyName} created successfully`
              : "Data saved successfully",
        })
      );
      history.push(
        getAdvancedPathWithParam({
          path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
          pathParam: [flow, companyId, frequencyId],
        })
      );
    }
  };

  const buttons = [
    {
      link: getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
        pathParam: [flow, companyId, frequencyId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
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
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
        pathParam: [flow, companyId, frequencyId],
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
            path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES,
            pathParam: [FLOW_TYPES.SAVE, companyId, frequencyId, payDateId],
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

  const {
    frequencyName,
    scheduleBeginDate,
    scheduleEndDate,
  } = payrollCalendarForFrquencyId;

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;
  const initialValues = {};
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...patPeriodsForPayDateId,
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
        errors,
        values,
        ...rest
      }) => {
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
            <ManageCompanyLayout buttons={buttons} pageFlow={flow}>
              <Row>
                <Col>
                  <div className="d-flex">
                    <FormControl isRequired label="Frequency name" {...rest}>
                      <Form.Control
                        type="text"
                        value={frequencyName}
                        disabled
                      />
                    </FormControl>
                    &nbsp;&nbsp;&nbsp;
                    <FormControl
                      isRequired
                      label="Shedule begin date"
                      size="sm"
                      {...rest}
                    >
                      <Form.Control
                        type="text"
                        value={usDateFormat(scheduleBeginDate)}
                        disabled
                      />
                    </FormControl>
                    &nbsp;&nbsp;&nbsp;
                    <FormControl
                      isRequired
                      label="Shedule end date"
                      size="sm"
                      {...rest}
                    >
                      <Form.Control
                        type="text"
                        value={usDateFormat(scheduleEndDate)}
                        disabled
                      />
                    </FormControl>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    label="Period begin date"
                    name={fields.beginDate}
                    isRequired
                    size="md"
                    value={usDateFormat(values[fields.beginDate])}
                    isDatePicker
                    onClear={() => onDaySelected(fields.beginDate, null)}
                    popupContent={
                      <DatePicker
                        minDate={new Date(scheduleBeginDate)}
                        onDayClick={(value) =>
                          onDaySelected(fields.beginDate, value)
                        }
                        value={values[fields.beginDate]}
                      />
                    }
                    disabled={isEdit && !isSave}
                    validate={required}
                    component={FieldDropSide}
                  />
                  <Field
                    label="Period end date"
                    name={fields.endDate}
                    isRequired
                    size="md"
                    value={usDateFormat(values[fields.endDate])}
                    isDatePicker
                    onClear={() => onDaySelected(fields.endDate, null)}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.endDate, value)
                        }
                        value={values[fields.endDate]}
                      />
                    }
                    disabled={isEdit && !isSave}
                    validate={required}
                    component={FieldDropSide}
                  />
                  <Field
                    label="Pay date"
                    name={fields.payDate}
                    isRequired
                    size="md"
                    value={usDateFormat(values[fields.payDate])}
                    isDatePicker
                    onClear={() => onDaySelected(fields.payDate, null)}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.payDate, value)
                        }
                        value={values[fields.payDate]}
                      />
                    }
                    disabled={isEdit && !isSave}
                    validate={required}
                    component={FieldDropSide}
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

export default PayrollCalendarManagePayDatesContainer;
