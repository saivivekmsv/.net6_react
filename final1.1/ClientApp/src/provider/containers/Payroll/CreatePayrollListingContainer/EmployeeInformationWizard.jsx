/* eslint-disable eqeqeq */
import React, { useContext, useState } from "react";
import { isEmpty, find } from "lodash";
import { Form, Button, Tabs, Tab } from "react-bootstrap";
import { Formik } from "formik";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MANAGE_PAYROLL_ROUTES,
  managePayrollFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  manageCensusFormNames,
} from "../../../utils";
import { managePayrollStore, setManagePageLevelData } from "../../../contexts";
import { useRouterParams, useDeepEffect } from "../../../abstracts";
import {
  getEmployeeCensusInformation,
  saveEmployeeInformationInPayroll,
} from "../../../services";
import { LoaderWrapper } from "../../../components";
import payrollMasterData from "../../../mocks/payrollEmployeeInformation.json";
import PersonalInformationFields from "../../Employee/EmployeeInformationContainer/PersonalInformation";
import ContactInformationFields from "../../Employee/EmployeeInformationContainer/ContactInformation";
import EmploymentAgeDetailFields from "../../Employee/EmployeeInformationContainer/EmploymentAgeDetail";
import OtherInformationFields from "../../Employee/EmployeeInformationContainer/OtherInformation";
import EmployeeClassificationFields from "../../Employee/EmployeeInformationContainer/EmployeeClassification";
const initialValues = {
  additionalCountry: "USA",
};

const EmployeeInformationWizard = (props) => {
  const { isEdit, isSave, data } = props;
  const { dispatch } = useContext(managePayrollStore);
  const [keyValue, setKeyValue] = useState(1);
  const { payrollId } = useRouterParams();
  // eslint-disable-next-line no-unused-vars
  const [newFlow, setNewFlow] = useState(payrollId ? FLOW_TYPES.EDIT : "");
  const formName = manageCensusFormNames.PERSONAL_INFORMATION;
  const fields = formFields[formName];
  const intpayrollId = parseInt(payrollId, 10);
  const [response, setResponse] = useState();
  // const filteredValues = find(payrollMasterData, {
  //   id: intpayrollId,
  // });
  const [load, setLoad] = useState(false);
  useDeepEffect(() => {
    setLoad(true);
    getEmployeeCensusInformation(data)
      .then((response) => {
        setLoad(false);
        setResponse(response);
      })
      .catch((error) => {
        //Handle Error
      });
  }, [data]);

  const onFormSubmit = (values) => {
    const { history } = props;
    history.push(
      getPathWithParam({
        path: MANAGE_PAYROLL_ROUTES.CREATE_PAYROLL_LISTING,
      })
    );
    dispatch(
      setManagePageLevelData({
        formName: formName,
        fieldData: values,
      })
    );
    saveEmployeeInformationInPayroll({ employeeId: data, values })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
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

  // const isEdit = flow === FLOW_TYPES.EDIT;
  // const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <LoaderWrapper isLoading={load}>
      <Formik
        initialValues={{
          ...initialValues,
          ...response,
        }}
        onSubmit={onFormSubmit}
        enableReinitialize
      >
        {(formProps) => {
          const {
            handleChange,
            setFieldValue,
            handleSubmit,
            setValues,
            setTouched,
            values,
            ...rest
          } = formProps;
          return (
            <Form
              autoComplete="off"
              className="h-100"
              onSubmit={handleSubmit}
              validated={!isEmpty(rest.errors)}
            >
              {/* <ManagePayrollLayout buttons={buttons} pageFlow={newFlow || flow}> */}
              <p className="popup-text-employee">Employee Information</p>
              <div className="census-tabs-head">
                <Tabs
                  activeKey={keyValue}
                  transition={false}
                  onSelect={tabChange}
                >
                  <Tab
                    eventKey={1}
                    title={
                      <div>
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          color={keyValue == 1 ? "#2f80ed" : "#bdbdbd"}
                        />
                        &nbsp;Personal
                      </div>
                    }
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
                          icon={faCheckCircle}
                          color={keyValue == 2 ? "#2f80ed" : "#bdbdbd"}
                        />
                        &nbsp;Contact
                      </div>
                    }
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
                        <Button className="add-btn mr-4" onClick={tabPersonel}>
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
                          icon={faCheckCircle}
                          color={keyValue == 3 ? "#2f80ed" : "#bdbdbd"}
                        />
                        &nbsp;Employment
                      </div>
                    }
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
                        <Button className="add-btn mr-4" onClick={tabContact}>
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
                          icon={faCheckCircle}
                          color={keyValue == 4 ? "#2f80ed" : "#bdbdbd"}
                        />
                        &nbsp;Employee
                      </div>
                    }
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
                          icon={faCheckCircle}
                          color={keyValue == 5 ? "#2f80ed" : "#bdbdbd"}
                        />
                        &nbsp;Other
                      </div>
                    }
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
                        <Button className="add-btn mr-4" onClick={tabEmployee}>
                          Previous
                        </Button>
                        <Button onClick={() => setNewFlow(FLOW_TYPES.SAVE)}>
                          Save
                        </Button>
                      </>
                    )}
                  </Tab>
                </Tabs>
              </div>
              {/* </ManagePayrollLayout> */}
            </Form>
          );
        }}
      </Formik>
    </LoaderWrapper>
  );
};

export default EmployeeInformationWizard;
