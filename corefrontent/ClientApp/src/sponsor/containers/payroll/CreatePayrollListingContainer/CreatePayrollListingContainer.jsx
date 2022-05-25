/* eslint-disable eqeqeq */
import React, { useState, useContext, useEffect, useDeepEffect } from "react";
import { Button, Row, Col, Image, Form, InputGroup } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import * as fileSaver from "file-saver";
import { camelCase } from "lodash";
import {
  SliderPanel,
  LoaderWrapper,
  CsplTable as Table,
  FormControlSearch,
  FieldInputNumber,
  ManagePayrollLayout,
} from "../../../../shared/components";
import {
  MANAGE_PAYROLL_ROUTES,
  ROUTES,
  FLOW_TYPES,
  formFields,
  getFlowBasedFormValues,
  managePayrollFormNames,
  getAdvancedPathWithParam,
  ssnMasking,
} from "../../../../shared/utils";
import { useRouterParams, useRequest } from "../../../../shared/abstracts";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import {
  getPayrollMetaDataDetails,
  getCreatePayrollInformationByFileId,
  downloadCreatePayrolldetail,
  UpdatePayrollEmployee,
  submitCreatePayroll,
} from "../../../services";
import { isEmpty } from "lodash";
import ExcelImage from "../../../../shared/styles/exportimg.PNG";
import { get } from "lodash";
import { managePayrollStore } from "../../../contexts";
import {
  SearchDropdownWithAPI,
  FieldInput,
  FieldInputDollar,
} from "../../../../shared/components";
import { Field, FieldArray, Formik } from "formik";
import AddToolTip from "../../../../shared/components/AddToolTip";
import EmployeeInformationWizard from "./EmployeeInformationWizard";

