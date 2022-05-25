import React, { useContext, useState } from "react";
import { isEmpty, get, find } from "lodash";
import { Form, Toast, Modal, Button } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import {
  faPencilAlt,
  faTrashAlt,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import {
  ManageMaintenanceLayout,
  FieldDropSide,
  DatePicker,
  FieldInput,
} from "../../../components";
import {
  manageMaintenanceFormNames,
  MANAGE_MAINTENANCE_ROUTES,
  getPathWithParam,
  usDateFormat,
  formFields,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  required,
} from "../../../utils";
import { useRouterParams, useRequest } from "../../../abstracts";
import {
  manageMaintenanceStore,
  setManagePageLevelData,
  saveHolidayDetailsAction,
  deleteHolidayAction,
  setManageMaintenanceToastInfo,
} from "../../../contexts";
import { Formik, Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import holidayCalendar from "../../../mocks/holidayCalendar.json";
import { deleteHoliday, getHolidayCalendarMaster } from "../../../services";

import { MANAGE_MAINTENANCE_POST_API_RESPONSE } from "../../../contexts/reducers/manage-maintenance/actions";

const initialValues = {};

const AddHolidayCalendarContainer = (props) => {
  const { history } = props;
  const { flow, maintenanceId } = useRouterParams();
  const { state, dispatch } = useContext(manageMaintenanceStore);
  const formName = manageMaintenanceFormNames.ADD_NEW_HOLIDAY;
  const fields = formFields[formName];
  const [newFlow] = useState("");
  const [isPopupOpen, setisPopupOpen] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const intmaintenanceId = parseInt(maintenanceId, 10);

  const { response, loading } = useRequest({
    method: getHolidayCalendarMaster,
    payload: 0,
    defaultResponse: [],
  });

  const [toggle, setToggle] = useState(0);
  const formValues = find(response, { id: intmaintenanceId });
  // if(!isEmpty(formValues.holidayDate.Year))
  // {
  //   console.log("form",(formValues.holidayDate.Year))
  // }
  let year;
  if (!isEmpty(formValues)) {
    year = parseInt(formValues.holidayDate.substring(6));
  }

  // var { response: filteredValues, loading: isLoading } = useRequest({
  //   method: getHolidayCalendarMaster,
  //   payload: "2021",
  //   defaultResponse: {},
  // });

  //   filteredValues = find(filteredValues, {
  //     id: intmaintenanceId,
  //   });
  // console.log(filteredValues)

  // const onAddClick = (values) => {
  //   // setShowToast(true);
  //   // console.log(values,"Hi")
  //   // console.log(values[fields.date], values[fields.holidayName], "values");
  //   // saveHolidayDetailsAction({
  //   //   data: getDataForSave(values),
  //   // }).then((response) => {
  //   //   if (response.isSuccessful) {
  //   //     console.log(response, "Successful");
  //   //   }
  //   // });
  //   history.push(
  //     getAdvancedPathWithParam({
  //       path: MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY,
  //       pathParam: [FLOW_TYPES.EDIT, maintenanceId],
  //     })
  //   );
  // };
  const removeOne = () => {
    setToggle(1);
    setisPopupOpen(true);
  };
  const handleClose = () => {
    setisPopupOpen(false);
  };
  const onDeleteClick = ({
    values,
    setFieldError,
    setFieldTouched,
    setSubmitting,
  }) => {
    deleteHolidayAction(
      {
        id: intmaintenanceId ? intmaintenanceId : 0,
        holidayDate: year,
      },
      dispatch
    ).then((response) => {
      if (response.isSuccessful) {
        // setShowToast(true);
        history.push(
          getPathWithParam({
            path: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
            pathParam: [FLOW_TYPES.EDIT],
          })
        );
        dispatch(
          setManageMaintenanceToastInfo({
            showToast: true,
            toastMessage:
              values[fields.date] +
              "-" +
              values[fields.holidayName] +
              " Holiday deleted successfully",
          })
        );
      } else {
        setSubmitting(false);
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, _.message);
        }
      }
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    if (toggle === 0) {
      saveHolidayDetailsAction(
        {
          id: intmaintenanceId ? intmaintenanceId : 0,
          holidayDate: values[fields.date],
          name: values[fields.holidayName],
        },
        dispatch
      ).then((response) => {
        if (response.isSuccessful) {
          //const newPlanId = get(response, "plan.id");
          history.push(
            getPathWithParam({
              path: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
              pathParam: [FLOW_TYPES.ADD, maintenanceId],
            })
          );
          //setShowToast(true);
          dispatch(
            setManagePageLevelData({
              formName: formName,
              fieldData: values,
            })
          );
          dispatch(
            setManageMaintenanceToastInfo({
              showToast: true,
              toastMessage: "Holiday saved successfully",
            })
          );
        } else {
          setSubmitting(false);
          for (var i = 0; i < response.errorMessages.length; i++) {
            var _ = response.errorMessages[i];
            setFieldTouched(_.controlName, true);
            setFieldError(_.controlName, _.errorCode + ": " + _.message);
          }
        }
      });
    } else {
      onDeleteClick({ values, setFieldError, setFieldTouched, setSubmitting });
      setToggle(0);
      setisPopupOpen(false);
    }
  };

  const buttons = [
    {
      // link: getPathWithParam({
      //   path: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
      //   pathParam: [maintenanceId],
      //}),
      label: "",
      variant: "link",
      type: "button",
      icon: faTrashAlt,
      flow: [FLOW_TYPES.EDIT],
      onClick: removeOne,
      //link: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
    },
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      link: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
      onClick: () =>
        dispatch({
          type: MANAGE_MAINTENANCE_POST_API_RESPONSE,
          payload: year,
        }),
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
      link: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
      onClick: () =>
        dispatch({
          type: MANAGE_MAINTENANCE_POST_API_RESPONSE,
          payload: year,
        }),
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
            path: MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY,
            pathParam: [FLOW_TYPES.SAVE, maintenanceId],
          })
        ),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
    // {
    //   label: "Cancel",
    //   variant: "secondary",
    //   type: "button",
    //   flow: [],
    //   link: getAdvancedPathWithParam({
    //     path: MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY,
    //     pathParam: [FLOW_TYPES.EDIT, maintenanceId],
    //   }),
    // },
  ];

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  const layoutHeader = maintenanceId && "Edit Holiday Detail";

  return (
    <div className="w-100 maintenance-container">
      {/* <div className="title-case">New Holiday</div> */}

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
        {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
          const onDaySelected = (fieldName, value) => {
            setFieldValue(fieldName, value);
          };
          return (
            <Form
              autoComplete="off"
              className="h-100"
              onSubmit={handleSubmit}
              // validated={!isEmpty(rest.errors)}
              validated={!isEdit}
            >
              <ManageMaintenanceLayout
                buttons={buttons}
                pageFlow={newFlow || flow}
                layoutHeader={layoutHeader}
              >
                <Field
                  name={fields.date}
                  size="sm"
                  label="Date"
                  {...rest}
                  value={usDateFormat(values[fields.date])}
                  disabled={isEdit && !isSave}
                  isDatePicker
                  isRequired
                  onClear={() => onDaySelected(fields.date, undefined)}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) => onDaySelected(fields.date, value)}
                      value={values[fields.date]}
                    />
                  }
                  component={FieldDropSide}
                />

                <Field
                  label="Holiday name"
                  name={fields.holidayName}
                  {...rest}
                  type="text"
                  size="md"
                  isRequired
                  autoComplete="off"
                  value={values[fields.holidayName]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInput}
                />
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
                        <h4>Delete Holiday ?</h4>
                        <p>
                          You are attempting to delete Holiday. Do you wish to
                          Continue ?
                        </p>
                        <br />
                        <Button
                          className="remove-btn mr-4"
                          onClick={handleSubmit}
                        >
                          Delete
                        </Button>
                        <Button className="cancel-btn" onClick={handleClose}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </ManageMaintenanceLayout>
            </Form>
          );
        }}
      </Formik>
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
              <span className="toast-text ml-2">
                Holiday saved successfully
              </span>
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
    </div>
  );
};

export default AddHolidayCalendarContainer;
