import React, { useContext, useState } from "react";
import { find, get, isEmpty } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldInput,
  FieldButtonGroup,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  required,
  yesNoOptions,
  FORM_PLACEHOLDERS,
  getFormattedPhone,
  getPathWithParam,
  getAdvancedPathWithParam,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  setManagePlanFlow,
  setManagePageLevelData,
  savePlanDetailsAction,
} from "../../../contexts";
import { useRouterParams } from "../../../abstracts";

const initialValues = {
  advisorPlanMapId: 0,
  workPhoneNumber: null,
  website: null,
  level: 2,
  tenantId: 2,
  addToMaster: false,
};

const AddAdvisorContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow] = useState("");
  const { planId, flow, advisorId } = useRouterParams();
  const formName = managePlanFormNames.ADD_ADVISOR_MANAGE_PLAN;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const intAdvisorId = parseInt(advisorId, 10);
  const advisorsListData = get(apiData, "advisors", []);
  const formValues =
    find(advisorsListData, {
      id: intAdvisorId,
    }) || {};
  const isAddedToMaster = formValues[fields.addToMaster];

  const onDeleteClick = ({ setFieldError, setFieldTouched }) => {
    savePlanDetailsAction(
      {
        advisors: advisorsListData.filter((item) => item.id != advisorId),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: `Advisor deleted successfully`,
          })
        );
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ADVISOR,
            pathParam: [flow, planId],
          })
        );
      } else {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      }
    });
  };

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADVISOR,
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
        path: MANAGE_PLAN_ROUTES.ADVISOR,
        pathParam: [FLOW_TYPES.EDIT, planId],
      }),
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [!isAddedToMaster && FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.ADD_ADVISOR,
            pathParam: [FLOW_TYPES.SAVE, planId, advisorId],
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

  const getDataForSave = (values) => {
    const { advisorCompanyName } = values;
    const updatedValues = {
      ...formValues,
      ...values,
      advisorCompanyName: advisorCompanyName || undefined,
      contactDetails: {
        mobilePhoneNumber: values.mobilePhoneNumber || undefined,
        workPhoneNumber: values.workPhoneNumber || undefined,
        email: values.email || undefined,
        website: values.website || undefined,
      },
    };

    if (isEmpty(formValues)) {
      return [...advisorsListData, updatedValues];
    }

    return advisorsListData.map((item) => {
      if (item.id === intAdvisorId) {
        return { ...updatedValues };
      }
      return item;
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    savePlanDetailsAction(
      {
        advisors: getDataForSave(values),
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
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.ADVISOR,
            pathParam: [flow, planId],
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
    });
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  const layoutHeader = advisorId && "Advisor";
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
        email: get(formValues, "contactDetails.email", null),
        mobilePhoneNumber: get(
          formValues,
          "contactDetails.mobilePhoneNumber",
          null
        ),
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        setValues,
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
              <p className="plan-sub-heading">
                {advisorId ? "Edit Advisor" : "Add New Advisor"}
              </p>
              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    isRequired
                    name={fields.advisorCompanyName}
                    label={"Advisor Company Name"}
                    type="text"
                    autoComplete="off"
                    value={values[fields.advisorCompanyName]}
                    onChange={handleChange}
                    disabled={isAddedToMaster || (isEdit && !isSave)}
                    component={FieldInput}
                  />
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    isRequired
                    name={fields.email}
                    label={"Email"}
                    type="text"
                    autoComplete="off"
                    value={values[fields.email]}
                    onChange={handleChange}
                    disabled={isAddedToMaster || (isEdit && !isSave)}
                    component={FieldInput}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    isRequired
                    name={fields.mobilePhoneNumber}
                    label={"Phone Number"}
                    type="text"
                    autoComplete="off"
                    onChange={handleChange}
                    disabled={isAddedToMaster || (isEdit && !isSave)}
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

export default AddAdvisorContainer;
