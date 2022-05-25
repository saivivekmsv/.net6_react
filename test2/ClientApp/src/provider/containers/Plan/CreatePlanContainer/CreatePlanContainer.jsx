import React, { useContext, useState } from "react";
import { get, isEmpty, trim, upperFirst } from "lodash";
import { Formik, Field } from "formik";
import { Form } from "react-bootstrap";
import {
  SearchableList,
  FieldInput,
  FieldButtonGroup,
  FieldDropSide,
  ManagePlanLayout,
  SelectCompanyDropdown,
  SponsoringOrgDropdown,
  DropdownWithAjaxSearch,
} from "../../../components";
import {
  ROUTES,
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  required,
  clearFieldValues,
  FLOW_TYPES,
  tranformListToDropdownValues,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  errors,
  contextSharing,
  contextIds,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanFullPageData,
  setManageCreateData,
  setManagePlanToastInfo,
  savePlanDetailsAction,
  setManagePlanFlow,
} from "../../../contexts";
import {
  checkRkPlanNumberExists,
  getPlanCompanyNameExists,
  postCompanyGridView,
  postPlanGridDetails,
  getMasterPlans,
} from "../../../services";

const initialValues = {};

const CreatePlan = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const [protoTypeList, setProtoTypeList] = useState([]);
  const [masterPlanList, setMasterPlanList] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const buttons = [
    {
      link: ROUTES.PLAN,
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "Create Plan",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD],
    },
  ];

  const formName = managePlanFormNames.CREATE_PLAN;
  const fields = formFields[formName];
  const sponsoringOrganisationList = get(state, "sponsoringOrgList");

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    const selectedPlanCatergory =
      OPTIONS_DATA_MAPPER.PLAN_CATERGORY[values.category];
    const selectedPlanLevel = OPTIONS_DATA_MAPPER.PLAN_LEVEL[values.level];

    if (
      ["MEP", "PEP"].includes(selectedPlanCatergory) &&
      selectedPlanLevel === "Adopting Employer"
    ) {
      const userResponse = window.confirm(
        "This Plan will inherit all the attributes of the Master MEP (or PEP) chosen. Do you wish to continue?"
      );
      if (!userResponse) {
        return;
      }
    }

    const { history } = props;
    const planName = values.planName;
    const categoryName = values.category;
    const company = values.companyId;
    const planTypes = values.planType;

    if (values.sponsoringOrganisationId && values.sponsoringOrganisation) {
      const sponsoringOrganisation = {
        id: values.sponsoringOrganisationId,
        name:
          typeof values.sponsoringOrganisation === "string"
            ? values.sponsoringOrganisation
            : values.sponsoringOrganisation.name,
      };
      values.sponsoringOrganisation = sponsoringOrganisation;
      // delete values.sponsoringOrganisationId;
    }

    let objectKeys = Object.keys(values);

    let requestObject = {};

    objectKeys.forEach((key) => {
      if (values[key]) {
        requestObject[key] = values[key];
      }
    });

    // delete values.name;
    savePlanDetailsAction(
      {
        ...requestObject,
        planName: upperFirst(planName) || undefined,
      },
      dispatch,
      state
    ).then((response) => {
      if (!response.isSuccessful) {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      } else {
        const newPlanId = get(response, "plan.id");
        dispatch(
          setManagePlanFlow({
            planId: newPlanId,
          })
        );
        dispatch(
          setManageCreateData({
            formName: formName,
            fieldData: values,
          })
        );
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: (
              <div>
                <p className="success-toast-text">{`${planName} - Plan Created Successfully`}</p>
                <p className="success-toast-sub-text">{`This is a ${categoryName} Plan of ${planTypes} created for ${company}.`}</p>
              </div>
            ),
          })
        );
        history.push(`${MANAGE_PLAN_ROUTES.BASIC_DETAILS}/${newPlanId}`);
      }
    });
  };
  const formInitialValues = get(state, managePlanFormNames.CREATE_PLAN, {});

  const refreshSonsoringOrg = (sponsoringOrgListResponse) => {
    dispatch(
      setManagePlanFullPageData({
        sponsoringOrgList: tranformListToDropdownValues(
          sponsoringOrgListResponse,
          "name",
          "id"
        ),
      })
    );
  };

  const onProtoTypeResponseCallback = (reponse) => {
    setProtoTypeList(tranformListToDropdownValues(reponse, "planName", "id"));
  };

  const onMasterPlanResponseCallback = (reponse) => {
    setMasterPlanList(tranformListToDropdownValues(reponse, "name", "id"));
  };

  const onCompanylistResponseCallback = (reponse) => {
    setCompanyList(tranformListToDropdownValues(reponse, "name", "id"));
  };
  const companyIdFromContext = get(
    contextSharing.getContext(contextIds.companyDetails),
    "companyId"
  );

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formInitialValues,
        companyId: companyIdFromContext,
        AECompany: companyIdFromContext,
        [fields.category]: 0,
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
        values,
        setValues,
        setTouched,
        setSubmitting,
        ...rest
      }) => {
        const onPlanCategoryChange = (value) => {
          const updatedValues = clearFieldValues({
            values,
            fieldsToExculde: [
              fields.category,
              fields.planName,
              fields.rkPlanNumber,
            ],
          });
          setValues({
            ...updatedValues,
            [fields.category]: value,
          });
          setTouched({});
        };

        const onSponsoringOrgChange = (value, label) => {
          setValues({
            ...values,
            [fields.sponsoringOrganisationId]: value,
            [fields.sponsoringOrganisation]: label,
          });
        };
        const selectedPlanCatergory =
          OPTIONS_DATA_MAPPER.PLAN_CATERGORY[values.category];
        const selectedPlanLevel = OPTIONS_DATA_MAPPER.PLAN_LEVEL[values.level];
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={FLOW_TYPES.ADD}>
              <Field
                isRequired
                name={fields.category}
                label={"Select plan category"}
                placeholder="Plan Category"
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.PLAN_CATERGORY
                )}
                selectedValue={values[fields.category]}
                type="text"
                autoComplete="off"
                value={values[fields.category]}
                onChange={onPlanCategoryChange}
                component={FieldButtonGroup}
              />

              {["MEP", "PEP"].includes(selectedPlanCatergory) ? (
                <Field
                  isRequired
                  name={fields.level}
                  label={"Select a plan level"}
                  placeholder="Plan Level"
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.PLAN_LEVEL
                  )}
                  selectedValue={values[fields.level]}
                  type="text"
                  autoComplete="off"
                  value={values[fields.level]}
                  onChange={(value) => {
                    setValues({
                      ...values,
                      [fields.level]: value,
                    });
                  }}
                  component={FieldButtonGroup}
                />
              ) : (
                ""
              )}
              {selectedPlanLevel === "Master" ? (
                <Field
                  isRequired
                  label="Select a Sponsoring Organization"
                  placeholder="Sponsoring Organization"
                  name={fields.sponsoringOrganisationId}
                  value={values[fields.sponsoringOrganisationId]}
                  // disabled={isEdit || isSave}
                  options={sponsoringOrganisationList}
                  popupContent={
                    <SponsoringOrgDropdown
                      data={sponsoringOrganisationList}
                      onSelect={onSponsoringOrgChange}
                      refreshData={refreshSonsoringOrg}
                    />
                  }
                  component={FieldDropSide}
                />
              ) : (
                ""
              )}
              {selectedPlanLevel === "Adopting Employer" ? (
                <Field
                  isRequired
                  label="Select AE Company"
                  placeholder="AE Company"
                  name={fields.companyId}
                  value={values[fields.companyId]}
                  // disabled={isEdit || isSave}
                  options={companyList}
                  popupContent={
                    <SelectCompanyDropdown
                      label="Select Company"
                      onSelect={(value) =>
                        setFieldValue(fields.companyId, value)
                      }
                      options={companyList}
                      setResponseList={onCompanylistResponseCallback}
                      method={postCompanyGridView}
                      defaultPayload={{
                        from: 0,
                        searchString: "",
                        to: 100,
                      }}
                      payloadKey="searchString"
                      setSubmitting={setSubmitting}
                      value={values[fields.companyId]}
                    />
                  }
                  noLabelTransform
                  component={FieldDropSide}
                />
              ) : (
                ""
              )}
              {selectedPlanLevel === "Adopting Employer" ? (
                <Field
                  isRequired
                  label="Select a Master Plan"
                  name={fields.mepPlanId}
                  value={values[fields.mepPlanId]}
                  // disabled={isEdit || isSave}
                  placeholder="Master Plan"
                  options={masterPlanList}
                  popupContent={
                    <DropdownWithAjaxSearch
                      label="Select Master Plan provided by SO1"
                      onSelect={(value) =>
                        setFieldValue(fields.mepPlanId, value)
                      }
                      options={masterPlanList}
                      setResponseList={onMasterPlanResponseCallback}
                      method={getMasterPlans}
                      defaultPayload={null}
                      payloadKey="searchString"
                      value={values[fields.mepPlanId]}
                    />
                  }
                  component={FieldDropSide}
                />
              ) : (
                ""
              )}
              {selectedPlanLevel === "Adopting Employer" ? (
                ""
              ) : (
                <Field
                  isRequired
                  label="Select a plan type"
                  placeholder="Plan Type"
                  name={fields.planType}
                  value={values[fields.planType]}
                  // disabled={isEdit || isSave}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.PLAN_TYPES
                  )}
                  popupContent={
                    <SearchableList
                      label="Select a plan type"
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.PLAN_TYPES
                      )}
                      onSelect={(value) =>
                        setFieldValue(fields.planType, value)
                      }
                      selectedValue={values[fields.planType]}
                      isNotTypeAhead
                    />
                  }
                  component={FieldDropSide}
                />
              )}
              {["MEP", "PEP"].includes(selectedPlanCatergory) ? (
                ""
              ) : (
                <Field
                  label="Choose a prototype"
                  name={fields.prototype}
                  value={values[fields.prototype]}
                  placeholder="Prototype"
                  // disabled={isEdit || isSave}
                  options={protoTypeList}
                  popupContent={
                    <DropdownWithAjaxSearch
                      label="Choose a prototype"
                      onSelect={(value) =>
                        setFieldValue(fields.prototype, value)
                      }
                      options={protoTypeList}
                      setResponseList={onProtoTypeResponseCallback}
                      method={postPlanGridDetails}
                      defaultPayload={{
                        planCategory: 3,
                        from: 1,
                        searchString: "",
                        to: 100,
                      }}
                      payloadKey="searchString"
                      value={values[fields.prototype]}
                    />
                  }
                  component={FieldDropSide}
                />
              )}
              {["MEP", "PEP"].includes(selectedPlanCatergory) ? (
                ""
              ) : (
                <Field
                  isRequired
                  label="Select a company"
                  placeholder="Company"
                  name={fields.companyId}
                  value={values[fields.companyId]}
                  // disabled={isEdit || isSave}
                  options={companyList}
                  popupContent={
                    <SelectCompanyDropdown
                      label="Select Company"
                      onSelect={(value) =>
                        setFieldValue(fields.companyId, value)
                      }
                      options={companyList}
                      setResponseList={onCompanylistResponseCallback}
                      method={postCompanyGridView}
                      defaultPayload={{
                        from: 1,
                        searchString: "",
                        to: 100,
                      }}
                      payloadKey="searchString"
                      setSubmitting={setSubmitting}
                      value={values[fields.companyId]}
                    />
                  }
                  component={FieldDropSide}
                />
              )}
              <Field
                isRequired
                name={fields.planName}
                label={"New Plan name"}
                type="text"
                placeholder="Plan name"
                autoComplete="none"
                value={values[fields.planName]}
                onChange={handleChange}
                // disabled={isEdit}
                noLabelTransform
                component={FieldInput}
              />
              <Field
                isRequired
                name={fields.rkPlanNumber}
                label={"Plan ID (record keeping plan number)"}
                type="text"
                placeholder="Plan ID"
                autoComplete="none"
                value={values[fields.rkPlanNumber]}
                onChange={handleChange}
                // disabled={isEdit}
                noLabelTransform
                component={FieldInput}
              />
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreatePlan;