const CreatePayrollListingContainer = (props) => {
  //const [employeeData, setEmployeeData] = useState([]);
  const history = useHistory();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [Edata, setEdata] = useState({});
  const [sourceData, setSourceData] = useState({});
  const [isModalEmployeeWizardOpen, setModalEmployeeWizardOpen] = useState(
    false
  );
  // eslint-disable-next-line no-unused-vars
  const [searchEmployee, setSearchEmployee] = useState("");
  const { payrollId, flow } = useRouterParams();
  const [sidePanelData, setSidePanelData] = useState({});
  const formName = managePayrollFormNames.CREATE_PAYROLL_LISTING;
  const fields = formFields[formName];
  const { response: data, loading: isLoading } = useRequest({
    method: getPayrollMetaDataDetails,
    payload: payrollId,
    defaultResponse: {},
  });

  console.log("Edata", Edata);
  console.log("api call --");
  const [employeeData, setEmployeeData] = useState();
  useEffect(() => {
    getCreatePayrollInformationByFileId(payrollId).then((response) => {
      setEmployeeData(response);
    });
  }, []);

  console.log("data for getPayrollMetaDetails", employeeData);

  var searchResult = searchEmployee
    ? employeeData.filter(
        (_) =>
          _.uniquePersonalIdentification.includes(searchEmployee) ||
          _.firstName.includes(searchEmployee)
      )
    : employeeData;

  var eligibleData = (employeeData || []).filter(
    (_) => _.isPayrollDetail === true
  );
  var eligibleCount = eligibleData.length;

  var ineligibleCount = (employeeData || []).filter(
    (_) => _.isPayrollDetail === false
  ).length;

  const exportReportFile = () => {
    downloadCreatePayrolldetail(eligibleData, data.companyId, payrollId)
      .then((response) => {
        var blob = new Blob([response], {
          type: "text/csv",
        });
        fileSaver.saveAs(blob, "CreatePayrolldetail.csv");
      })
      .catch((error) => {
        console.log("Error while retrieving Create Payroll detail");
      });
  };
  const UpdatepayrollEmployees = () => {
    UpdatePayrollEmployee(employeeData.filter((_) => _.isPayrollDetail))
      .then((response) => {
        history.push(
          getAdvancedPathWithParam({
            path: `${ROUTES.PAYROLL}`,
            pathParam: [],
          })
        );
        console.log("UpdatePayrollEmployee", "Success");
      })
      .catch((error) => {
        console.log("Error while Update Payrol lEmployee");
      });
  };
  const submitPayroll = () => {
    submitCreatePayroll(
      employeeData.filter((_) => _.isPayrollDetail),
      data.companyId,
      payrollId
    )
      .then((response) => {
        history.push(
          getAdvancedPathWithParam({
            path: `${ROUTES.PAYROLL}`,
            pathParam: [],
          })
        );
      })
      .catch((error) => {
        console.log("Error while Update Payrol lEmployee");
      });
  };
  const calculateTotalContribution = (data) => {
    let sum = 0;
    data.payrollPlans.forEach((_) => {
      _.sources.forEach((_) => {
        sum += _.contributionAmount ?? 0;
      });
    });
    return sum;
  };
  useEffect(() => {
    if (Edata.payrollPlans && Edata.payrollPlans.length > 0)
      setSourceData(Edata.payrollPlans[0]);
    console.log(Edata.payrollPlans);
  }, [Edata.payrollPlans]);
  const onViewEmployeeWizard = (data) => {
    setModalEmployeeWizardOpen(true);
    setSidePanelData(data);
  };
  const onEditButtonClick = (data) => {
    setSliderOpen(true);
    setEdata(data);
  };
  const onSave = (values) => {
    let val = employeeData.map((item) => {
      if (item.employeeId === values.employeeId) {
        console.log(values);
        return { ...values };
      }
      return item;
    });
    setEmployeeData(val);
    setSliderOpen(false);
  };
  const displaySource = (d) => {
    setSourceData(d);
  };

  const buttons = [
    // {
    //   link: ROUTES.PAYROLL,
    //   label: "Cancel",
    //   variant: "secondary",
    //   type: "button",
    //   flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    //   onClick: () => setModalEmployeeWizardOpen(false),
    // },
    // {
    //   label: "Save",
    //   variant: "primary",
    //   type: "submit",
    //   flow: [FLOW_TYPES.ADD],
    //   link: ROUTES.PAYROLL,
    // },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      onClick: () => setModalEmployeeWizardOpen(false),
    },
    // {
    //   label: "",
    //   variant: "link",
    //   type: "button",
    //   flow: [FLOW_TYPES.EDIT],
    //   icon: faPencilAlt,
    //   onClick: () => setNewFlow(FLOW_TYPES.SAVE),
    // },
    // {
    //   label: "Save",
    //   variant: "primary",
    //   type: "submit",
    //   flow: [FLOW_TYPES.SAVE],
    //   link: ROUTES.PAYROLL,
    // },
  ];

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;
  return (
    <LoaderWrapper isLoading={isLoading}>
      <div
        className="create-payroll-container w-100"
        style={{ paddingLeft: "50px" }}
      >
        <div className="d-flex justify-content-between align-baseline">
          <div className="plan-heading font-weight-500">Payroll & Census</div>
          <div className="mt-10">
            <Link to={MANAGE_PAYROLL_ROUTES.CREATE_OR_GENERATE}>Cancel</Link>
            {/* <Link to={ROUTES.PAYROLL}> */}

            <Button
              variant="secondary"
              className="mr-4 ml-4"
              onClick={() => {
                UpdatepayrollEmployees();
              }}
            >
              Continue later
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                submitPayroll();
              }}
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="border-top" />
        <div className="mt-20">
          <p className="payroll-sub-heading">Create Payroll</p>
          <Row className="header-text">
            <Col sm="4">
              <h1 className="text-black">{data.companyName}</h1>
              {/* { <p className="grey-title">Plan Name</p> } */}
              {/* <p className="company-title font-weight-500 text-black mbb-5"> */}
              {/* {data.planName} */}
              {/* </p> */}
              {/* <p className="plan-id"> */}
              {/* <span>Plan ID :</span> {data.rkPlanNumber} */}
              {/* </p> */}
            </Col>
            <Col sm="2">
              <h4 className="company-title font-weight-500">
                {data.payrollFrequencyName}
              </h4>
              <p className="grey-title">Pay date</p>
              <p>{data.payDate}</p>
            </Col>
            <Col sm="3" style={{}}>
              <h4 className="company-title font-weight-500">{data.fileName}</h4>

              <AddToolTip
                className="short-desc"
                name={data.description}
                placement="bottom"
              >
                {(data.description || "").slice(0, 150)}
              </AddToolTip>
            </Col>

            <Col sm="3">
              <p className="total-title">Total employees</p>

              <h4>
                {eligibleCount}/{employeeData != null ? employeeData.length : 0}
              </h4>
            </Col>
          </Row>
        </div>
        <div className="line-separator" />

        <Row>
          <Col style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "30px",
              }}
            >
              <div className="search-bar " style={{ width: "100%" }}>
                <Form>
                  <div className="flex-search">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <div className="search-icon-postion">
                          <i class="fal fa-search" aria-hidden="true"></i>
                        </div>
                      </InputGroup.Prepend>

                      <FormControlSearch
                        size="md"
                        type="search"
                        placeholder="Search SSN or employee name"
                        className="pad-left-search"
                        onChange={(e) => setSearchEmployee(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>

        <div className="employee-and-payroll-details d-flex-row">
          <div className="employee-details w-368 marg-right-35">
            <div
              className="employee-details-title d-flex-row justify-content-space-between "
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p className="font-weight-500 text-black ft-14">
                Employee Details
              </p>
              <p className="grey-title ft-12">{ineligibleCount} Employees</p>
            </div>
            <div className="employee-details-table ">
              <div
                classNname="employee-details-header d-flex-row justify-content-space-between "
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p className="font-weight-500 text-black ft-12 marg-left-6">
                  SSN and Name
                </p>
                <Link
                  className="link blue-small ft-14 font-weight-500 marg-right-42"
                  onClick={() =>
                    setEmployeeData(
                      employeeData.map((d, i) =>
                        d.isPayrollDetail === false
                          ? { ...d, isPayrollDetail: true }
                          : d
                      )
                    )
                  }
                >
                  Add all
                </Link>
              </div>
              {/* {searchResult.length} */}
              <div className="line-separator marg-0" />
              <div className="employee-list">
                {!isEmpty(searchResult) ? (
                  ineligibleCount != 0 ? (
                    searchResult.map((data, index) => (
                      <div>
                        {/* {console.log("api data ", data)} */}
                        {data.isPayrollDetail === false ? (
                          <div
                            className="employee-tile marg-top-20"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div
                              className="details d-flex-col"
                              style={{ paddingLeft: "6px" }}
                            >
                              <p className="tile-ssn ft-14">
                                {ssnMasking(data.uniquePersonalIdentification)}
                              </p>
                              <p className="tile-name ft-12">
                                {data.firstName} {data.lastName}
                              </p>
                            </div>
                            <AddToolTip
                              placement="bottom"
                              name="This will move the employee to the payroll details"
                            >
                              <Link>
                                {/* <div className="Arrows" style={{paddingTop:'5px'}} >
                                  <i className="fa fa-long-arrow-right" style={{color:'rgba(47, 128, 237, 1)',fontSize:'20px',fontWeight:'500', }} aria-hidden="true" onClick={console.log(data.isEligible)}></i>
                                </div> */}
                                <i
                                  className="fa fa-long-arrow-right"
                                  style={{
                                    color: "rgba(47, 128, 237, 1)",
                                    fontSize: "20px",
                                    fontWeight: "500",
                                  }}
                                  aria-hidden="true"
                                  onClick={
                                    () =>
                                      setEmployeeData(
                                        employeeData.map((d, i) =>
                                          i === index
                                            ? { ...d, isPayrollDetail: true }
                                            : d
                                        )
                                      )
                                    // showTile()//,//(plan) => !mappings.map((item) => item.planId).includes(plan.id)
                                    // setEligibility(
                                    //   employeeData.filter(
                                    //     (emp) => emp.isPayrollDetail==0
                                    //   ).length,
                                    //   console.log("eligibilty", eligibility)
                                    // )
                                  }
                                />
                              </Link>
                            </AddToolTip>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "15px", textAlign: "center" }}>
                      All Employees are added to payroll{" "}
                    </p>
                  )
                ) : (
                  <p style={{ fontSize: "20px", textAlign: "center" }}>
                    No result found
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="payroll-details" style={{ width: "945px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <p
                className="font-weight-500 text-black ft-14"
                style={{ width: "200px" }}
              >
                Payroll Details
              </p>
              <p
                className="grey-title ft-12"
                style={{ paddingLeft: "320px", width: "500px" }}
              >
                {ineligibleCount === 0 ? "All" : eligibleCount} Employees added
                for payroll
              </p>
              <div className="ft-12 grey-text font-weight-500 marg-right-5">
                <Button
                  className="export-button"
                  title="Export Excel"
                  variant="secondary"
                  style={{ border: "none" }}
                  onClick={() => {
                    exportReportFile();
                  }}
                >
                  <Image src={ExcelImage} width="20px" />
                  Export
                </Button>
              </div>
            </div>
            <div
              style={{
                height: "auto",
                maxHeight: "390px",
                border: "1px solid #E0E0E0",
              }}
            >
              <Table>
                <Table.Thead>
                  <Table.Tr
                    className="ft-12 font-weight-500"
                    style={{ margin: "17px 5px 11px 34px" }}
                  >
                    Remove
                  </Table.Tr>
                  <Table.Tr className="ft-12 font-weight-500">
                    SSN & Employee name
                  </Table.Tr>
                  <Table.Tr
                    className="ft-12 font-weight-500"
                    style={{ marginLeft: "70px" }}
                  >
                    Hours
                  </Table.Tr>
                  <Table.Tr className="ft-12 font-weight-500">
                    Plan Compensation
                  </Table.Tr>
                  <Table.Tr className="ft-12 font-weight-500">
                    Gross Compensation
                  </Table.Tr>
                  <Table.Tr className="ft-12 font-weight-500">
                    Total Contribution
                  </Table.Tr>
                  <Table.Tr className="ft-12 font-weight-500">Action</Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {!isEmpty(employeeData) &&
                    employeeData.map((data, index) => (
                      <div>
                        {data.isPayrollDetail === true ? (
                          <Table.Tr>
                            <Table.Td>
                              <AddToolTip
                                placement="bottom"
                                name="This will move the employee to the employee details"
                              >
                                <Link>
                                  <div className="Arrows">
                                    <i
                                      className="fa fa-long-arrow-left"
                                      style={{
                                        color: "rgba(47, 128, 237, 1)",
                                        fontSize: "20px",
                                        fontWeight: "500",
                                      }}
                                      aria-hidden="true"
                                      onClick={() => {
                                        setEmployeeData(
                                          employeeData.map((d, i) =>
                                            i === index
                                              ? { ...d, isPayrollDetail: false }
                                              : d
                                          )
                                        );
                                        // newData
                                      }}
                                    />
                                  </div>
                                </Link>
                              </AddToolTip>
                            </Table.Td>

                            <Table.Td>
                              <div className="details d-flex-col marg-left-12">
                                <p className="ft-12 font-weight-400 marg-bot-0">
                                  {ssnMasking(
                                    data.uniquePersonalIdentification
                                  )}
                                </p>
                                <p
                                  className="ft-14 font-weight-500 marg-top-5"
                                  style={{ color: "#2F80ED", width: "100px" }}
                                >
                                  {data.firstName} {data.lastName}
                                </p>
                              </div>
                            </Table.Td>
                            <Table.Td style={{ width: "10%" }}>
                              {data.hours}
                            </Table.Td>
                            <Table.Td style={{ width: "10%" }}>
                              {data.planCompensation}
                            </Table.Td>
                            <Table.Td style={{ width: "10%" }}>
                              {data.grossCompensation}
                            </Table.Td>
                            <Table.Td>
                              {calculateTotalContribution(data)}
                            </Table.Td>
                            <Table.Td>
                              <p>
                                <Link
                                  onClick={() => {
                                    onEditButtonClick(data);
                                    // setFieldValue(fields.Compensation, value);
                                  }}
                                >
                                  Edit
                                </Link>
                              </p>
                            </Table.Td>
                          </Table.Tr>
                        ) : null}
                      </div>
                    ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>

        {/* {data.companyId && (
          <EmployeeListing
            payrollId={payrollId}
            // companyId={data.companyId ? data.companyId : null}
            onViewButtonClick={onViewButtonClick}
            onViewEmployeeWizard={onViewEmployeeWizard}
          />
        )} */}
        <SliderPanel isOpen={isSliderOpen} size="40" showCancel={false}>
          <div>
            <Formik initialValues={Edata} enableReinitialize onSubmit={onSave}>
              {({
                handleChange,
                setFieldValue,
                handleSubmit,
                values,
                ...rest
              }) => {
                return (
                  <>
                    <div className="d-flex justify-content-between align-baseline">
                      <div>
                        <p>Payroll Contributions</p>
                      </div>
                      <div>
                        <Button
                          variant="secondary"
                          onClick={() => setSliderOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="ml-4"
                          onClick={() => {
                            onSave(values);
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                    <div className="bb-1" />
                    <div
                      className="nameAndSSn"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "30px",
                      }}
                    >
                      <div
                        className="ssn-sliderpanel"
                        style={{ fontSize: "12px", fontWeight: "400" }}
                      >
                        {Edata.ssn}
                      </div>
                      <div
                        className="name"
                        style={{
                          fontSize: "14px",
                          color: "#2F80ED",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onViewEmployeeWizard(Edata.employeeId);
                        }}
                      >
                        <p>{ssnMasking(Edata.uniquePersonalIdentification)}</p>
                        {Edata.firstName} {Edata.lastName}
                      </div>
                    </div>
                    <div
                      className="field-title"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        marginTop: "18px",
                        marginBottom: "10px",
                      }}
                    >
                      Pay period hours and compensation
                    </div>

                    <Field
                      style={{
                        width: "91px",
                        height: "36px",
                        borderRadius: "5px",
                        border: "1px solid #BDBDBD",
                      }}
                      size="sm"
                      name={fields.hours}
                      label={"Hours"}
                      placeholder="Hours"
                      autoComplete="off"
                      component={FieldInputNumber}
                      onChange={handleChange}
                    />
                    <Field
                      style={{
                        width: "150px",
                        height: "36px",
                        marginLeft: "20px",
                        borderRadius: "5px",
                        border: "1px solid #BDBDBD",
                      }}
                      name={fields.planCompensation}
                      label="Plan Compensation"
                      autoComplete="off"
                      onChange={handleChange}
                      component={FieldInputDollar}
                    />
                    <Field
                      style={{
                        width: "150px",
                        height: "36px",
                        marginLeft: "20px",
                        borderRadius: "5px",
                        border: "1px solid #BDBDBD",
                      }}
                      name={fields.grossCompensation}
                      label="Gross Compensation"
                      autoComplete="off"
                      onChange={handleChange}
                      component={FieldInputDollar}
                    />
                    <Field
                      style={{
                        width: "150px",
                        height: "36px",
                        marginLeft: "20px",
                        borderRadius: "5px",
                        border: "1px solid #BDBDBD",
                      }}
                      name={fields.annualSalary}
                      label="Annual Salary"
                      autoComplete="off"
                      onChange={handleChange}
                      component={FieldInputDollar}
                    />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "40px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {!isEmpty(Edata.payrollPlans) &&
                          Edata.payrollPlans.map((d, i) => (
                            // <div>{[d.sources]}</div>
                            <div
                              style={{
                                width: "240px",
                                marginTop: "15px",
                                marginLeft: "20px",
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#4F4F4F",
                              }}
                            >
                              <Link
                                onClick={() => {
                                  displaySource(d);
                                }}
                              >
                                {[d.name]}
                              </Link>{" "}
                            </div>
                          ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #D1D1D1",
                          width: "321px",
                          paddingBottom: "20px",
                        }}
                      >
                        <FieldArray name={"payrollPlans"}>
                          {() => (
                            <>
                              {!isEmpty(values.payrollPlans) &&
                                values.payrollPlans.map(
                                  (d, i) =>
                                    !isEmpty(d.sources) &&
                                    d.sources.map((data, index) => (
                                      <div
                                        style={{
                                          marginLeft: "20px",

                                          fontSize: "12px",
                                          fontWeight: "400",
                                        }}
                                      >
                                        {d.id == sourceData.id ? (
                                          <Field
                                            //name={fields.camelCase(data.sourceName)}
                                            label={data.sourceName}
                                            placeholder={
                                              data.contributionAmount != null
                                                ? data.contributionAmount
                                                : 0
                                            }
                                            autoComplete="off"
                                            name={`payrollPlans[${i}].sources[${index}].contributionAmount`}
                                            onChange={handleChange}
                                            component={FieldInputDollar}
                                          />
                                        ) : null}
                                      </div>
                                    ))
                                )}
                            </>
                          )}
                        </FieldArray>
                      </div>
                    </div>
                  </>
                );
              }}
            </Formik>
          </div>
        </SliderPanel>
        <SliderPanel
          isOpen={isModalEmployeeWizardOpen}
          size="80"
          showCancel={false}
        >
          <div className="scroll-body">
            <ManagePayrollLayout buttons={buttons} pageFlow={"edit"}>
              <EmployeeInformationWizard
                data={sidePanelData}
                isSave={isSave}
                isEdit={isEdit}
              />
            </ManagePayrollLayout>
          </div>
        </SliderPanel>
      </div>
    </LoaderWrapper>
  );
};

export default CreatePayrollListingContainer;
