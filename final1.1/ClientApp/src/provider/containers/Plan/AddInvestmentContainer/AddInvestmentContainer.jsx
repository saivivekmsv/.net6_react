import React, { useContext, useState } from "react";
import { find, get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldDropSide,
  SearchableList,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  required,
  tranformListToDropdownValues,
  transformToMultiselectSave,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  clearFieldValues,
  getSaveMessage,
} from "../../../utils";
import {
  createPlanStore,
  savePlanDetailsAction,
  setManagePlanToastInfo,
} from "../../../contexts";
// import investmentsMasterData from "../../../mocks/investmentsMaster.json";
import { useRouterParams } from "../../../abstracts";
import NonModalInvestmentForm from "./NonModalInvestmentForm";
import ModalInvestmentForm from "./ModalInvestmentForm";

const initialValues = {};

const AddInvestmentContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, investmentId } = useRouterParams();
  const [newFlow, setNewFlow] = useState(investmentId ? FLOW_TYPES.EDIT : "");
  const formName = managePlanFormNames.ADD_INVESTMENT;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const investmentsData = get(apiData, "investments", []);
  const intInvestmentId = parseInt(investmentId, 10);
  const formValues = find(investmentsData, {
    id: intInvestmentId,
  });
  const investmentsList = tranformListToDropdownValues(
    get(apiData, "investments", []),
    "name",
    "id"
  );

  const restrictionsList = get(formValues, "restrictions", []);
  const initialValues = {
    [fields.isInvestmentQDIA]: false,
    [fields.isInvestmentOfComputingFundApplicable]: false,
    [fields.isProspectusDeliveryWith1stTransferApplicable]: false,
  };

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_INVESTMENTS_PLAN,
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
      flow: [FLOW_TYPES.ADD],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_INVESTMENTS_PLAN,
        pathParam: [flow, planId],
      }),
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
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_INVESTMENTS_PLAN,
        pathParam: [flow, planId],
      }),
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTrashAlt,
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const getDataForSave = (values) => {
    const updatedValues = {
      ...formValues,
      ...values,
      type: values[fields.investmentType] || undefined,
      volatility: values[fields.volatility] || undefined,
      shareClass: values[fields.shareClass] || undefined,
      investmentCategory: values[fields.investmentCategory] || undefined,
      status: values[fields.investmentStatus] || undefined,
      typeOfEarnings: values[fields.typeOfEarnings] || undefined,
      investmentObjective: values[fields.investmentObjective] || undefined,
      prospectusDeliveryMethod:
        values[fields.prospectusDeliveryMethod] || undefined,
      frequencyOfProspectusDisclaimer:
        values[fields.prospectusDeliveryFrequency] || undefined,
      dividendType: values[fields.dividendType] || undefined,
      dividendProcessingFrequency:
        values[fields.dividendProcessingFrequency] || undefined,
      inceptionDate: values[fields.inceptionDate] || undefined,
      applicableInvestments: [
        ...transformToMultiselectSave(
          (values[fields.applicableInvestments] || []).filter(
            (val) =>
              !get(formValues, fields.applicableInvestments, [])
                .map((_) => _.computingFundInvestmentId)
                .includes(val)
          ),
          "computingFundInvestmentId"
        ),
        ...get(formValues, fields.applicableInvestments, []).filter((val) =>
          values[fields.applicableInvestments].includes(
            val.computingFundInvestmentId
          )
        ),
      ],
    };

    if (isEmpty(formValues)) {
      return [...investmentsData, updatedValues];
    }

    return investmentsData.map((item) => {
      if (item.id === intInvestmentId) {
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
        investments: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        //const newPlanId = get(response, "plan.id");
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_INVESTMENTS_PLAN,
            pathParam: [flow, planId], // put the company id after crated
          })
        );

        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: getSaveMessage(
              investmentId,
              `New Investment ${values[fields.investmentName]} has been created`
            ),
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

  const isEdit = newFlow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  const layoutHeader = investmentId && "Investment";
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
        [fields.applicableInvestments]: get(
          formValues,
          fields.applicableInvestments,
          []
        )?.map((val) => val.computingFundInvestmentId),
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
        setTouched,
        ...rest
      }) => {
        const onInvestmentTypeChange = (value) => {
          const updatedValues = clearFieldValues({
            values,
            fieldsToExculde: [fields.investmentType],
          });
          setValues({
            ...updatedValues,
            [fields.investmentType]: value,
            [fields.investmentName]: null,
            [fields.investmentDescription]: null,
            [fields.CUSIP]: null,
            [fields.tickerSymbol]: null,
            [fields.fundCode]: null,
            [fields.investmentName]: null,
            [fields.isInvestmentQDIA]: false,
            [fields.isProspectusDeliveryWith1stTransferApplicable]: false,
            [fields.isInvestmentOfComputingFundApplicable]: false,
          });
          setTouched({});
        };
        const isModalInvestment = values[fields.investmentType] === 1;
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
              <Field
                size="md"
                isRequired
                name={fields.investmentType}
                label={"Investment Type"}
                value={values[fields.investmentType]}
                disabled={isEdit && !isSave}
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
                )}
                popupContent={
                  <SearchableList
                    label="Select an Investment Type"
                    isNotTypeAhead
                    isRadio
                    selectedValue={values[fields.investmentType]}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.INVESTMENT_TYPES
                    )}
                    onSelect={onInvestmentTypeChange}
                  />
                }
                component={FieldDropSide}
                //validate={required}
              />
              {!isModalInvestment && (
                <NonModalInvestmentForm
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                  restrictionsList={restrictionsList}
                  investmentsList={investmentsList}
                />
              )}
              {isModalInvestment && (
                <ModalInvestmentForm
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                  restrictionsList={restrictionsList}
                  investmentsList={investmentsList}
                />
              )}
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddInvestmentContainer;
