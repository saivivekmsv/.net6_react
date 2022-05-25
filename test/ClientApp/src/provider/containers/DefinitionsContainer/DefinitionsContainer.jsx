import React, { useContext, useState } from "react";
import { get, isEmpty, upperFirst } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManageCompanyLayout,
  SponsoringOrgDropdown,
  FieldInput,
  FieldButtonGroup,
  FieldDropSide,
} from "../../components";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  getFlowBasedFormValues,
  tranformListToDropdownValues,
  errors,
  OPTIONS_DATA_MAPPER,
  required,
} from "../../utils";
import {
  manageCompanyStore,
  setManageCompanyFlow,
  setManageCompanyToastInfo,
  setManageCompanyFullPageData,
  saveCompanyDetails,
} from "../../contexts";
import { useRouterParams, useRequest } from "../../abstracts";
import { getCheckCompanyNameExists } from "../../services";
import { useEffect } from "react";

const companyTypeOptions = [
  { label: "Regular", value: 0 },
  { label: "MEP", value: 1 },
  { label: "PEP", value: 2 },
];

const initialValues = {};

const DefinitionsContainer = (props) => {
  const [formCompanyName, setFormCompanyName] = useState("");
  const { state, dispatch } = useContext(manageCompanyStore);
  const [newFlow, setNewFlow] = useState("");
  const { companyId, flow } = useRouterParams();
  const formName = manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY;
  const fields = formFields[formName];
  const sponsoringOrganisationList = get(state, "sponsoringOrgList");

  const {
    loading: checkingCompanyName,
    response: companyNameResponse,
  } = useRequest({
    method: getCheckCompanyNameExists,
    payload: formCompanyName,
    delay: 500,
    triggerOnlyOnUpdate: true,
  });

  const refreshSonsoringOrg = (sponsoringOrgListResponse) => {
    dispatch(
      setManageCompanyFullPageData({
        sponsoringOrgList: tranformListToDropdownValues(
          sponsoringOrgListResponse,
          "sponsoringOrganisationName",
          "id"
        ),
      })
    );
  };

  const buttons = [
    {
      link: ROUTES.COMPANY,
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "Add Company",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: ROUTES.COMPANY,
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () => setNewFlow(FLOW_TYPES.SAVE),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const onFormSubmit = (values) => {
    const { history } = props;
    const companyName = get(values, fields.companyName);
    const employerType = get(values, fields.companyType);
    const sponsoringOrganizationId = get(
      values,
      fields.sponsoringOrganizationId
    );

    if (companyNameResponse) {
      return;
    }

    saveCompanyDetails(
      {
        id: companyId && parseInt(companyId, 10),
        name: upperFirst(companyName),
        employerType,
        sponsoringOrganizationId,
      },
      dispatch,
      state
    ).then((response) => {
      const newCompanyId = get(response, "id", companyId);
      const newCompanyName = get(response, "name");
      const newEmployerType = get(response, "employerType");
      dispatch(
        setManageCompanyFlow({
          companyId: newCompanyId,
        })
      );
      const toastMessage = "Data saved successfully";

      dispatch(
        setManageCompanyToastInfo({
          showToast: true,
          toastMessage,
        })
      );
      history.push(
        getPathWithParam({
          path: MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS,
          pathParam: [flow, newCompanyId],
        })
      );
    });
  };

  const formValues = get(state, formName, {});

  useEffect(() => {
    if (companyId && !isEmpty(formValues)) {
      setNewFlow(FLOW_TYPES.EDIT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  const isEdit = newFlow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  let companyNameCheckTimeout = null;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...getFlowBasedFormValues(get(state, formName, {})),
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
        ...rest
      }) => {
        const onCompanyNameChange = (e) => {
          handleChange(e);
          window.clearTimeout(companyNameCheckTimeout);
          companyNameCheckTimeout = window.setTimeout(() => {
            setFormCompanyName(e.target.value);
          }, 500);
        };

        const onSponsoringOrgChange = (value, label) => {
          setValues({
            ...values,
            [fields.sponsoringOrganizationId]: value,
            [fields.sponsoringOrganizationIdName]: label,
          });
        };
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={rest.submitCount > 0}
          >
            <ManageCompanyLayout buttons={buttons} pageFlow={newFlow || flow}>
              <Row>
                <Col>
                  <Field
                    isRequired
                    name={fields.companyName}
                    label={isEdit ? "Company name" : "New company name"}
                    hasSuggestion
                    isSuggestionLoading={checkingCompanyName}
                    isValidSuggestion={!companyNameResponse}
                    suggestionErrorMessage={errors.companyName.alreadyExist}
                    type="text"
                    autoComplete="off"
                    value={values[fields.companyName]}
                    onChange={onCompanyNameChange}
                    disabled={isEdit}
                    component={FieldInput}
                    validate={required}
                  />
                  <Field
                    name={fields.companyType}
                    isRequired
                    label="Company type"
                    options={companyTypeOptions}
                    selectedValue={values[fields.companyType]}
                    onChange={(value) => {
                      setValues({
                        ...values,
                        [fields.companyType]: value,
                        [fields.sponsoringOrganizationId]: undefined,
                      });
                    }}
                    disabled={isEdit || isSave}
                    component={FieldButtonGroup}
                    validate={required}
                  />
                  {[1, 2].includes(values[fields.companyType]) && (
                    <Field
                      isRequired
                      label="Sponsoring organization"
                      name={fields.sponsoringOrganizationId}
                      value={values[fields.sponsoringOrganizationId]}
                      disabled={isEdit || isSave}
                      options={sponsoringOrganisationList}
                      popupContent={
                        <SponsoringOrgDropdown
                          data={sponsoringOrganisationList}
                          onSelect={onSponsoringOrgChange}
                          refreshData={refreshSonsoringOrg}
                        />
                      }
                      validate={required}
                      component={FieldDropSide}
                    />
                  )}
                </Col>
              </Row>
            </ManageCompanyLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DefinitionsContainer;
