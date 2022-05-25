/* eslint-disable eqeqeq */
import React, { useContext, useState } from "react";
import { isEmpty, find, get, valuesIn, parseInt } from "lodash";
import { Form, Button, Tabs, Tab, Modal } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import {
  faPencilAlt,
  faTrashAlt,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { Formik } from "formik";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderWrapper, ManageCensusLayout } from "../../../../shared/components";
import {
  ROUTES,
  manageCensusFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  MANAGE_CENSUS_ROUTES,
  getAdvancedPathWithParam,
} from "../../../../shared/utils";
import {
  manageCensusStore,
  setManageCensusFullPageData,
  setManagePageLevelData,
} from "shared/contexts";
import { useRouterParams, useRequest, useDeepEffect } from "../../../../shared/abstracts";

import PersonalInformationFields from "./PersonalInformation";
import ContactInformationFields from "./ContactInformation";
import EmploymentAgeDetailFields from "./EmploymentAgeDetail";
import OtherInformationFields from "./OtherInformation";
import EmployeeClassificationFields from "./EmployeeClassification";
import {
  deleteExistingEmployee,
  getEmployeeCensusInformation,
  updateEmployeePayroll,
  saveEmployeeToPayroll,
} from "../../../services";

const initialValues = {
  country: "USA",
  countryId: 1,
  foreignCountry: null,
  foreignState: null,
  foreignZipCode: null,
  additionalCountry: "USA",
  additionalCountryId: 1,
  additionalForeignCountry: null,
  additionalForeignState: null,
  additionalForeignZipCode: null,
  familyMemberOfOwnerIndicator: false,
  pendingQDROIndicator: false,
  returnMailIndicator: false,
  officerIndicator: false,
  hceIndicator: false,
  keyEmployeeIndicator: false,
  insiderOrRestrictedEmployeeIndicator: false,
};

