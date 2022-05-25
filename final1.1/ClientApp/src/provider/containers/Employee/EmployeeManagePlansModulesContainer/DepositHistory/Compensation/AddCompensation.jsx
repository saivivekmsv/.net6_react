import React, { useContext, useEffect, useState } from "react";
import { isEmpty, get } from "lodash";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";

import {
  FieldDropSide,
  DatePicker,
  FieldInputDollar,
  FieldTextarea,
  FormLeaveGuard,
  FieldButtonGroup,
  Dropside,
  MultiSelectDropdown,
  FormControlSearch,
  Link,
  DropDownFilterCell,
} from "../../../../../components";
import {
  manageCensusFormNames,
  formFields,
  getFlowBasedFormValues,
  usDateFormat,
  yesNoOptions,
  censusFormFields,
  toMultiSelectValueById,
  required,
  toMultiSelectValue,
} from "../../../../../utils";
import {
  useRouterParams,
  useRequest,
  useDeepEffect,
} from "../../../../../abstracts";
import {
  manageCensusStore,
  setManagePageLevelData,
} from "../../../../../contexts";
import { Formik, Field } from "formik";
import {
  addEmployeeCompensation,
  getEmployerSources,
} from "../../../../../services";
import {
  faExclamationTriangle,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const initialValues = {
  acceptWarning: false,
};

const AddCompensations = (props) => {
  const {
    toggleCompensationForm,
    isInnerFormDirty,
    setIsInnerFormDirty,
    setToggle,
    toggle,
    formValues,
    setFormvalues,
    isEdit,
    isView,
    setIsView,
  } = props;
  const { flow, planId, censusId } = useRouterParams();
  const { state, dispatch } = useContext(manageCensusStore);
  const [showDirtyCheckModal, setShowDirtyCheckModal] = useState(false);
  const formName = manageCensusFormNames.ADD_COMPENSATIONS;
  const fields = formFields[formName];
  const [tags, setTags] = useState([]);
  const [
    sourceCompensationFieldError,
    setSourceCompensationFieldError,
  ] = useState("");
  const [selectedCompensation, setSelectedCompensation] = useState("");
  const [searchCompensation, setSearchCompensation] = useState("");
  const [transformedValues, setTransformedValues] = useState([]);
  // const isAllSelected = filteredValues.length;
  const [trigger, setTrigger] = useState(true);
  const [dropDownValues, setdropDownValues] = useState([]);
  const [filteredValues, setFilteredValues] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [warning, setWarning] = useState([]);
  useDeepEffect(() => {
    getEmployerSources(planId).then((response) => {
      setdropDownValues(
        response &&
          response.map((val) => ({
            label: val.name,
            value: val.id,
          }))
      );
      setFilteredValues(
        response &&
          response.map((val) => ({
            label: val.name,
            value: val.id,
          }))
      );
    });
  }, []);

  const onSelectAllClick = () => {
    setTransformedValues(
      transformedValues.map((item) => ({
        ...item,
        // checked: isAllSelected ? false : true,
      }))
    );
    //const allSelectedOptions = isAllSelected ? [] : filteredValues;
    //setSelectedOptions(allSelectedOptions);
    selectedCompensation.length > 0
      ? setSelectedCompensation([])
      : setSelectedCompensation(filteredValues);

    // onSelect(allSelectedOptions.map(({ label }) => label));
  };

  // const { response: dropDownValues } = useRequest({
  //   method: getEmployerSources,
  //   payload: planId,
  //   defaultResponse: [],
  // });

  //console.log(dropDownValues);
  console.log(formValues, "afv");
  useEffect(() => {
    return () => setIsInnerFormDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFormSubmit = (values, { setFieldError }) => {
    if (values.payDate === "") delete values.payDate;
    if (isEdit) values.acceptWarning = true;
    console.log(values);
    addEmployeeCompensation({
      ...values,
      planId: parseInt(planId),
      employeeId: parseInt(censusId),
      payPeriodGrossCompensation: parseFloat(values.payPeriodGrossCompensation),
      payPeriodPlanCompensation: parseFloat(values.payPeriodPlanCompensation),
      annualSalary: parseFloat(values.annualSalary),
    })
      .then((response) => {
        if (response.isSuccessfull) {
          dispatch(
            setManagePageLevelData({
              formName: formName,
              fieldData: values,
            })
          );
          toggleCompensationForm();
          setToggle(!toggle);
        } else {
          for (const error of response.errorMessages) {
            var errlen = response.errorMessages.filter(
              (x) => x.errorType === "IsError"
            ).length;
            if (errlen === 0 && response.errorMessages.length - errlen !== 0) {
              console.log(errlen);
              setWarning(error.message);
              setisModalOpen(true);
            }
            if (error.controlName === "eligibleSources") {
              setSourceCompensationFieldError(error.message);
            } else setSourceCompensationFieldError("");
            console.log(error.message);
            setFieldError(error.controlName, error.message);
          }
        }
      })
      .catch((error) => {
        //Handle Error
      });
  };

  const onFormToggle = () => {
    if (isInnerFormDirty) {
      setShowDirtyCheckModal(true);
    } else {
      toggleCompensationForm();
    }
    setFormvalues({});
    setIsView(false);
  };
  const handleConfirmClick = () => {
    toggleCompensationForm();
  };

  const handleCancelClick = () => {
    setShowDirtyCheckModal(false);
  };
  const handleClose = () => {
    setisModalOpen(false);
  };

  console.log(isEdit, isView);

  return (
    <>
      <Formik
        initialValues={{
          ...initialValues,
          //[fields.eligiblePlanCompensation]: false,
          ...get(state, formName, {}),
          ...formValues,
          [fields.eligiblePlanCompensation]:
            formValues.eligiblePlanCompensation === "Yes" ? true : false,
          [fields.eligibleSources]: isEmpty(formValues.eligibleSources)
            ? null
            : formValues.eligibleSources?.map((val, ind) => val.id),
        }}
        onSubmit={onFormSubmit}
        enableReinitialize
      >
        {({
          handleChange,
          setFieldValue,
          handleSubmit,
          values,
          dirty,
          ...rest
        }) => {
          const onDaySelected = (fieldName, value) => {
            setFieldValue(fieldName, value);
          };
          const selectedSources = values[fields.eligibleSources];
          if (isInnerFormDirty !== dirty) {
            setIsInnerFormDirty(dirty);
          }
          const onDeleteConfirmClick = () => {
            values.acceptWarning = true;
            setisModalOpen(false);
          };
          console.log(values, "v");
          return (
            <Form
              autoComplete="off"
              className="h-100"
              onSubmit={handleSubmit}
              validated={!isEmpty(rest.errors)}
            >
              <div
                style={{
                  display: "flex",
                  height: "50px",
                  alignItems: "center",
                }}
              >
                <div
                  className="plan-sub-heading"
                  style={{ paddingRight: "20rem", fontSize: "20px" }}
                >
                  Add Compensation
                </div>
              </div>
              <hr />
              <Field
                isRequired
                size="smd"
                label="Pay date"
                name={fields.payDate}
                value={usDateFormat(values[fields.payDate])}
                isDatePicker
                onClear={() => onDaySelected(fields.payDate, "")}
                popupContent={
                  <DatePicker
                    onDayClick={(value) => onDaySelected(fields.payDate, value)}
                    value={values[fields.payDate]}
                  />
                }
                component={FieldDropSide}
                disabled={isEdit}
              />
              <Field
                isRequired
                name={fields.payPeriodPlanCompensation}
                label={"Plan Compensation"}
                type="text"
                autoComplete="off"
                value={values[fields.payPeriodPlanCompensation]}
                onChange={handleChange}
                component={FieldInputDollar}
                disabled={isEdit}
              />
              <Field
                name={fields.payPeriodGrossCompensation}
                label={"Gross Compensation"}
                isRequired
                type="text"
                autoComplete="off"
                value={values[fields.payPeriodGrossCompensation]}
                onChange={handleChange}
                component={FieldInputDollar}
                disabled={isEdit}
              />
              <Field
                name={fields.annualSalary}
                label={"Annual Salary"}
                isRequired
                type="text"
                autoComplete="off"
                value={values[fields.annualSalary]}
                onChange={handleChange}
                component={FieldInputDollar}
                disabled={isEdit}
              />
              <Field
                isRequired
                name={fields.eligiblePlanCompensation}
                label="Eligible Plan Compensation"
                options={yesNoOptions}
                value={false}
                selectedValue={values[fields.eligiblePlanCompensation]}
                onChange={(value) => {
                  setFieldValue(fields.eligiblePlanCompensation, value);
                }}
                disabled={isEdit && isView}
                component={FieldButtonGroup}
                size="sm"
              />
              {values[fields.eligiblePlanCompensation] == true && (
                <div className="mb-14 h-70">
                  <div className="mb-5 ft-12 lh-18">Source Compensation</div>
                  <div className="w-238" style={{ marginTop: "-35px" }}>
                    <Dropside
                      size="xs"
                      direction="right"
                      // name={"planStatus"}
                      name={fields.eligibleSources}
                      label={"Type"}
                      placeholder={"0 selected"}
                      //options={searchResult}
                      options={filteredValues}
                      value={toMultiSelectValueById(
                        selectedSources,
                        filteredValues
                      )}
                      isMultiSelect
                      disabled={isEdit && isView}
                      popupContent={
                        <div>
                          <div className="search-bar">
                            <Form>
                              <InputGroup>
                                <InputGroup.Prepend>
                                  <div className="search-icon-postion">
                                    <i
                                      class="fal fa-search"
                                      aria-hidden="true"
                                    ></i>
                                  </div>
                                </InputGroup.Prepend>
                                <FormControlSearch
                                  size="md"
                                  type="search"
                                  className="plan-search-box pad-left-search"
                                  placeholder="Search"
                                  onChange={(e) => {
                                    // console.log(dropDownValues.filter(x => x.label.includes(e.target.value)));
                                    setFilteredValues(
                                      dropDownValues.filter((x) =>
                                        x.label
                                          .toLowerCase()
                                          .includes(
                                            e.target.value.toLowerCase()
                                          )
                                      )
                                    );
                                    setTrigger(!trigger);
                                  }}
                                />
                              </InputGroup>
                            </Form>
                          </div>
                          <div className="flex-space mt-50">
                            <div className="selectall">
                              <Link
                                style={{ color: "#2F80ED" }}
                                onClick={() => {
                                  setFieldValue(
                                    fields.eligibleSources,
                                    dropDownValues.map((_) => _.value)
                                  );
                                  setTrigger(!trigger);
                                }}
                              >
                                Select All
                              </Link>{" "}
                            </div>
                            <div className="clearall">
                              <Link
                                style={{ color: "#2F80ED" }}
                                onClick={() => {
                                  setFieldValue(fields.eligibleSources, []);
                                  setTrigger(!trigger);
                                }}
                              >
                                Clear
                              </Link>
                            </div>
                          </div>
                          <MultiSelectDropdown
                            trigger={trigger}
                            options={filteredValues}
                            width="320px"
                            maxHeight="350px"
                            height="180px"
                            hideSelectAll={false}
                            onSelect={(value) =>
                              setFieldValue(fields.eligibleSources, value)
                            }
                            value={selectedSources}
                          />
                        </div>
                      }
                    />
                  </div>
                </div>
              )}
              {values[fields.eligiblePlanCompensation] == true && (
                <div>
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {sourceCompensationFieldError}
                  </p>
                </div>
              )}
              <Field
                name={fields.comments}
                label="Comments"
                autoComplete="off"
                value={values[fields.comments]}
                onChange={handleChange}
                component={FieldTextarea}
                size="md"
                disabled={isEdit}
              />
              {(!isEdit && !isView) || (isEdit && !isView) ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onFormToggle}
                    style={{ marginRight: "15px" }}
                  >
                    Cancel
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    style={{ padding: "0 15px" }}
                  >
                    Save
                  </Button>
                </>
              ) : (
                // isEdit && isView ?
                // (
                <>
                  <Button
                    onClick={() => setIsView(false)}
                    style={{ padding: "0 15px" }}
                  >
                    Edit
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onFormToggle}
                    style={{ marginRight: "15px" }}
                  >
                    Cancel
                  </Button>
                </>
                //   ):
                //   (
                //   <>
                //   <Button type="button" variant="secondary" onClick={onFormToggle} style={{marginRight:"15px"}}>
                //   Cancel
                // </Button>
                // &nbsp;&nbsp;&nbsp;
                // <Button type="submit" onClick={handleSubmit} style={{padding:"0 15px",}}>
                //   save
                // </Button>
                // </>
                //   )
              )}
              <br />
              <br />

              <FormLeaveGuard
                showModal={showDirtyCheckModal}
                handleConfirmClick={handleConfirmClick}
                handleCancelClick={handleCancelClick}
              />
              <Modal show={isModalOpen} onHide={handleClose}>
                <Modal.Body style={{ borderTop: "5px solid #f94f50" }}>
                  <div className="text-right">
                    <FontAwesomeIcon
                      icon={faTimes}
                      color="#000"
                      onClick={handleClose}
                    />
                  </div>
                  <div className="d-flex">
                    <div className="pd-15">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        color="#f94f50"
                        size="3x"
                      />
                    </div>
                    <div className="remove-text">
                      <h4>Accept Warning ?</h4>
                      <p>{warning}</p>
                      <br />
                      <Button
                        className="remove-btn mr-4"
                        onClick={onDeleteConfirmClick}
                      >
                        Ok
                      </Button>
                      <Button className="cancel-btn" onClick={handleClose}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AddCompensations;
