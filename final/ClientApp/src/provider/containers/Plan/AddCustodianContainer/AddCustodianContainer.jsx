import React, { useContext, useState } from "react";
import { find, get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
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
  getFormattedPhone,
  FORM_PLACEHOLDERS,
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
  custodianPlanMapId: 0,
  workPhoneNumber: null,
  website: null,
  level: 2,
  tenantId: 2,
  addToMaster: true,
};

const AddCustodianContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow] = useState("");
  const { planId, flow, custodianId } = useRouterParams();
  const formName = managePlanFormNames.ADD_CUSTODIAN_MANAGE_PLAN;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const custodianListData = get(apiData, "custodians", []);
  const intCustodianId = parseInt(custodianId, 10);
  const formValues =
    find(custodianListData, {
      id: intCustodianId,
    }) || {};
  const isAddedToMaster = formValues[fields.addToMaster];

  const onDeleteClick = ({ setFieldError, setFieldTouched }) => {
    savePlanDetailsAction(
      {
        custodians: custodianListData.filter((item) => item.id != custodianId),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: `Custodian company deleted successfully`,
          })
        );
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.CUSTODIAN,
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
        path: MANAGE_PLAN_ROUTES.CUSTODIAN,
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
        path: MANAGE_PLAN_ROUTES.CUSTODIAN,
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
            path: MANAGE_PLAN_ROUTES.ADD_CUSTODIAN,
            pathParam: [FLOW_TYPES.SAVE, planId, custodianId],
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
    const { custodianCompanyName } = values;
    const updatedValues = {
      ...formValues,
      ...values,
      custodianCompanyName: custodianCompanyName || undefined,
      contactDetails: {
        mobilePhoneNumber: values.mobilePhoneNumber || undefined,
        workPhoneNumber: values.workPhoneNumber || undefined,
        email: values.email || undefined,
        website: values.website || undefined,
      },
    };
    if (isEmpty(formValues)) {
      return [...custodianListData, updatedValues];
    }

    return custodianListData.map((item) => {
      if (item.id === intCustodianId) {
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
        custodians: getDataForSave(values),
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
            path: MANAGE_PLAN_ROUTES.CUSTODIAN,
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
  const layoutHeader = custodianId && "Custodian";
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
                {custodianId ? "Edit Custodian" : "Add New Custodian"}
              </p>
              <Field
                size="md"
                isRequired
                name={fields.custodianCompanyName}
                label={"Custodian Company Name"}
                type="text"
                autoComplete="off"
                value={values[fields.custodianCompanyName]}
                onChange={handleChange}
                disabled={isAddedToMaster || (isEdit && !isSave)}
                component={FieldInput}
              />
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
                value={getFormattedPhone(values[fields.mobilePhoneNumber])}
                placeholder={FORM_PLACEHOLDERS.phone}
                maxLength="12"
              />
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddCustodianContainer;
