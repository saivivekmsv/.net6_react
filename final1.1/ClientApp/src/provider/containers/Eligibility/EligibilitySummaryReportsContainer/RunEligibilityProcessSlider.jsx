import React, { useContext, useEffect, useState } from "react";
import { get, isEmpty } from "lodash";
import { Form, Button } from "react-bootstrap";
import { Formik, Field } from "formik";
import {
  MultiSelectDropdown,
  SearchableList,
  FieldDropSide,
  WarningModal,
} from "../../../components";
import {
  MANAGE_ELIGIBILITY_ROUTES,
  manageEligibilityFormNames,
  formFields,
  getPathWithParam,
  getFlowBasedFormValues,
  required,
  toMultiSelectValue,
  toMultiSelectValueById,
  requiredList,
} from "../../../utils";
import {
  manageEligibilityStore,
  setManagePageLevelData,
} from "../../../contexts";
import { useRouterParams, useRequest } from "../../../abstracts";
import planType from "../../../mocks/plantype.json";
import company from "../../../mocks/company.json";
import {
  getCompaniesList,
  getPlanList,
  getEmployeePlanSources,
  runEligibility,
} from "../../../services";

const initialValues = {};

const RunEligibilityProcessSlider = (props) => {
  const { onCancel, onSubmitted } = props;
  const { state, dispatch } = useContext(manageEligibilityStore);
  const { flow } = useRouterParams();
  const formName = manageEligibilityFormNames.ELIGIBILITY_PROCESS;
  const [isInnerFormDirty, setIsInnerFormDirty] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fields = formFields[formName];
  const [planList, setPlanList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const { response: companies } = useRequest({
    method: getCompaniesList,
    payload: 1, //TenantId. HardCoding should be removed
    defaultResponse: [],
  });

  useEffect(() => {
    return () => setIsInnerFormDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (values) => {
    const { history } = props;
    console.log(values);
    runEligibility(values.companyId, values.planId, values.sources)
      .then((response) => {
        // history.push(
        //   getPathWithParam({
        //     path: MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY_SUMMARY_REPORTS,
        //   })
        // );
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
        onSubmitted();
      })
      .catch((error) => {
        //Handle Error
      });
  };
  // const handleConfirmNavigationClick = () => {
  //   setModalVisible(false);
  //   setIsInnerFormDirty(false);
  // };

  const viewDirty = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          ...initialValues,
          ...getFlowBasedFormValues(get(state, formName, {}), flow),
        }}
        onSubmit={onSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({
          handleChange,
          setFieldValue,
          handleSubmit,
          values,
          dirty,
          ...rest
        }) => {
          const selectedSources = values[fields.sources];
          if (isInnerFormDirty !== dirty) {
            setIsInnerFormDirty(dirty);
          }
          return (
            <Form autoComplete="off" className="mb-20" onSubmit={handleSubmit}>
              <p className="plan-sub-heading">Run Eligibility Process</p>
              <Field
                label="Company Name"
                isRequired
                name={fields.companyName}
                value={values[fields.companyName]}
                direction="bottom"
                popupContent={
                  <SearchableList
                    label="Select Company"
                    options={
                      companies &&
                      companies.map((company, index) => ({
                        label: company.name,
                        value: index,
                      }))
                    }
                    onSelect={(value) => {
                      setFieldValue(fields.companyName, companies[value].name);
                      setFieldValue(fields.companyId, companies[value].id);
                      setFieldValue(fields.planName, null);
                      setFieldValue(fields.planId, null);
                      setFieldValue(fields.sources, []);
                      getPlanList(companies[value].id)
                        .then((response) => {
                          setPlanList(response);
                        })
                        .catch((error) => {
                          //Handle Error
                        });
                    }}
                    selectedValue={values[fields.companyName]}
                  />
                }
                validate={required}
                component={FieldDropSide}
              />
              <Field
                label="Plan name"
                name={fields.planName}
                value={values[fields.planName]}
                direction="bottom"
                isRequired
                popupContent={
                  <SearchableList
                    label="Select Plan name"
                    options={
                      planList &&
                      planList.map((plan, index) => ({
                        label: plan.name,
                        value: index,
                      }))
                    }
                    onSelect={(value) => {
                      setFieldValue(fields.planName, planList[value].name);
                      setFieldValue(fields.planId, planList[value].id);
                      setFieldValue(fields.sources, []);
                      getEmployeePlanSources({
                        companyId: values[fields.companyId],
                        planId: planList[value].id,
                      })
                        .then((response) => {
                          setSourceList(
                            response.map((source, index) => ({
                              label: source.name,
                              value: source.id,
                            }))
                          ); //Change
                        })
                        .catch((error) => {
                          //Handle Error
                        });
                    }}
                    selectedValue={values[fields.planName]}
                  />
                }
                validate={required}
                component={FieldDropSide}
              />
              <Field
                size="md"
                label="Sources"
                name={fields.sources}
                isRequired
                value={toMultiSelectValueById(selectedSources, sourceList)}
                isMultiSelect
                direction="bottom"
                popupContent={
                  <MultiSelectDropdown
                    label="Select Sources"
                    options={sourceList}
                    onSelect={(value) => setFieldValue(fields.sources, value)}
                    value={values[fields.sources]}
                  />
                }
                validate={requiredList}
                component={FieldDropSide}
              />
              <Button
                variant="secondary"
                onClick={dirty ? viewDirty : onCancel}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button type="submit">Run Eligibility</Button>
            </Form>
          );
        }}
      </Formik>
      <WarningModal show={modalVisible} onHide={closeModal}>
        <div className="remove-text">
          <h4>Are you sure?</h4>
          <p>Your changes may be lost. Do you want to continue ?</p>
          <Button className="remove-btn mr-4" onClick={onCancel}>
            Yes
          </Button>
          <Button className="cancel-btn" onClick={closeModal}>
            No
          </Button>
        </div>
      </WarningModal>
    </>
  );
};

export default RunEligibilityProcessSlider;
