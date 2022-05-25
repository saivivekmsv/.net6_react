import React, { useContext, useState } from "react";
import { find, get, isEmpty, intersectionWith, isEqual } from "lodash";
import { Row, Col, Form, Nav } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldInput,
  FieldButtonGroup,
  CsplTable as Table,
  FieldDropSide,
  SearchableList,
  FormControlSearch,
} from "../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  required,
  yesNoOptions,
  FORM_PLACEHOLDERS,
  getFormattedPhone,
  getPathWithParam,
  getAdvancedPathWithParam,
  usDateFormat,
} from "../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  setManagePlanFlow,
  setManagePageLevelData,
  savePlanDetailsAction,
} from "../../contexts";
import AddToolTip from "../../components/AddToolTip";
import { useRouterParams, useRequest, useDeepEffect } from "../../abstracts";
import {
  CompanyanddPlanWiseEnrollmentReport,
  ParticipantwiseReport,
} from "../../services";
const initialValues = {};
const allOption = { label: "All", value: null };
const EnrollmentDetailReportContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { flow, planId, companyId } = useRouterParams();
  const [employeesList1, setEmployeesList1] = useState([]);
  const [filterResponse, setFilterResponse] = useState([]);
  const [filterResponse1, setFilterResponse1] = useState([]);
  const [filterResponse2, setFilterResponse2] = useState([]);
  const [toggle, setToggle] = useState(false);
  const formName = managePlanFormNames.ENROLLMENT_DETAIL_REPORT;
  const fields = formFields[formName];
  const formValues = {};
  const planList = ["Enrolled", "Not Enrolled"];
  const sourceList = ["Pre Tax", "Roth", "After Tax"];
  const columns = [
    {
      label: "Company Name",
      className: "column-companyName",
      columnName: "companyName",
    },
    {
      label: "Plan ID",
      className: "column-planId",
      columnName: "planID",
    },
    {
      label: "Plan Name",
      className: "column-planName",
      columnName: "planName",
    },
    {
      label: "Participants Enrolled",
      className: "column-participantsEnrolled",
      columnName: "participantsEnrolled",
    },
    {
      label: "Participants Not Enrolled",
      className: "column-participantsNotEnrolled",
      columnName: "participantsNotEnrolled",
    },
    {
      label: "Process Date",
      className: "column-processdate",
      columnName: "processDate",
    },
    {
      label: "Hosted Mode",
      className: "column-hostedMode",
      columnName: "hostedMode",
    },
  ];
  const columns1 = [
    {
      label: "Participant Name",
      className: "column-participantName col-md-2",
      columnName: "participantName",
    },
    {
      label: "Source Name",
      className: "column-sourceName col-md-2",
      columnName: "sourceName",
    },
    {
      label: "Status",
      className: "column-status",
      columnName: "status",
    },
    {
      label: "Entry date",
      className: "column-entryDate",
      columnName: "entryDate",
    },
    {
      label: "Enrollment date",
      className: "column-enrollmentDate",
      columnName: "enrollmentDate",
    },
    {
      label: "Reason",
      className: "column-reason",
      columnName: "reason",
    },
  ];
  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {};
  const { response: employeesList } = useRequest({
    method: CompanyanddPlanWiseEnrollmentReport,
    payload: { planId: planId, companyId: companyId },
    defaultResponse: [],
  });
  const getData = (item, source) => {
    let dataItem;
    if (item.columnName == "processDate" || item.columnName == "entryDate") {
      dataItem = usDateFormat(source[item.columnName]);
    } else if (item.columnName == "enrollmentDate") {
      dataItem = source["status"]
        ? usDateFormat(source[item.columnName])
        : "NA";
    } else {
      dataItem = source[item.columnName];
    }
    return <AddToolTip name={dataItem} />;
  };
  // const { response: employeesList1 } = useRequest({
  //   method: ParticipantwiseReport,
  //   payload: { planId: planId, companyId: companyId },
  //   defaultResponse: [],
  // });

  useDeepEffect(() => {
    ParticipantwiseReport({ planId: planId, companyId: companyId }).then(
      (response) => {
        //console.log(response)
        setEmployeesList1(response);
        setFilterResponse(response);
        setFilterResponse1(response);
        setFilterResponse2(response);
      }
    );
  }, []);

  const SearchByStatus = (value) => {
    if (value != null && value != "All") {
      setFilterResponse(employeesList1.filter((x) => x.status === value));
      //setEmployeesList1(employeesList1.filter(x=>x.status===value))
    } else setFilterResponse(filterResponse1);
  };
  const SearchBySource = (value) => {
    if (value != null && value != "All") {
      setFilterResponse(employeesList1.filter((x) => x.sourceName === value));
      // setEmployeesList1(employeesList1.filter(x=>x.sourceName===value))
    } else setFilterResponse(filterResponse1);
  };
  const searchByField = (value) => {
    const val = value.target.value;
    if (val.length > 0) {
      const searchList = employeesList1.filter((f) =>
        f.participantName.toLowerCase().includes(val.toLowerCase())
      );
      // setEmployeesList1(searchList)
      return setFilterResponse(searchList);
    } else setFilterResponse(filterResponse1);
  };
  //  useDeepEffect(() =>
  //  {
  //    ParticipantwiseReport({planId:planId,companyId:companyId}).then((response)=>{
  //      //console.log(response)
  //      setFilterResponse(intersectionWith(filterResponse1,filterResponse2,isEqual))
  //    })
  //  },[SearchByStatus,searchByField])

  return (
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
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        setValues,
        values,
        ...rest
      }) => {
        console.log(values);
        let st1 = "col-md-2";
        return (
          <div className="employee-container">
            <div className="mt-20 plan-heading font-weight-500">Enrollment</div>
            <div className="line-separator" />

            <div>
              <div className="w-100">
                <p className="font-weight-500">Enrollment Detail Report</p>
              </div>
              <Form
                autoComplete="off"
                className="h-100"
                onSubmit={handleSubmit}
                validated={!isEmpty(rest.errors)}
              >
                <Table className="cspl-table">
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
                  <Table.Tbody>
                    <Table.Tr>
                      {columns.map((item, cellIndex) => {
                        return (
                          <Table.Td key={cellIndex} className={item.className}>
                            {getData(item, employeesList)}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
                <div className="d-flex w-100">
                  <div className="d-flex ml-2  " style={{ marginTop: "30px" }}>
                    <FormControlSearch
                      label="Search"
                      size="lm"
                      id="plan-search-box"
                      className={"plan-search-box"}
                      type="search"
                      autoComplete="off"
                      placeholder="Search"
                      onChange={searchByField}
                    />
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div className="d-flex ml-2 border-cut">
                    <Field
                      label="Source"
                      name={fields.enrollsource}
                      value={values[fields.enrollsource]}
                      direction="bottom"
                      isRequired
                      size="smd"
                      placeholder="All"
                      popupContent={
                        <SearchableList
                          label="Select Source"
                          options={
                            sourceList && [
                              allOption,
                              ...sourceList.map((source, index) => ({
                                label: source,
                                value: source,
                              })),
                            ]
                          }
                          onSelect={(value) => {
                            SearchBySource(value);
                            setValues({ ...values, enrollsource: value });
                          }}
                          selectedValue={values[fields.enrollsource]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div className="d-flex ml-2 border-cut">
                    <Field
                      label="Enroll Status"
                      name={fields.enrollstatus}
                      value={values[fields.enrollstatus]}
                      direction="bottom"
                      isRequired
                      size="smd"
                      placeholder="All"
                      popupContent={
                        <SearchableList
                          label="Select Status"
                          options={
                            planList && [
                              allOption,
                              ...planList.map((plan, index) => ({
                                label: plan,
                                value: plan,
                              })),
                            ]
                          }
                          onSelect={(value) => {
                            SearchByStatus(value);
                            setValues({ ...values, enrollstatus: value });
                          }}
                          selectedValue={values[fields.enrollstatus]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  </div>
                </div>
                <Table className="cspl-table">
                  <Table.Thead>
                    <Table.Tr>
                      {columns1.map((item, index) => {
                        return (
                          <Table.Th key={index} className={item.className}>
                            {item.label}
                          </Table.Th>
                        );
                      })}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody style={{ height: "300px" }}>
                    {filterResponse &&
                      filterResponse.map((source, index) => {
                        return (
                          <Table.Tr key={index}>
                            {columns1.map((item, cellIndex) => {
                              return (
                                <Table.Td
                                  key={cellIndex}
                                  className={item.className}
                                >
                                  {getData(item, source)}
                                </Table.Td>
                              );
                            })}
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default EnrollmentDetailReportContainer;
