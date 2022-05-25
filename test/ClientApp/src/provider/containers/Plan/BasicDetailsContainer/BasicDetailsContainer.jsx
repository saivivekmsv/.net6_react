import React, { useContext, useState } from "react";
import { get, isEmpty, trim } from "lodash";
import { Row, Col, Form, Button } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Field, Formik } from "formik";
import {
  ManagePlanLayout,
  SearchableList,
  DayDropdown,
  DatePicker,
  FieldInput,
  SliderPanel,
  FieldDropSide,
  FieldButtonGroup,
  FieldInputNumber,
} from "../../../components";
import {
  ROUTES,
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  usDateFormat,
  required,
  getPlanBasicDetailsHeader,
  yesNoOptions,
  errors,
  FORM_PLACEHOLDERS,
  getFormattedPhone,
  stripHyphenForApi,
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
import months from "../../../mocks/months.json";
import ViewAssociatedMEPsTable from "./ViewAssociatedMEPsTable/ViewAssociatedMEPsTable";
import PlanGroupInformation from "./PlanGroupInformation";
import AddToolTip from "../../../components/AddToolTip";

const BasicDetailsContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showSilder, setShowSlider] = useState(false);
  const [newFlow] = useState("");
  const { planId, flow } = useRouterParams();
  const intPlanId = parseInt(planId);
  const [sidePanelData, setSidePanelData] = useState({});
  const formValues = get(state, "api.data", {});
  const formName = managePlanFormNames.BASIC_DETAILS_MANAGE_PLAN;
  const fields = formFields[formName];
  const planGroupMappings = get(state, "api.data.planGroupMappings", {});
  const [savedPlanGroups, setsavedPlanGroups] = useState([]);

  const buttons = [
    {
      link: ROUTES.PLAN,
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
      link: ROUTES.PLAN,
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
            path: MANAGE_PLAN_ROUTES.BASIC_DETAILS,
            pathParam: [FLOW_TYPES.SAVE, intPlanId],
          })
        ),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    const { history } = props;
    const {
      yearStartMonth,
      yearStartDate,
      yearEndMonth,
      yearEndDate,
      mobilePhoneNumber,
      workPhoneNumber,
      email,
      website,
      name,
      irsPlanNumber,
      trsContractId,
      effectiveDate,
      planTerminationDate,
      shortYearEndDate,
      shortYearStartDate,
      shortYearIndicator,
      plan_PlanGroupMappings,
      ...rest
    } = values;
    const startDate = {
      month: yearStartMonth,
      day: yearStartDate,
    };
    const endDate = {
      month: yearEndMonth,
      day: yearEndDate,
    };
    const basicPlanDetails = {
      startDate: startDate,
      endDate: endDate,
      irsPlanNumber: irsPlanNumber,
      trsContractId: trsContractId,
      effectiveDate: effectiveDate,
      planTerminationDate: planTerminationDate,
      shortYearIndicator: shortYearIndicator,
      shortYearStartDate: shortYearStartDate,
      shortYearEndDate: shortYearEndDate,
    };
    const planAdministrator = {
      name,
      contact: {
        mobilePhoneNumber: mobilePhoneNumber,
        workPhoneNumber: workPhoneNumber,
        email: email,
        website: website,
      },
    };
    const planGroupMappings = savedPlanGroups.map((item) => {
      let savedPlanGroupsMappings = {
        id: item.mapId ? item.mapId : 0,
        planId: intPlanId,
        planGroupId: item.id,
      };
      return savedPlanGroupsMappings;
    });

    savePlanDetailsAction(
      {
        ...rest,
        basicPlanDetails,
        planAdministrator,
        irsPlanNumber: irsPlanNumber || null,
        trsContractId: trsContractId || null,
        planGroupMappings,
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
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.BASIC_DETAILS,
            pathParam: [FLOW_TYPES.EDIT, newPlanId],
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

  const onViewButtonClick = (data) => {
    setSidePanelData(data);
    setModalOpen(true);
  };

  const createPlanFormValues = get(
    state,
    managePlanFormNames.BASIC_DETAILS_MANAGE_PLAN,
    {}
  );
  const headerDetails = getPlanBasicDetailsHeader(formValues);
  const getPlanBasicDetails = (values) => {
    return {
      yearStartMonth: get(values, "basicPlanDetails.startDate.month", 1),
      yearStartDate: get(values, "basicPlanDetails.startDate.day", 1),
      yearEndMonth: get(values, "basicPlanDetails.endDate.month", 12),
      yearEndDate: get(values, "basicPlanDetails.endDate.day", 31),
      irsPlanNumber: get(values, "basicPlanDetails.irsPlanNumber", null),
      trsContractId: get(values, "basicPlanDetails.trsContractId", null),
      effectiveDate: get(values, "basicPlanDetails.effectiveDate", null),
      planTerminationDate: get(
        values,
        "basicPlanDetails.planTerminationDate",
        null
      ),
      shortYearIndicator: get(
        values,
        "basicPlanDetails.shortYearIndicator",
        false
      ),
      shortYearStartDate: get(
        values,
        "basicPlanDetails.shortYearStartDate",
        null
      ),
      shortYearEndDate: get(values, "basicPlanDetails.shortYearEndDate", null),
    };
  };
  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;

  return (
    <Formik
      initialValues={{
        ...formValues,
        ...createPlanFormValues,
        ...getPlanBasicDetails(formValues),
        planName: get(createPlanFormValues, "planName"),
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };
        const calculateEndDate = (startMonth, startDate) => {
          startDate =
            startDate > 28
              ? startMonth === 2
                ? 28
                : startDate === 31
                ? startMonth < 8
                  ? startMonth % 2 !== 0
                    ? 31
                    : 30
                  : startMonth % 2 === 0
                  ? 31
                  : 30
                : startDate
              : startDate;
          setFieldValue(fields.yearStartDate, startDate);
          setFieldValue(
            fields.yearEndMonth,
            startDate === 1
              ? startMonth === 1
                ? startMonth + 11
                : startMonth - 1
              : startMonth
          );
          setFieldValue(
            fields.yearEndDate,
            startDate === 1
              ? startMonth <= 8
                ? startMonth % 2 === 0
                  ? 31
                  : startMonth === 3
                  ? 28
                  : startMonth === 1
                  ? 31
                  : 30
                : startMonth % 2 !== 0
                ? 31
                : 30
              : startDate - 1
          );
        };
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              {!isEmpty(headerDetails) && [
                <div className="d-flex">
                  <div className="d-flex basic-plan-details">
                    {headerDetails.map((item) => (
                      <div key={item.label} className="data-item">
                        <div className="label">{item.label}</div>
                        <div className="value" style={{ maxWidth: "200px" }}>
                          {item.label == "Company" ? (
                            <AddToolTip name={item.value ?? "-"}></AddToolTip>
                          ) : (
                            item.value ?? "-"
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-50 text-right">
                    {headerDetails.map((item) => (
                      <>
                        {item.value === "Master" ? (
                          <span
                            onClick={onViewButtonClick}
                            className="link-text font-weight-500"
                          >
                            View Associated MEPs/PEPs
                          </span>
                        ) : item.value === "Adopting Employer" ? (
                          <span
                            onClick={onViewButtonClick}
                            className="link-text font-weight-500"
                          >
                            View Master MEPs/PEP
                          </span>
                        ) : null}
                        <SliderPanel
                          isOpen={isModalOpen}
                          size="50"
                          onClose={() => setModalOpen(false)}
                        >
                          <ViewAssociatedMEPsTable data={sidePanelData} />
                        </SliderPanel>
                      </>
                    ))}
                  </div>
                </div>,
              ]}
              <br />
              <Field
                isRequired
                name={fields.planName}
                label={"Plan name"}
                suggestionDefaultText="Suggest a valid name"
                type="text"
                placeholder="Plan name"
                autoComplete="off"
                value={values[fields.planName]}
                onChange={handleChange}
                component={FieldInput}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                name={fields.rkPlanNumber}
                label={"Plan ID (record keeping plan number)"}
                placeholder="Plan ID"
                type="text"
                autoComplete="none"
                value={values[fields.rkPlanNumber]}
                onChange={handleChange}
                component={FieldInput}
                noLabelTransform
                disabled={isEdit && !isSave}
              />

              <Row>
                <Col md="2">
                  <Field
                    isRequired
                    name={fields.yearStartMonth}
                    label="Plan-Year Start"
                    {...rest}
                    size="sm"
                    placeholder="Month"
                    value={values[fields.yearStartMonth]}
                    options={months.data}
                    disabled={isEdit && !isSave}
                    popupContent={
                      <SearchableList
                        label="Select a month"
                        isNotTypeAhead
                        options={months.data}
                        onSelect={(value) => {
                          setFieldValue(fields.yearStartMonth, value);
                          calculateEndDate(value, values[fields.yearStartDate]);
                        }}
                        selectedValue={values[fields.yearStartMonth]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </Col>
                <Col md="2">
                  <Field
                    name={fields.yearStartDate}
                    label=" "
                    {...rest}
                    size="xs"
                    placeholder="Date"
                    value={values[fields.yearStartDate]}
                    disabled={isEdit && !isSave}
                    popupContent={
                      <DayDropdown
                        fromMonthDate={
                          new Date(2019, values[fields.yearStartMonth] - 1 || 0)
                        }
                        onSelect={(value) => {
                          setFieldValue(fields.yearStartDate, value);
                          calculateEndDate(
                            values[fields.yearStartMonth],
                            value
                          );
                        }}
                        value={values[fields.yearStartDate]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="2">
                  <Field
                    isRequired
                    name={fields.yearEndMonth}
                    label="Plan-Year End"
                    {...rest}
                    size="sm"
                    placeholder="Month"
                    value={values[fields.yearEndMonth]}
                    options={months.data}
                    autoComplete="on"
                    disabled={true}
                    component={FieldDropSide}
                  />
                </Col>
                <Col md="2">
                  <Field
                    name={fields.yearEndDate}
                    label=" "
                    {...rest}
                    size="xs"
                    placeholder="Date"
                    value={values[fields.yearEndDate]}
                    disabled={true}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    name={fields.effectiveDate}
                    isRequired
                    label="Plan Effective Date"
                    {...rest}
                    value={usDateFormat(values[fields.effectiveDate])}
                    disabled={isEdit && !isSave}
                    isDatePicker
                    onClear={() => setFieldValue(fields.effectiveDate, null)}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.effectiveDate, value)
                        }
                        value={values[fields.effectiveDate]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    name={fields.planTerminationDate}
                    label="Plan Termination Date"
                    {...rest}
                    value={usDateFormat(values[fields.planTerminationDate])}
                    disabled={isEdit && !isSave}
                    isDatePicker
                    onClear={() =>
                      setFieldValue(fields.planTerminationDate, null)
                    }
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.planTerminationDate, value)
                        }
                        value={values[fields.planTerminationDate]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    isRequired
                    name={fields.shortYearIndicator}
                    label="Is the first year a short-year?"
                    {...rest}
                    size="sm"
                    options={yesNoOptions}
                    selectedValue={values[fields.shortYearIndicator]}
                    onChange={(value) => {
                      setFieldValue(fields.shortYearIndicator, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  />
                </Col>
              </Row>
              {values[fields.shortYearIndicator] == true ? (
                <>
                  <Row>
                    <Col md="4">
                      <Field
                        isRequired
                        name={fields.shortYearStartDate}
                        label="Short-year Start"
                        {...rest}
                        value={usDateFormat(values[fields.shortYearStartDate])}
                        disabled={isEdit && !isSave}
                        isDatePicker
                        onClear={() =>
                          setFieldValue(fields.shortYearStartDate, null)
                        }
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.shortYearStartDate, value)
                            }
                            value={values[fields.shortYearStartDate]}
                          />
                        }
                        component={FieldDropSide}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <Field
                        isRequired
                        name={fields.shortYearEndDate}
                        label="Short-year End"
                        {...rest}
                        value={usDateFormat(values[fields.shortYearEndDate])}
                        disabled={isEdit && !isSave}
                        isDatePicker
                        onClear={() =>
                          setFieldValue(fields.shortYearEndDate, null)
                        }
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.shortYearEndDate, value)
                            }
                            value={values[fields.shortYearEndDate]}
                          />
                        }
                        component={FieldDropSide}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
              <div className="line-separator"></div>

              <Row>
                <Col md="2">
                  <Field
                    label="IRS Plan number"
                    name={fields.irsPlanNumber}
                    {...rest}
                    autoComplete="off"
                    value={values[fields.irsPlanNumber]}
                    onChange={handleChange}
                    noLabelTransform={true}
                    disabled={isEdit && !isSave}
                    className="w-100"
                    component={FieldInput}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    label="Contract Number"
                    name={fields.trsContractId}
                    {...rest}
                    type="text"
                    autoComplete="off"
                    value={values[fields.trsContractId]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />
                </Col>
              </Row>
              <div className="line-separator"></div>

              <p>Plan Administrator</p>

              <Row>
                <Col>
                  <Field
                    label="Name"
                    name={fields.name}
                    {...rest}
                    type="text"
                    autoComplete="off"
                    value={values[fields.name]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    label="Phone Number"
                    name={fields.mobilePhoneNumber}
                    {...rest}
                    type="text"
                    autoComplete="off"
                    value={getFormattedPhone(values[fields.mobilePhoneNumber])}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                    placeholder={FORM_PLACEHOLDERS.phone}
                    maxLength="12"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    label="E Mail"
                    name={fields.email}
                    {...rest}
                    type="text"
                    autoComplete="off"
                    value={values[fields.email]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />
                </Col>
              </Row>

              <>&nbsp;</>

              <p className="font-weight-500 black-33">Plan Group </p>
              <div>
                <PlanGroupInformation
                  planGroupMappings={planGroupMappings}
                  isEdit={isEdit}
                  isSave={isSave}
                  savedPlanGroups={savedPlanGroups}
                  setsavedPlanGroups={setsavedPlanGroups}
                />
              </div>
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BasicDetailsContainer;
