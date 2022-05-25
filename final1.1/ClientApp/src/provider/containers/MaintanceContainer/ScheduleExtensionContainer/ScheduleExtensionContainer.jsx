import React, { useContext, useState } from "react";
import { isEmpty, isNull } from "lodash";
import { Form, Toast, Modal, Button } from "react-bootstrap";
import {
  ManageMaintenanceLayout,
  FieldDropSide,
  DatePicker,
} from "../../../components";
import {
  manageMaintenanceFormNames,
  MANAGE_MAINTENANCE_ROUTES,
  getPathWithParam,
  usDateFormat,
  formFields,
  required,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import {
  manageMaintenanceStore,
  setManagePageLevelData,
} from "../../../contexts";
import { Formik, Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faCheckCircle,
  faPencilAlt,
  faTrashAlt,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";
import moment from "moment";
const initialValues = {};

const ScheduleExtensionContainer = (props) => {
  const { maintenanceId } = useRouterParams();
  const { dispatch } = useContext(manageMaintenanceStore);
  const formName = manageMaintenanceFormNames.SCHEDULE_EXTENSION;
  const fields = formFields[formName];
  const [showToast, setShowToast] = useState(false);
  const yesterday = moment().subtract(1, "day");
  const [isPopupOpen, setisPopupOpen] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };
  const onAddClick = () => {
    //setShowToast(true);
    console.log(selectedDate);
    !selectedDate ? setisPopupOpen(true) : setisPopupOpen(false);
  };

  const onFormSubmit = (values) => {
    dispatch(
      setManagePageLevelData({
        formName: formName,
        fieldData: values,
      })
    );
  };

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
        pathParam: [maintenanceId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Extend",
      variant: "primary",
      type: "submit",
      onClick: onAddClick,
      //   link: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR
    },
  ];
  const handleClose = () => {
    setisPopupOpen(false);
  };
  return (
    <>
      <Formik
        initialValues={{
          ...initialValues,
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
          return (
            <ManageMaintenanceLayout buttons={buttons}>
              <div className="w-100 maintenance-container">
                <div className="title-case">
                  Manage Payroll Schedule Extension
                </div>
                <Form
                  autoComplete="off"
                  className="h-100"
                  onSubmit={handleSubmit}
                  validated={!isEmpty(rest.errors)}
                >
                  <Field
                    name={fields.extendScheduleDate}
                    size="md"
                    label="Extend schedules in system upto"
                    {...rest}
                    value={usDateFormat(values[fields.extendScheduleDate])}
                    isDatePicker
                    isRequired
                    onClear={() => {
                      onDaySelected(fields.extendScheduleDate, "");
                      setSelectedDate("");
                    }}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) => {
                          onDaySelected(fields.extendScheduleDate, value);
                          setSelectedDate(value);
                        }}
                        value={values[fields.extendScheduleDate]}
                        minDate={new Date()}
                      />
                    }
                    component={FieldDropSide}
                    validate={required}
                  />
                </Form>
              </div>
            </ManageMaintenanceLayout>
          );
        }}
      </Formik>
      <Modal show={isPopupOpen} onHide={handleClose}>
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
              <h4>Provide a Future date</h4>
              {/* <p>{warning}</p> */}
              <br />
              <Button className="remove-btn mr-4" onClick={handleClose}>
                Ok
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        style={{
          position: "fixed",
          top: "10rem",
          right: "2rem",
          zIndex: "100",
        }}
        delay={3000}
        autohide
      >
        <Toast.Body>
          <div className="d-flex justify-content-between">
            <div className="toast-text">
              <FontAwesomeIcon
                icon={faCheckCircle}
                color="#3bb54a"
                className="mr-2"
              />
              Schedule Extended Successfully
            </div>
            <div>
              <FontAwesomeIcon
                icon={faTimesCircle}
                color="#000"
                onClick={() => setShowToast(false)}
                className="pointer ml-2"
              />
            </div>
          </div>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default ScheduleExtensionContainer;
