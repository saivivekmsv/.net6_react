import React, { useContext, useState, useEffect } from "react";
import { isEmpty, get } from "lodash";
import { Form, Button, Modal, Image } from "react-bootstrap";
import {
  faTrashAlt,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ManageMaintenanceLayout,
  LoaderWrapper,
  CsplTable as Table,
  FieldDropSide,
  SearchableList,
  CustomColumnMenu,
  MultiSelectDropdown,
} from "../../../components";
import {
  manageMaintenanceFormNames,
  formFields,
  getFlowBasedFormValues,
  getPathWithParam,
  MANAGE_COMPANY_ROUTES,
  FLOW_TYPES,
} from "../../../utils";
import { useDeepEffect, useRouterParams, useRequest } from "../../../abstracts";
import {
  getCompaniesList,
  getScheduleExceptionReportMaster,
  getCompanyPlanPayrollFrequencies,
} from "../../../services";
import {
  manageMaintenanceStore,
  setManagePageLevelData,
} from "../../../contexts";
import { Formik, Field } from "formik";
import ExcelImage from "../../../styles/exportimg.PNG";
import company from "../../../mocks/company.json";
import frequency from "../../../mocks/payrollFrequency.json";
import scheduleExceptionReport from "../../../mocks/scheduleExceptionReport.json";
import { process } from "@progress/kendo-data-query";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Link } from "react-router-dom";

const initialValues = {
  // companyName: "All",
};
const allOption = { label: "All", value: null };
const columns = [
  {
    value: 1,
    label: "Company",
    className: "column-frequency",
    columnName: "company",
    field: "company",
    width: 120,
  },
  {
    value: 2,
    label: "Frequency",
    className: "column-frequency",
    columnName: "frequency",
    field: "frequency",
    width: 120,
  },
  // {
  //   label: "Schedule start date",
  //   className: "column-scheduleStartDate",
  //   columnName: "scheduleStartDate",
  // },
  // {
  //   label: "Schedule end date",
  //   className: "column-scheduleEndDate",
  //   columnName: "scheduleEndDate",
  // },
  {
    value: 3,
    label: "Schedule start date",
    className: "column-scheduleStartDate",
    columnName: "scheduleStartDate",
    field: "scheduleStartDate",
    width: 180,
  },
  {
    value: 4,
    label: "Schedule end date",
    className: "column-scheduleEndDate",
    columnName: "scheduleEndDate",
    field: "scheduleEndDate",
    width: 180,
  },
  {
    value: 5,
    label: "Periods start date",
    className: "column-periodStartDate",
    columnName: "periodStartDate",
    field: "periodsStartDate",
    width: 170,
  },
  {
    value: 6,
    label: "Periods end date",
    className: "column-periodEndDate",
    columnName: "periodEndDate",
    field: "periodsEndDate",
    width: 170,
  },
  {
    value: 7,
    label: "PayDate",
    className: "column-paydate",
    columnName: "payDate",
    field: "payDate",
    width: 123,
  },
  {
    value: 8,
    label: "Action",
    className: "column-action",
    columnName: "action",
    field: "action",
    width: 100,
  },
];

