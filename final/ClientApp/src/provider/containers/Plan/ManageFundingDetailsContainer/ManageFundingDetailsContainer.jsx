import React, { useContext, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Formik, Field } from "formik";
import {
  faPencilAlt,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { find, get, isEmpty } from "lodash";
import {
  ManagePlanLayout,
  FieldInput,
  FieldButtonGroup,
  FieldInputNumber,
  FieldInputSSN,
} from "../../../components";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  managePlanFormNames,
  formFields,
  yesNoOptions,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  bankAccountNumberNormalizer,
  maskedBankAccountNumberNormalizer,
  abaRoutingNumber,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  setManagePageLevelData,
  savePlanDetailsAction,
} from "../../../contexts";
import { useRouterParams } from "../../../abstracts";

const ManageFundingDetailsContainer = (props) => {
  const { history } = props;
  const { flow, planId, fundId } = useRouterParams();
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow, setNewFlow] = useState(fundId ? FLOW_TYPES.EDIT : "");
  const formName = managePlanFormNames.FUNDING_DETAIL;
  const fields = formFields[formName];
  const fundingsData = get(state, "api.data.fundings", []);
  const intFundId = parseInt(fundId, 10);
  const formValues = find(fundingsData, {
    id: intFundId,
  });
  const initialValues = {
    [fields.bankAccountStatus]: 1,
    [fields.defaultBankAccountIndicator]: false,
  };
  const goBack = () => {
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_FUNDING,
        pathParam: planId,
      })
    );
  };

  const onDeleteClick = ({ setFieldError, setFieldTouched }) => {
    savePlanDetailsAction(
      {
        fundings: fundingsData.filter((item, index) => item.id != intFundId),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: `Funding deleted successfully`,
          })
        );
        goBack();
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
      onClick: goBack,
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
      onClick: goBack,
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
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTrashAlt,
      onClick: onDeleteClick,
    },
  ];
  // [
  //   ...fundingsData,
  //   {
  //     ...values,
  //     bankAccountNumber: get(values, "bankAccountNumber", "").replace(
  //       /\s/g,
  //       ""
  //     ),
  //     abaRoutingNumber: get(values, "abaRoutingNumber", "").replace(
  //       /\s/g,
  //       ""
  //     ),
  //   },
  // ],
  const getDataForSave = (values) => {
    if (isEmpty(formValues)) {
      return [
        ...fundingsData,
        {
          ...values,
          bankAccountNumber: get(values, "bankAccountNumber", "").replace(
            /\s/g,
            ""
          ),
          abaRoutingNumber: get(values, "abaRoutingNumber", "").replace(
            /\s/g,
            ""
          ),
        },
      ];
    }

    return fundingsData.map((item) => {
      if (item.id === intFundId) {
        return {
          ...item,
          ...values,
          bankAccountNumber: get(values, "bankAccountNumber", null).replace(
            /\s/g,
            ""
          ),
          abaRoutingNumber: get(values, "abaRoutingNumber", null).replace(
            /\s/g,
            ""
          ),
        };
      }
      return item;
    });
  };
  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    savePlanDetailsAction(
      {
        fundings: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_FUNDING,
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
  const layoutHeader = fundId && "Funding";
  const accountNumberFormatter =
    newFlow === FLOW_TYPES.EDIT
      ? maskedBankAccountNumberNormalizer
      : bankAccountNumberNormalizer;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formProps) => {
        const {
          setFieldValue,
          values,
          handleChange,
          handleSubmit,
          setValues,
          ...rest
        } = formProps;

        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={rest.submitCount > 0}
          >
            <ManagePlanLayout
              layoutHeader={layoutHeader}
              buttons={buttons}
              pageFlow={newFlow || flow}
            >
              <Row>
                <Col>
                  <Field
                    label="Bank Name"
                    name={fields.bankAccountName}
                    type="text"
                    autoComplete="off"
                    value={values[fields.bankAccountName]}
                    onChange={handleChange}
                    component={FieldInput}
                    disabled={isEdit && !isSave}
                    size="lg"
                    isRequired
                  />
                  <Field
                    label="Bank Account Number"
                    name={fields.bankAccountNumber}
                    type="text"
                    autoComplete="off"
                    value={accountNumberFormatter(
                      values[fields.bankAccountNumber]
                    )}
                    pattern="[0-9 ]+"
                    onChange={handleChange}
                    component={FieldInput}
                    disabled={isEdit && !isSave}
                    size="lg"
                    maxLength={36}
                    isRequired
                  />
                  <Field
                    label="ABA Routing Number"
                    name={fields.abaRoutingNumber}
                    type="text"
                    autoComplete="off"
                    value={abaRoutingNumber(values[fields.abaRoutingNumber])}
                    onChange={handleChange}
                    component={FieldInput}
                    disabled={isEdit && !isSave}
                    size="lg"
                    maxLength={10}
                    isRequired
                  />
                  <Field
                    label="Bank Account Type"
                    name={fields.bankAccountType}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.ACCOUNT_TYPE
                    )}
                    selectedValue={values[fields.bankAccountType]}
                    onChange={(value) => {
                      setFieldValue(fields.bankAccountType, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                    size="smd"
                    isRequired
                  />
                  <Field
                    label="Bank Account Status"
                    name={fields.bankAccountStatus}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.ACCOUNT_STATUS
                    )}
                    component={FieldButtonGroup}
                    selectedValue={values[fields.bankAccountStatus]}
                    onChange={(value) => {
                      setFieldValue(fields.bankAccountStatus, value);
                    }}
                    disabled={isEdit && !isSave}
                    size="smd"
                    isRequired
                  />
                  <Field
                    label="Is this the default Bank Account?"
                    name={fields.defaultBankAccountIndicator}
                    options={yesNoOptions}
                    component={FieldButtonGroup}
                    selectedValue={values[fields.defaultBankAccountIndicator]}
                    onChange={(value) => {
                      setFieldValue(fields.defaultBankAccountIndicator, value);
                    }}
                    disabled={isEdit && !isSave}
                    size="sm"
                    isRequired
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

export default ManageFundingDetailsContainer;
