/* eslint-disable eqeqeq */
import React, { useContext, useState } from "react";
import { isEmpty, find, get, valuesIn, parseInt, isUndefined } from "lodash";
import { Form, Button, Tabs, Tab, Modal } from "react-bootstrap";
import {
  faTimes,
  faPencilAlt,
  faTrashAlt,
  faTimesCircle,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { Formik } from "formik";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  LoaderWrapper,
  ManageCensusLayout,
  ImageUpload,
} from "../../../components";
import {
  ROUTES,
  manageCensusFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  MANAGE_CENSUS_ROUTES,
  getAdvancedPathWithParam,
} from "../../../utils";
import {
  manageCensusStore,
  setManageCensusFullPageData,
  setManagePageLevelData,
  setManageCensusFlow,
  setManageCensusToastInfo,
} from "../../../contexts";
import { useRouterParams, useRequest, useDeepEffect } from "../../../abstracts";
import censusMasterData from "../../../mocks/CensusEmployeeInformation.json";
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
  uploadEmployeeLogo,
} from "../../../services";
import { Link } from "react-router-dom";

const initialValues = {
  country: "USA",
  countryId: 1,
  foreignCountry: null,
  foreignState: null,
  additionalCountry: "USA",
  additionalCountryId: 1,
  additionalForeignCountry: null,
  additionalForeignState: null,
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
  const [additionalAddress, setAdditionalAddress] = useState(
    response?.additionalAddress ? true : false
  );

  useDeepEffect(() => {
    setAdditionalAddress(response?.additionalAddress ? true : false);
  }, [response]);

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
    birthDate: 3,
    hireDate: 3,
    employmentStatus: 3,
    employmentStatusId: 3,
    terminationDate: 3,
    rehireDate: 3,
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
  const [imageFile, setImageFile] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(0);
  const [newEmployeeId, setNewEmployeeId] = useState(0);
  const [validationCount, setValidationCount] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [newCmpyId, setNewCmpyId] = useState({ prevId: null, newId: null });
  const [isCmpy, setIsCmpy] = useState(censusId);
  const [isStartDate, setIsStartDate] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);

  const setCompanyId = (id) => {
    if (newCmpyId.prevId == null) setNewCmpyId({ prevId: id, newId: id });
    else setNewCmpyId({ prevId: newCmpyId.newId, newId: id });
  };

  const changeInCmpyId = (id) => {
    if (id != newCmpyId.prevId && newCmpyId.prevId != null) return true;
    else return false;
  };

  const uploadImage = () => {
    setisModalOpen(true);
  };

  const handleImageClose = () => {
    setisModalOpen(false);
  };

  const saveImage = () => {
    if (validationCount === 0) {
      setImageLoading(true);
      setisModalOpen(false);
      var formData = new FormData();
      formData.append("file", imageFile);
      formData.append("employeeId", newEmployeeId);

      uploadEmployeeLogo(formData)
        .then((response) => {
          if (response) {
            setImageLoading(false);
            history.push(
              getPathWithParam({
                path: ROUTES.MANAGE_EMPLOYEE,
              })
            );
          }
        })
        .catch((error) => {
          setImageLoading(false);
        });
    }
  };

  const exit = () => {
    setisModalOpen(false);
    history.push(
      getPathWithParam({
        path: ROUTES.MANAGE_EMPLOYEE,
      })
    );
  };

  useDeepEffect(() => {
    if (flow !== FLOW_TYPES.ADD) {
      getEmployeeCensusInformation(censusId)
        .then((response) => {
          setResponse(response);
          if (response.leaveStartDate == null) setIsStartDate(false);
          else setIsStartDate(true);
          if (response.leaveEndDate == null) setIsEndDate(false);
          else setIsEndDate(true);
        })
        .catch((error) => {
          //Handle Error
        });
    }
  }, [censusId]);

  useDeepEffect(() => {
    dispatch(setManageCensusFullPageData(response));
  }, [response]);

  useDeepEffect(() => {
    dispatch(
      setManageCensusFlow({
        flow: flow,
      })
    );
  }, [flow]);

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
      [fields.uniquePersonalIdentification]: values[
        fields.uniquePersonalIdentification
      ]?.replaceAll("-", ""),
      [fields.stateId]: parseInt(values[fields.stateId]) || undefined,
      [fields.payrollFrequencyId]:
        parseInt(values[fields.payrollFrequencyId]) || undefined,
      [fields.employmentStatusId]:
        parseInt(values[fields.employmentStatusId]) || undefined,
      [fields.countryId]: parseInt(values[fields.countryId]) || undefined,
      [fields.ownership]: parseInt(values[fields.ownership]) || undefined,
      additionalAddress: additionalAddress
        ? {
            [fields.additionalAddressName]:
              values[fields.additionalAddressName],
            [fields.additionalAddressOne]: values[fields.additionalAddressOne],
            [fields.additionalAddressTwo]: values[fields.additionalAddressTwo],
            [fields.additionalAddressThree]:
              values[fields.additionalAddressThree],
            [fields.additionalCountry]: values[fields.additionalCountry],
            [fields.additionalState]: values[fields.additionalState],
            [fields.additionalCity]: values[fields.additionalCity],
            [fields.additionalZipCode]: values[fields.additionalZipCode],
            [fields.additionalForeignState]:
              values[fields.additionalForeignState],
            [fields.additionalForeignCountry]:
              values[fields.additionalForeignCountry],
            // [fields.additionalForeignAddressIndicator] : values[fields.additionalForeignAddressIndicator],
            [fields.additionalStateId]: values[fields.additionalStateId],
            [fields.additionalCountryId]: values[fields.additionalCountryId],
          }
        : null,
    };
  };

  const responseFail = (response, setFieldTouched, setFieldError) => {
    var color = { 1: false, 2: false, 3: false, 4: false, 5: false };
    setSaveTriggered(true);
    var notificationLength = response.errorMessages.filter(
      (_) => _.errorType === "IsNotification"
    ).length;
    for (var i = 0; i < response.errorMessages.length; i++) {
      var _ = response.errorMessages[i];
      if (response.errorMessages[i].errorType === "IsNotification") {
        warning.push(_.message);
      }
      setFieldTouched(_.controlName, _.message);
      setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);

      var x = [tabGroups[_.controlName]];
      if (isUndefined(x[0])) {
        if (_.controlName.includes("employeeClassifications")) x = 4;
      }
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
    if (notificationLength !== 0) setisPopupOpen(true);
    setTabColors(color);
  };

  const processResponse = (response, setFieldTouched, setFieldError) => {
    var color = { 1: false, 2: false, 3: false, 4: false, 5: false };
    if (response.isSuccessfull) {
      history.push(
        getPathWithParam({
          path: ROUTES.MANAGE_EMPLOYEE,
          queryParam: `?saveSuccess=1`,
        })
      );
    } else {
      responseFail(response, setFieldTouched, setFieldError);
    }
    // setTabColors(color);
  };

  const onFormSubmit = (
    values,
    { setSubmitting, setFieldTouched, setFieldError }
  ) => {
    const { history } = props;
    setIsLoading(true);
    setSubmitting(true);
    if (flow === FLOW_TYPES.SAVE) {
      updateEmployeePayroll(prepareValues(values)).then((response) => {
        processResponse(response, setFieldTouched, setFieldError);
        setIsLoading(false);
        // if (response.isSuccessfull) {
        //   setisModalOpen(true);
        // }
      });
    } else {
      saveEmployeeToPayroll(prepareValues(values)).then((response) => {
        if (response.isSuccessfull) {
          setisModalOpen(true);
          setNewEmployeeId(response.employee.id);
        } else {
          responseFail(response, setFieldTouched, setFieldError);
          setIsLoading(false);
        }
        // processResponse(response, setFieldTouched, setFieldError);
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
  const isSave = flow === FLOW_TYPES.SAVE;
  const layoutHeader = censusId == 1 ? "Add Employee" : "Employee";
  const imageBackgroundStyle = imageFile
    ? "image-upload-text grey-bg h-226"
    : "image-upload-text grey-bg h-285";

  return (
    <>
      <Formik
        initialValues={
          flow !== FLOW_TYPES.ADD
            ? {
                ...initialValues,
                ...response,
                ...(response?.additionalAddress || {}),
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
            fieldValue,
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
            setWarning([]);
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
              <LoaderWrapper isLoading={isLoading || imageLoading} style={{}}>
                <ManageCensusLayout
                  layoutHeader={layoutHeader}
                  buttons={buttons}
                  pageFlow={newFlow || flow}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "auto",
                      height: "100%",
                    }}
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
                            setCompanyId={setCompanyId}
                            isCmpy={isCmpy}
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
                                Contact{" "}
                                <span className="pl-20">Information</span>
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
                            setAdditionalAddress={(val) => {
                              setAdditionalAddress(val);
                            }}
                            additionalAddress={additionalAddress}
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
                            isStartDate={isStartDate}
                            isEndDate={isEndDate}
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
                            changeInCmpyId={changeInCmpyId}
                            isCmpy={isCmpy}
                          />
                          {isEdit == true ? null : (
                            <>
                              <Button
                                className="add-btn mr-4"
                                onClick={tabDates}
                              >
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

                    <Modal
                      show={isModalOpen}
                      onHide={handleImageClose}
                      className="image-upload-tab"
                    >
                      <Modal.Body className="image-upload-tab">
                        <div className="image-upload-body">
                          <div className="text-right">
                            <Link>
                              <FontAwesomeIcon
                                icon={faTimes}
                                color="#000"
                                onClick={exit}
                              />
                            </Link>
                          </div>
                          <div>
                            <div className="success-message-text">
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                color="#3BB54A"
                                size="1x"
                              />
                              &nbsp;&nbsp; The employee profile has created
                              successfully
                            </div>
                            <br />

                            <div className={imageBackgroundStyle}>
                              <ImageUpload
                                setFieldValue={setFieldValue}
                                label="Do you want to add profile picture of employee ?"
                                name="employeeImage"
                                blockDrag={isEdit && !isSave}
                                id={censusId}
                                imageFile={imageFile}
                                setImageFile={setImageFile}
                                validationCount={validationCount}
                                setValidationCount={setValidationCount}
                                // flow="edit"
                              />
                            </div>

                            {isEmpty(imageFile) ? (
                              <div>
                                <div className="margin-left-40">or</div>
                                <div>
                                  <Button
                                    variant="secondary"
                                    className="margin-left-30"
                                    onClick={exit}
                                  >
                                    No thanks
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div>
                                  <Button
                                    variant="secondary"
                                    className="margin-left-20"
                                    onClick={exit}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="primary"
                                    className="margin-left-20"
                                    onClick={() => saveImage()}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            )}
                            <br />
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                </ManageCensusLayout>

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
              </LoaderWrapper>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default EmployeeInformationContainer;
