import React, { useContext, useState, useEffect } from "react";
import { get, isEmpty } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldInput,
  FieldInputSSN,
} from "../../../components";
import * as Yup from "yup";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getFormattedSsn,
  getFormattedPhone,
  FORM_PLACEHOLDERS,
  getPathWithParam,
  getAdvancedPathWithParam,
  required,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  setManagePlanFlow,
  setManagePageLevelData,
  savePlanDetailsAction,
} from "../../../contexts";
import { useRouterParams } from "../../../abstracts";
const characters = (value) => /^[a-zA-Z]+$/.test(value);
const digits = (value) => /^\d+$/.test(value);

const initialValues = {
  id: 0,
  middleName: null,
  workPhoneNumber: null,
  website: null,
  firstName: "",
};

let x = Math.pow(10, 3);

const take3Digits = (val) => {
  return Math.Truncate(val / Math.Pow(10, val.length - 3));
};
const AddSponsorContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow] = useState("");
  const { planId, flow, sponsorId } = useRouterParams();
  const formName = managePlanFormNames.ADD_SPONSOR_MANAGE_PLAN;
  const fields = formFields[formName];
  const [formValues, setFormValues] = useState({});
  const apiData = get(state, "api.data", {});
  const sponsorsListData = get(apiData, "sponsors", []);

  const schema = Yup.object().shape();
  const checkSSN = (val) => {
    console.log(sponsorId);
    var result = false;
    sponsorsListData.forEach((item, index) => {
      if (item.id !== sponsorId && item.ssn === val) result = true;
    });
    console.log("returning False");
    return result;
  };
  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.SPONSOR,
        pathParam: [FLOW_TYPES.EDIT, planId],
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
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.SPONSOR,
        pathParam: [FLOW_TYPES.EDIT, planId],
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
            path: MANAGE_PLAN_ROUTES.ADD_SPONSOR,
            pathParam: [FLOW_TYPES.SAVE, planId, sponsorId],
          })
        ),
    },
  ];

  useEffect(() => {
    let value = sponsorsListData.filter((data) => {
      // eslint-disable-next-line eqeqeq
      return data.id == sponsorId;
    });
    setFormValues(
      (value[0] && {
        ...value[0],
        firstName: value[0].name.firstName,
        lastName: value[0].name.lastName,
        email: value[0].contactDetails.email,
        mobilePhoneNumber: value[0].contactDetails.mobilePhoneNumber,
      }) ||
        {}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsorsListData.length]);

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    const { history } = props;
    const name = {
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      middleName: values.middleName || undefined,
    };

    const contactDetails = {
      mobilePhoneNumber: values.mobilePhoneNumber || undefined,
      workPhoneNumber: values.workPhoneNumber || undefined,
      email: values.email || undefined,
      website: values.website || undefined,
    };
    values.contactDetails = contactDetails;
    values.name = name;
    let objectKeys = Object.keys(values);
    let requestObject = {};
    objectKeys.forEach((key) => {
      if (values[key]) {
        requestObject[key] = values[key];
      }
    });
    savePlanDetailsAction(
      {
        sponsors:
          // eslint-disable-next-line eqeqeq
          sponsorId
            ? sponsorsListData.map((sponsor) => {
                if (sponsor.id === parseInt(sponsorId)) {
                  return { ...requestObject, id: parseInt(sponsorId) };
                }
                return sponsor;
              })
            : [...sponsorsListData, { ...requestObject }],
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        const newPlanId = get(response, "plan.id");
        dispatch(
          setManagePlanFlow({
            planId: newPlanId,
          })
        );

        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.SPONSOR,
            pathParam: [flow, newPlanId],
          })
        );
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: "Data saved successfully",
          })
        );
      } else {
        setSubmitting(false);
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      }
      dispatch(
        setManagePageLevelData({
          formName: formName,
          fieldData: values,
        })
      );
    });
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  const layoutHeader = sponsorId && "Sponsor";
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={schema}
      onSubmit={onFormSubmit}
      enableReinitialize
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        submitForm,
        errors,
        values,
        setSubmitting,
        ...rest
      }) => {
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout
              buttons={buttons}
              pageFlow={newFlow || flow}
              layoutHeader={layoutHeader}
            >
              <Row>
                <Col md="2">
                  <Field
                    isRequired
                    size="sm"
                    name={fields.firstName}
                    label={"First name"}
                    type="text"
                    autoComplete="off"
                    value={values[fields.firstName]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />
                </Col>
                <Col md="2">
                  <Field
                    isRequired
                    size="sm"
                    name={fields.lastName}
                    label={"Last name"}
                    type="text"
                    autoComplete="off"
                    value={values[fields.lastName]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="5">
                  <Field
                    name={fields.ssn}
                    label={"Social Security Number"}
                    type="text"
                    autoComplete="off"
                    value={getFormattedSsn(values[fields.ssn])}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    placeholder="___-__-____"
                    noLabelTransform
                    component={FieldInputSSN}
                    maxLength="11"
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    isRequired
                    name={fields.email}
                    label={"Email"}
                    type="text"
                    autoComplete="off"
                    value={values[fields.email]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    name={fields.mobilePhoneNumber}
                    label={"Phone Number"}
                    type="text"
                    autoComplete="off"
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                    value={getFormattedPhone(values[fields.mobilePhoneNumber])}
                    placeholder={FORM_PLACEHOLDERS.phone}
                    maxLength="12"
                  />
                </Col>
              </Row>
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddSponsorContainer;