const ScheduleExceptionReportContainer = (props) => {
  const { flow } = useRouterParams();
  const { state, dispatch } = useContext(manageMaintenanceStore);
  const [isLoading] = useState(false);
  const [final, setFinal] = useState([]);
  const [filteredValues, setFilteredValues] = useState([]);
  const { response, loading } = useRequest({
    method: getScheduleExceptionReportMaster,
    defaultResponse: filteredValues,
  });
  const formName = manageMaintenanceFormNames.SCHEDULE_EXCEPTION_REPORT;
  const fields = formFields[formName];
  const [fieldValues, setFieldValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [recordToDelete, setRecordToDelete] = useState({});
  const [dataChange, setDataChange] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [skip, setSkip] = React.useState(0);
  const [take, setTake] = React.useState(10);
  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: scheduleExceptionReport.length,
  });
  const [result, setResult] = React.useState(
    scheduleExceptionReport,
    dataState
  );
  const onDataStateChange = (event) => {
    setDataState(event.dataState);
    setResult(process(scheduleExceptionReport, event.dataState));
  };

  const showManageColumns = () => {
    let x = document.getElementsByClassName("manage-column-dropdown");
    let y = x[0].style.display;
    if (y === "none") {
      x[0].style.display = "block";
    } else {
      x[0].style.display = "none";
    }
  };
  const _export = React.useRef(null);

  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save(result, selectedColumns);
    }
  };

  const onColumnsSubmit = (columnsState) => {
    setSelectedColumns(columnsState);
  };
  const applyColumns = () => {
    if (selectedColumns.length >= 1) {
      setFinal(
        columns.filter((column) =>
          selectedColumns.map((x) => x).includes(column.value)
        )
      );
    }
  };
  const companyId = 226;
  const [payrollFrequencies, setpayrollFrequencies] = useState([]);
  const { response: companies, loading: companyLoading } = useRequest({
    method: getCompaniesList,
    payload: 1, //TenantId, Hardcoding should be removed
    defaultResponse: [],
  });

  const { response: data } = useRequest({
    method: getCompanyPlanPayrollFrequencies,
    defaultResponse: [],
  });

  useEffect(() => {
    setFilteredValues(scheduleExceptionReport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDeepEffect(() => {
    setSelectedColumns(columns.map((item) => item.value));
    setFinal(columns);
  }, []);
  const onFormSubmit = (values) => {
    dispatch(
      setManagePageLevelData({
        formName: formName,
        fieldData: values,
      })
    );
  };

  const removeOne = (item) => {
    setIsModalOpen(true);
    setRecordToDelete(item);
  };

  const onDeleteConfirmClick = () => {
    const selectedId = get(recordToDelete, "id");
    setFilteredValues(
      filteredValues.filter((item) => {
        return item.id !== selectedId;
      })
    );
    setIsModalOpen(false);
    setRecordToDelete({});
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setRecordToDelete({});
  };

  const actionCell = (props) => {
    const { dataItem } = props;
    return (
      <div className="marg-top-10 marg-left-20">
        <Link
          to={getPathWithParam({
            path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES,
            pathParam: [FLOW_TYPES.EDIT, companyId, dataItem.id, 0],
          })}
          style={{ color: "royalblue" }}
        >
          Correct
        </Link>
      </div>
    );
  };

  return (
    <ManageMaintenanceLayout>
      <LoaderWrapper isLoading={loading}>
        {!loading && !isEmpty(response) && (
          <div className="w-100 maintenance-container">
            <div className="title-case">
              Schedule Extension Exception Report
            </div>
            <Formik
              initialValues={{
                ...initialValues,
                ...getFlowBasedFormValues(get(state, formName, {}), flow),
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
                values,
                ...rest
              }) => {
                const onCompanyChange = (value, plan) => {
                  setFieldValue(
                    fields.companyName,
                    value || value === 0 ? companies[value].name : "All"
                  );
                  if (value !== null) {
                    let filteredpayroll = data.payrollFrequencies.filter(
                      (e) => {
                        return e.companyId == companies[value].id;
                      }
                    );
                    setFieldValue(fields.frequency, "");
                    setpayrollFrequencies(filteredpayroll);
                  }
                };

                return (
                  <Form
                    autoComplete="off"
                    className="h-100"
                    onSubmit={handleSubmit}
                    validated={!isEmpty(rest.errors)}
                  >
                    <div className="d-flex justify-content-start">
                      <Field
                        size="smdd"
                        isRequired
                        label="Company name"
                        name={fields.companyName}
                        value={values[fields.companyName]}
                        placeholder="All"
                        direction="bottom"
                        popupContent={
                          <SearchableList
                            label="Select Company"
                            options={[
                              allOption,
                              ...companies.map((company, index) => ({
                                label: company.name,
                                value: index,
                              })),
                            ]}
                            name={fields.companyName}
                            onSelect={(value) => onCompanyChange(value, null)}
                            selectedValue={values[fields.companyName]}
                          />
                        }
                        component={FieldDropSide}
                      />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Field
                        label="Frequency"
                        isRequired
                        options={payrollFrequencies}
                        placeholder="All"
                        name={fields.frequency}
                        value={values[fields.frequency]}
                        direction="right"
                        popupContent={
                          <SearchableList
                            label="Select Frequency"
                            options={payrollFrequencies}
                            onSelect={(value) =>
                              setFieldValue(fields.frequency, value)
                            }
                            selectedValue={values[fields.frequency]}
                            name={fields.frequency}
                            // isNotTypeAhead
                            isRadio
                          />
                        }
                        component={FieldDropSide}
                      />
                      <Button
                        style={{
                          height: "36px",
                          width: "100px",
                          marginLeft: "20px",
                          marginTop: "30px",
                        }}
                      >
                        Search
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>

            <div className="d-flex marg-bot-15">
              <div
                style={{
                  diplay: "flex",
                  flexDirection: "column",
                  marginLeft: "70%",
                }}
              >
                <div>
                  <Button
                    variant="secondary"
                    className="column-header"
                    onClick={showManageColumns}
                  >
                    <span className="marg-right-6">
                      <i class="fal fa-columns"></i>
                    </span>
                    Column
                  </Button>
                </div>
                <div
                  className="manage-column-dropdown"
                  style={{ display: "none" }}
                >
                  <div className="manage-columns">
                    <p className="manage-columns-button"> Manage columns</p>
                    <p className="apply-button" onClick={applyColumns}>
                      Apply
                    </p>
                  </div>
                  <MultiSelectDropdown
                    hideSelectedOptions="FALSE"
                    width="269px"
                    height="250px"
                    maxHeight="459px"
                    position="absolute"
                    background="white"
                    zIndex="2"
                    options={columns}
                    onSelect={(value) => {
                      setSelectedColumns(value);
                    }}
                    name={"Columns"}
                    value={selectedColumns}
                    // disabled={}
                    //isTypeAhead={isEdit}
                  />
                </div>
              </div>
              <div className="ft-12 grey-text font-weight-500 marg-right-5">
                <Button
                  className="export-button"
                  title="Export Excel"
                  variant="secondary"
                  style={{ border: "none" }}
                  onClick={excelExport}
                >
                  <Image src={ExcelImage} width="20px" />
                  Export
                </Button>
              </div>
            </div>

            <div className="report-table-kendo" style={{ width: "1060px" }}>
              <ExcelExport ref={_export}>
                <Grid
                  //scrollable={true}
                  //data={tableContent.slice(skip, skip + take)}
                  data={result}
                  //pageable={true}
                  skip={skip}
                  take={take}
                  //onPageChange={onPageChange}
                  total={scheduleExceptionReport.length}
                  //filterable={true}
                  //sortable={true}
                  columnVirtualization={true}
                  onDataStateChange={onDataStateChange}
                  {...dataState}
                  style={{ maxHeight: "410px" }}
                >
                  {final.map((column, idx) => (
                    <GridColumn
                      key={idx}
                      field={column.field}
                      width={column.width}
                      title={column.label}
                      // filter={"numeric"}
                      cell={column.field === "action" && actionCell}
                      columnMenu={(props) => (
                        <CustomColumnMenu
                          {...props}
                          columns={selectedColumns}
                          onColumnsSubmit={onColumnsSubmit}
                          tableData={scheduleExceptionReport}
                        />
                      )}
                    />
                  ))}
                </Grid>
              </ExcelExport>
            </div>
          </div>
        )}
      </LoaderWrapper>
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
              <h4>Delete Company ?</h4>
              <p>
                You are attempting to delete company from file. Do you wish to
                Delete ?
              </p>
              <br />
              <Button
                className="remove-btn mr-4"
                onClick={onDeleteConfirmClick}
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
  );
};

export default ScheduleExceptionReportContainer;
