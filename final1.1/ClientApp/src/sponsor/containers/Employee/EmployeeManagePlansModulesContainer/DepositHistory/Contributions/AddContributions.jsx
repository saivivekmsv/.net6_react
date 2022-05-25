import React, { useContext, useEffect, useState } from "react";
import { get, isEmpty, values } from "lodash";
import { Button, Form, Modal } from "react-bootstrap";
import { Formik, Field, FieldArray } from "formik";
import {
  FieldDropSide,
  DatePicker,
  FieldTextarea,
  CsplTable as Table,
  FormLeaveGuard,
  FieldInputDollar,
} from "../../../../../../shared/components";
import { useRouterParams, useRequest } from "../../../../../../shared/abstracts";
import {
  manageCensusFormNames,
  formFields,
  usDateFormat,
  getFlowBasedFormValues,
  required,
} from "../../../../../../shared/utils"
import {
  manageCensusStore,
  setManagePageLevelData,
} from "../../../../../contexts";
import {
  addEmployeeContribution,
  getEmployeePlanSources,
} from "../../../../../services"
import {
  faExclamationTriangle,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const columns = [
  {
    label: "Source",
    className: "column-contribution-source",
    columnName: "name",
  },
  {
    label: "Contribution",
    className: "column-contribution-perc",
    columnName: "contribution",
  },
];

const initialValues = {
  comments: "",
  acceptWarning: false,
};

const AddContributions = (props) => {
  const {
    toggleContributionsForm,
    isInnerFormDirty,
    setIsInnerFormDirty,
    setToggle,
    toggle,
  } = props;
  const { flow, planId, censusId } = useRouterParams();
  const { state, dispatch } = useContext(manageCensusStore);
  const [showDirtyCheckModal, setShowDirtyCheckModal] = useState(false);
  const formName = manageCensusFormNames.ADD_CONTRIBUTIONS;
  const fields = formFields[formName];
  const [fieldValues, setFieldValues] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [commonError, setCommonError] = useState([]);
  const [warning, setWarning] = useState([]);
  useEffect(() => {
    return () => setIsInnerFormDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { response: sources } = useRequest({
    method: getEmployeePlanSources,
    payload: {
      planId: planId,
      companyId: get(state, "companyId", 0),
    },
    defaultResponse: [],
  });

  const prepareData = (values) => {
    console.log(sources);
    return {
      payDate: values.payDate,
      comments: values.comments,
      acceptWarning: values.acceptWarning,
      sourceDetails: sources.map((source, index) => {
        // console.log(
        //   values.sourceContribution[index].contributionAmount,
        //   "Amount"
        // );
        return {
          id: parseInt(source.id),
          name: source.name,
          contributionAmount: isEmpty(
            values.sourceContribution && values.sourceContribution[index]
          )
            ? null
            : parseInt(values.sourceContribution[index].contributionAmount),
        };
      }),
      planId: parseInt(planId),
      employeeId: parseInt(censusId),
    };
  };

  const onSetValue = (values) => {
    setFieldValues(values);
    onFormSubmit(fieldValues);
  };

  const onFormSubmit = (values, { setFieldError }) => {
    setCommonError([]);
    addEmployeeContribution(prepareData(values))
      .then((response) => {
        if (response.isSuccessfull) {
          dispatch(
            setManagePageLevelData({
              formName: formName,
              fieldData: values,
            })
          );
          toggleContributionsForm();
          setToggle(!toggle);
        } else {
          for (const error of response.errorMessages) {
            var errlen = response.errorMessages.filter(
              (x) => x.errorType === "IsError"
            ).length;
            console.log(error.message);
            if (errlen === 0 && response.errorMessages.length - errlen !== 0) {
              setWarning((e) => [...e, error.message + ".           "]);
              setisModalOpen(true);
            }
            if (error.controlName === "commonSources") {
              setCommonError((e) => [...e, error.message + ".           "]);
            }
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
      toggleContributionsForm();
    }
  };
  const handleConfirmClick = () => {
    toggleContributionsForm();
  };

  const handleCancelClick = () => {
    setShowDirtyCheckModal(false);
  };
  const handleClose = () => {
    setisModalOpen(false);
    setWarning([]);
  };

  return (
    <>
      <Formik
        initialValues={{
          ...initialValues,
          ...getFlowBasedFormValues(get(state, formName, {}), flow),
        }}
        onSubmit={onFormSubmit}
        //enableReinitialize
      >
        {({
          handleChange,
          setFieldValue,
          handleSubmit,
          values,
          dirty,
          ...rest
        }) => {
          console.log(values, "Val are");
          const onDaySelected = (fieldName, value) => {
            setFieldValue(fieldName, value);
          };
          const onDeleteConfirmClick = () => {
            values.acceptWarning = true;
            setisModalOpen(false);
            setWarning([]);
          };
          if (isInnerFormDirty !== dirty) {
            setIsInnerFormDirty(dirty);
          }
          return (
            <Form
              autoComplete="off"
              className="h-100"
              onSubmit={handleSubmit}
              validated={!isEmpty(rest.errors)}
            >
              <div className="plan-sub-heading">Add Contribution</div>
              <Field
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
              />
              <Field
                name={fields.comments}
                label="Comments"
                autoComplete="off"
                value={values[fields.comments]}
                onChange={handleChange}
                component={FieldTextarea}
                size="md"
              />
              <br />
              <p
                style={{
                  color: "Red",
                  fontSize: "0.75rem",
                  fontFamily: "Poppins",
                  fontWeight: "400",
                }}
              >
                {commonError}
              </p>
              <div>
                <Table className="add-contributions-table">
                  <Table.Thead>
                    <Table.Tr>
                      {columns.map((item, index) => {
                        return (
                          <Table.Th key={index} className={item.className}>
                            {item.label}
                          </Table.Th>
                        );
                      })}
                    </Table.Tr>
                  </Table.Thead>
                  <FieldArray name="sourceContribution">
                    <Table.Tbody>
                      {sources.map((compensation, index) => {
                        return (
                          <Table.Tr key={index}>
                            {columns.map((item, cellIndex) => {
                              const getContent = () => {
                                if (item.columnName === "contribution") {
                                  const fieldName = `sourceContribution[${index}].contributionAmount`;
                                  return (
                                    <Field
                                      name={fieldName}
                                      type="number"
                                      autoComplete="off"
                                      value={get(values, fieldName)}
                                      onChange={(e) => {
                                        setFieldValue(
                                          fieldName,
                                          parseFloat(e.target.value)
                                        );
                                      }}
                                      component={FieldInputDollar}
                                    />
                                  );
                                }
                                return compensation[item.columnName];
                              };
                              return (
                                <Table.Td
                                  key={cellIndex}
                                  className={item.className}
                                >
                                  {getContent()}
                                </Table.Td>
                              );
                            })}
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </FieldArray>
                </Table>
              </div>
              <br />
              <Button variant="secondary" onClick={onFormToggle}>
                Cancel
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button type="submit" variant="primary">
                Save
              </Button>
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

export default AddContributions;