const EmployeeInformationContainer = (props) => {
  const { dispatch } = useContext(manageCensusStore);
  const [keyValue, setKeyValue] = useState(1);
  const { censusId, flow } = useRouterParams();
  const [newFlow] = useState();
  const formName = manageCensusFormNames.PERSONAL_INFORMATION;
  const fields = formFields[formName];
  const intcensusId = parseInt(censusId, 0);
  const [filteredValues, setFilteredValues] = useState([]);
  // const filteredValues = find(censusMasterData, {
  //   id: intcensusId,
  // });
  const [isPopupOpen, setisPopupOpen] = useState(0);
  const [warning, setWarning] = useState([]);
  const { history, payload } = props;
  const [response, setResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const tabGroups = {
    firstName: 1,
    middleName: 1,
    lastName: 1,
    uniquePersonalIdentification: 1,
    companyName: 1,
    companyId: 1,
    employeeNumber: 1,
    payrollFrequency: 1,
    payrollFrequencyId: 1,
    gender: 1,
    maritalStatus: 1,
    primaryEmailAddress: 2,
    mobilePhoneNumber: 2,
    workPhoneNumber: 2,
    address: 2,
    address1: 2,
    address2: 2,
    address3: 2,
    city: 2,
    country: 2,
    countryCode: 2,
    countryId: 2,
    foreignCountry: 2,
    foreignState: 2,
    foreignZipCode: 2,
    state: 2,
    stateId: 2,
    zipCode: 2,
    additionalAddressName: 2,
    additionalAddressOne: 2,
    additionalAddressTwo: 2,
    additionalAddressThree: 2,
    additionalCity: 2,
    additionalForeignAddress: 2,
    additionalCountry: 2,
    additionalState: 2,
    additionalZipCode: 2,
    additionalForeignCountry: 2,
    additionalForeignState: 2,
    additionalForeignZipCode: 2,
    birthDate: 3,
    hireDate: 3,
    employmentStatus: 3,
    employmentStatusId: 3,
    terminationDate: 3,
    reHireDate: 3,
    classificationId: 4,
    classificationType: 4,
    classificationCode: 4,
    classificationName: 4,
    startDate: 4,
    endDate: 4,
    pendingQDROIndicator: 5,
    ownerShip: 5,
    familyMemberOfOwnerIndicator: 5,
    relationUniquePersonalIdentification: 5,
    returnMailIndicator: 5,
    officerIndicator: 5,
    hceIndicator: 5,
    hce: 5,
    HCEIndicatorReason: 5,
    keyEmployeeIndicator: 5,
    insiderOrRestrictedEmployeeIndicator: 5,
  };
  const [tabColors, setTabColors] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [saveTriggered, setSaveTriggered] = useState(false);

  useDeepEffect(() => {
    if (flow !== FLOW_TYPES.ADD) {
      getEmployeeCensusInformation(censusId)
        .then((response) => {
          setResponse(response);
        })
        .catch((error) => {
          //Handle Error
        });
    }
  }, [censusId]);

  useDeepEffect(() => {
    dispatch(setManageCensusFullPageData(response));
  }, [response]);

  const deleteEmployee = () => {
    deleteExistingEmployee(censusId)
      .then((response) => {
        if (response) {
          history.push(
            getPathWithParam({
              path: ROUTES.MANAGE_EMPLOYEE,
            })
          );
        }
      })
      .catch((error) => {
        //Handle Errors
      });
  };

  const handleClose = () => {
    setWarning([]);
    setisPopupOpen(false);
  };

  const prepareValues = (values) => {
    return {
      ...values,
      [fields.companyId]: parseInt(values[fields.companyId]) || undefined,
      [fields.stateId]: parseInt(values[fields.stateId]) || undefined,
      [fields.payrollFrequencyId]:
        parseInt(values[fields.payrollFrequencyId]) || undefined,
      [fields.employmentStatusId]:
        parseInt(values[fields.employmentStatusId]) || undefined,
      [fields.countryId]: parseInt(values[fields.countryId]) || undefined,
      [fields.ownership]: parseInt(values[fields.ownership]) || undefined,
    };
  };

  const processResponse = (response, setFieldTouched, setFieldError) => {
    var color = { 1: false, 2: false, 3: false, 4: false, 5: false };
    if (response.isSuccessfull) {
      window.setTimeout(() => {
        history.push(
          getPathWithParam({
            path: ROUTES.MANAGE_EMPLOYEE,
          })
        );
      }, 10);
    } else {
      setSaveTriggered(true);
      for (var i = 0; i < response.errorMessages.length; i++) {
        var _ = response.errorMessages[i];
        var errorsLength = response.errorMessages.filter(
          (_) => _.errorType === "IsError"
        ).length;
        var notificationLength = response.errorMessages.filter(
          (_) => _.errorType === "IsNotification"
        ).length;
        if (errorsLength === 0 && notificationLength !== 0) {
          warning.push(_.message);
          setisPopupOpen(true);
        }
        setFieldTouched(_.controlName, _.message);
        setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        var x = [tabGroups[_.controlName]];

        x == 1
          ? (color[1] = true)
          : x == 2
          ? (color[2] = true)
          : x == 3
          ? (color[3] = true)
          : x == 4
          ? (color[4] = true)
          : x == 5
          ? (color[5] = true)
          : console.log("controlName not found");
      }
    }
    setTabColors(color);
  };
  const onFormSubmit = (
    values,
    { setSubmitting, setFieldTouched, setFieldError }
  ) => {
    const { history } = props;
    setIsLoading(true);
    setSubmitting(true);
    if (flow === FLOW_TYPES.SAVE) {
      updateEmployeePayroll(prepareValues(values))
        .then((response) => {
          setIsLoading(false);
          processResponse(response, setFieldTouched, setFieldError);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } else {
      saveEmployeeToPayroll(prepareValues(values))
        .then((response) => {
          setIsLoading(false);
          processResponse(response, setFieldTouched, setFieldError);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  };

  const setTabColor = (tabValue) => {
    return keyValue == tabValue
      ? "#2f80ed"
      : saveTriggered
      ? tabColors[tabValue]
        ? "red"
        : "green"
      : "#bdbdbd";
  };

  const setTabClass = (tabValue) => {
    return keyValue == tabValue
      ? "active"
      : saveTriggered
      ? tabColors[tabValue]
        ? "error"
        : "green"
      : "";
  };

  const setTabIcon = (tabValue) => {
    return tabColors[tabValue] == true ? faExclamationCircle : faCheckCircle;
  };

  const tabChange = (key) => {
    setKeyValue(key);
  };

  const tabPersonel = () => {
    setKeyValue(1);
  };

  const tabContact = () => {
    setKeyValue(2);
  };

  const tabDates = () => {
    setKeyValue(3);
  };
  const tabEmployee = () => {
    setKeyValue(4);
  };
  const tabOthers = () => {
    setKeyValue(5);
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  const layoutHeader = censusId == 1 ? "Add Employee" : "Employee";

  return (
    <>
      <Formik
        initialValues={
          flow !== FLOW_TYPES.ADD
            ? {
                ...initialValues,
                ...response,
              }
            : { ...initialValues }
        }
        onSubmit={onFormSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(formProps) => {
          const {
            handleChange,
            setFieldValue,
            handleSubmit,
            setValues,
            setTouched,
            values,
            setSubmitting,
            setFieldError,
            ...rest
          } = formProps;

          const buttons = [
            {
              link: `${ROUTES.MANAGE_EMPLOYEE}`,
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
              link: `${ROUTES.MANAGE_EMPLOYEE}`,
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
                    path: MANAGE_CENSUS_ROUTES.EMPLOYEE_INFORMATION,
                    pathParam: [FLOW_TYPES.SAVE, censusId],
                  })
                ),
            },
            {
              label: "",
              variant: "link",
              type: "button",
              flow: [FLOW_TYPES.EDIT],
              icon: faTrashAlt,
              onClick: () => {
                deleteEmployee();
              },
            },
            {
              label: "Save",
              variant: "primary",
              type: "submit",
              flow: [FLOW_TYPES.SAVE],
            },
          ];
          const handleAcceptWarning = () => {
            values.acceptWarning = true;
            setisPopupOpen(false);
          };

          return (
            <Form
              autoComplete="off"
              className="h-100"
              onSubmit={handleSubmit}
              validated={!isEmpty(rest.errors)}
            >
              <LoaderWrapper isLoading={isLoading}>
                <ManageCensusLayout
                  layoutHeader={layoutHeader}
                  buttons={buttons}
                  pageFlow={newFlow || flow}
                >
                  <p className="plan-sub-heading">Employee Information</p>
                  <div className="census-tabs-head">
                    <Tabs
                      activeKey={keyValue}
                      transition={false}
                      onSelect={tabChange}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Tab
                        eventKey={1}
                        title={
                          <div>
                            <FontAwesomeIcon
                              icon={setTabIcon(1)}
                              color={setTabColor(1)}
                            />
                            &nbsp;
                            <span class="tabName">
                              Personal <span className="pl-20">Details</span>
                            </span>
                          </div>
                        }
                        tabClassName={setTabClass(1)}
                      >
                        <PersonalInformationFields
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                        />
                        {isEdit == true ? null : (
                          <Button onClick={tabContact}>Next</Button>
                        )}
                      </Tab>
                      <Tab
                        eventKey={2}
                        title={
                          <div>
                            <FontAwesomeIcon
                              icon={setTabIcon(2)}
                              color={setTabColor(2)}
                            />
                            &nbsp;
                            <span class="tabName">
                              Contact <span className="pl-20">Information</span>
                            </span>
                          </div>
                        }
                        tabClassName={setTabClass(2)}
                        disabled={false}
                      >
                        <ContactInformationFields
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                        />
                        {isEdit == true ? null : (
                          <>
                            {" "}
                            <Button
                              className="add-btn mr-4"
                              onClick={tabPersonel}
                            >
                              Previous
                            </Button>
                            <Button onClick={tabDates}>Next</Button>
                          </>
                        )}
                      </Tab>
                      <Tab
                        eventKey={3}
                        title={
                          <div>
                            <FontAwesomeIcon
                              icon={setTabIcon(3)}
                              color={setTabColor(3)}
                            />
                            &nbsp;
                            <span class="tabName">
                              Employment <br />
                              <span className="pl-20">& Age Details</span>
                            </span>
                          </div>
                        }
                        tabClassName={setTabClass(3)}
                        disabled={false}
                      >
                        <EmploymentAgeDetailFields
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                        />
                        {isEdit == true ? null : (
                          <>
                            {" "}
                            <Button
                              className="add-btn mr-4"
                              onClick={tabContact}
                            >
                              Previous
                            </Button>
                            <Button onClick={tabEmployee}>Next</Button>
                          </>
                        )}
                      </Tab>
                      <Tab
                        eventKey={4}
                        title={
                          <div>
                            <FontAwesomeIcon
                              icon={setTabIcon(4)}
                              color={setTabColor(4)}
                            />
                            &nbsp;
                            <span class="tabName">
                              Employee{" "}
                              <span className="pl-20">Classification</span>
                            </span>
                          </div>
                        }
                        tabClassName={setTabClass(4)}
                        disabled={false}
                      >
                        <EmployeeClassificationFields
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                        />
                        {isEdit == true ? null : (
                          <>
                            <Button className="add-btn mr-4" onClick={tabDates}>
                              Previous
                            </Button>
                            <Button onClick={tabOthers}>Next</Button>
                          </>
                        )}
                      </Tab>
                      <Tab
                        eventKey={5}
                        title={
                          <div>
                            <FontAwesomeIcon
                              icon={setTabIcon(5)}
                              color={setTabColor(5)}
                            />
                            &nbsp;
                            <span class="tabName">
                              Other <span className="pl-20">Information</span>
                            </span>
                          </div>
                        }
                        tabClassName={setTabClass(5)}
                        disabled={false}
                      >
                        <OtherInformationFields
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                        />
                        {isEdit == true ? null : (
                          <>
                            <Button
                              className="add-btn mr-4"
                              onClick={tabEmployee}
                            >
                              Previous
                            </Button>
                            <Button type="submit">Save</Button>
                          </>
                        )}
                      </Tab>
                    </Tabs>
                  </div>
                </ManageCensusLayout>
              </LoaderWrapper>

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
                      <h4>Warning</h4>
                      {console.log(warning)}
                      <p>{warning.join("\n")}</p>
                      <br />
                      <Button
                        className="remove-btn mr-4"
                        onClick={handleAcceptWarning}
                      >
                        Accept
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

export default EmployeeInformationContainer;
