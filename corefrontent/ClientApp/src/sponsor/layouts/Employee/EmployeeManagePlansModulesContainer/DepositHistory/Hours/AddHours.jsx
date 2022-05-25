import React, { useContext, useEffect, useState } from "react";
import { isEmpty, get } from "lodash";
import { Button, Form, Modal } from "react-bootstrap";
import {
  FieldDropSide,
  DatePicker,
  FieldTextarea,
  FormLeaveGuard,
  FieldInputNumber,
  NotificationPopUp,
} from "shared/components";
import {
  manageCensusFormNames,
  formFields,
  getFlowBasedFormValues,
  usDateFormat,
} from "shared/utils"
import {
  manageCensusStore,
  setManagePageLevelData,
} from "sponsor/contexts";
import {
  faExclamationTriangle,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import { useRouterParams } from "shared/abstracts";
import { addHoursDetail } from "sponsor/services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const initialValues = {
  acceptWarning: false,
};

const AddHours = (props) => {
  const {
    toggleHoursForm,
    isInnerFormDirty,
    setIsInnerFormDirty,
    setToggle,
    toggle,
  } = props;
  const { flow, planId, censusId } = useRouterParams();
  const { state, dispatch } = useContext(manageCensusStore);
  const [showDirtyCheckModal, setShowDirtyCheckModal] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [warning, setWarning] = useState([]);
  const formName = manageCensusFormNames.HOURS;
  const fields = formFields[formName];
  useEffect(() => {
    return () => setIsInnerFormDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFormSubmit = (values, { setFieldError }) => {
    addHoursDetail({
      ...values,
      // planId: parseInt(planId),
      employeeId: parseInt(censusId),
      hours: parseInt(values[fields.hours]),
    })
      .then((response) => {
        console.log(response);
        if (response.isSuccessfull) {
          dispatch(
            setManagePageLevelData({
              formName: formName,
              fieldData: values,
            })
          );
          toggleHoursForm();
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
            setFieldError(error.controlName, error.message);
          }
        }
      })
      .catch((error) => {
        //Handle Errors
      });
  };

  const onFormToggle = () => {
    if (isInnerFormDirty) {
      setShowDirtyCheckModal(true);
    } else {
      toggleHoursForm();
    }
    //setisModalOpen(true)
  };
  const handleConfirmClick = () => {
    toggleHoursForm();
  };

  const handleCancelClick = () => {
    setShowDirtyCheckModal(false);
  };

  const handleClose = () => {
    setisModalOpen(false);
  };

  return (
    <div className="hours-container">
      <div className="mt-10 ft-14 plan-heading mb-10 font-weight-500">
        Add Hours
      </div>

      <Formik
        initialValues={{
          ...initialValues,
          ...getFlowBasedFormValues(get(state, formName, {}), flow),
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
          const onDeleteConfirmClick = () => {
            values.acceptWarning = true;
            setisModalOpen(false);
          };
          const onDaySelected = (fieldName, value) => {
            setFieldValue(fieldName, value);
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
              <div className="d-flex">
                <Field
                  size="md"
                  label="Pay date"
                  name={fields.payDate}
                  value={usDateFormat(values[fields.payDate])}
                  onClear={() => onDaySelected(fields.payDate, "")}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(fields.payDate, value)
                      }
                    />
                  }
                  component={FieldDropSide}
                />
                &nbsp;&nbsp;&nbsp;
                <Field
                  size="xs"
                  name={fields.hours}
                  label={"Hours"}
                  type="number"
                  autoComplete="off"
                  value={values[fields.hours]}
                  onChange={handleChange}
                  component={FieldInputNumber}
                  min={0}
                  max={9999}
                />
              </div>

              <Field
                name={fields.comments}
                label="Comments"
                autoComplete="off"
                value={values[fields.comments]}
                onChange={handleChange}
                component={FieldTextarea}
                size="md"
              />
              <Button
                variant="secondary"
                className="mr-4"
                type="button"
                onClick={onFormToggle}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>
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
    </div>
  );
};

export default AddHours;
