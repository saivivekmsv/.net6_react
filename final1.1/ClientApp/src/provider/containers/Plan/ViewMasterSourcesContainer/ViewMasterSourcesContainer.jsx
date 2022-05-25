import React from "react";
import { Formik } from "formik";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { ManagePlanLayout } from "../../../components";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  managePlanFormNames,
  formFields,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import BasicInformationForm from "../ManageSourcesNewContainer/BasicInformationForm";

const ViewMasterSourcesContainer = (props) => {
  const { planId } = useRouterParams();
  const formName = managePlanFormNames.BASIC_SOURCES;
  const fields = formFields[formName];

  const buttons = [
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES,
        pathParam: planId,
      }),
    },
  ];

  return (
    <Formik initialValues={{}} validateOnChange={false} validateOnBlur={false}>
      {(formProps) => {
        return (
          <ManagePlanLayout buttons={buttons} pageFlow={FLOW_TYPES.EDIT}>
            <div className="plan-heading">Basic Source Information</div>
            <BasicInformationForm {...formProps} fields={fields} isEdit />
          </ManagePlanLayout>
        );
      }}
    </Formik>
  );
};

export default ViewMasterSourcesContainer;
