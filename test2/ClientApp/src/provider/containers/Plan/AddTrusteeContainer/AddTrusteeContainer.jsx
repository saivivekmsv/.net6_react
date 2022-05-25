import React, { useContext, useState } from "react";
import { get, isEmpty, find, last } from "lodash";
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
  getPathWithParam,
  required,
  yesNoOptions,
  FORM_PLACEHOLDERS,
  getFormattedPhone,
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
  trusteePlanMapId: 0,
  workPhoneNumber: null,
  website: null,
  level: 2,
  tenantId: 2,
  addToMaster: false,
};

const AddTrusteeContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow] = useState("");
  const { planId, flow, trusteeId } = useRouterParams();
  const formName = managePlanFormNames.ADD_TRUSTEE_MANAGE_PLAN;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const trusteeListData = get(apiData, "trustees", []);
  const intTrusteeId = parseInt(trusteeId, 10);
  const formValues =
    find(trusteeListData, {
      id: intTrusteeId,
    }) || {};
  const isAddedToMaster = formValues[fields.addToMaster];

  const onDeleteClick = ({ setFieldError, setFieldTouched }) => {
    savePlanDetailsAction(
      {
        trustees: trusteeListData.filter((item) => item.id != intTrusteeId),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: `Trustee deleted successfully`,
          })
        );
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.TRUSTEE,
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

  const getDataForSave = (values) => {
    const { trusteeCompanyName } = values;
    const updatedValues = {
      ...formValues,
      ...values,
      trusteeCompanyName: trusteeCompanyName || undefined,
      contactDetails: {
        mobilePhoneNumber: values.mobilePhoneNumber || undefined,
        workPhoneNumber: values.workPhoneNumber || undefined,
        email: values.email || undefined,
        website: values.website || undefined,
      },
    };
    if (isEmpty(formValues)) {
      return [...trusteeListData, updatedValues];
    }

    return trusteeListData.map((item) => {
      if (item.id === intTrusteeId) {
        return { ...item, ...updatedValues };
      }
      return item;
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    const { history } = props;

    savePlanDetailsAction(
      {
        trustees: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        // const newPlanId = get(response, "id");
        const newPlanId = get(response, "plan.id"); //get(last(get(response, "trustees", [])), "plan.id");
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
            path: MANAGE_PLAN_ROUTES.TRUSTEE,
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
    });
  };

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.TRUSTEE,
        pathParam: [flow, planId],
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
        path: MANAGE_PLAN_ROUTES.TRUSTEE,
        pathParam: [flow, planId],
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
            path: MANAGE_PLAN_ROUTES.ADD_TRUSTEE,
            pathParam: [FLOW_TYPES.SAVE, planId, trusteeId],
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

  // const formInitialValues = get(state, managePlanFormNames.ADD_TRUSTEE_MANAGE_PLAN, {});
  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  const layoutHeader = trusteeId && "Trustee";
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
        email: get(formValues, "contactDetails.email", ""),
        mobilePhoneNumber: get(
          formValues,
          "contactDetails.mobilePhoneNumber",
          ""
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
                {trusteeId ? "Edit Trustee" : "Add New Trustee"}
              </p>
              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    name={fields.trusteeCompanyName}
                    label={"Trustee Company Name"}
                    type="text"
                    autoComplete="off"
                    value={values[fields.trusteeCompanyName]}
                    onChange={handleChange}
                    disabled={isAddedToMaster || (isEdit && !isSave)}
                    component={FieldInput}
                    isRequired
                  />
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    name={fields.email}
                    label={"Email"}
                    type="text"
                    autoComplete="off"
                    value={values[fields.email]}
                    onChange={handleChange}
                    disabled={isAddedToMaster || (isEdit && !isSave)}
                    component={FieldInput}
                    isRequired
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    name={fields.mobilePhoneNumber}
                    label={"Phone Number"}
                    type="text"
                    autoComplete="off"
                    onChange={handleChange}
                    disabled={isAddedToMaster || (isEdit && !isSave)}
                    component={FieldInput}
                    isRequired
                    maxLength="12"
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

export default AddTrusteeContainer;
