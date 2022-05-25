import React, { useState } from "react";
import { isEmpty, get } from "lodash";
import { Form, Button, Image } from "react-bootstrap";
import { Formik, Field } from "formik";
import {
  FieldInput,
  SearchableList,
  FieldDropSide,
  DatePicker,
  ManageReportLayout,
  MultiSelectDropdown,
  LoaderWrapper,
} from "../../../components";
import {
  manageReportsFormNames,
  formFields,
  usDateFormat,
  clearFieldValues,
  ssnMasking,
} from "../../../utils";
import {
  getDownloadEmploymentStatusReport,
  getEmploymentStatusReportInfo,
  getCompaniesDropDown,
  getPlansDropDown,
} from "../../../services";
import { useDeepEffect, useRequest } from "../../../abstracts";
import ExcelImage from "../../../styles/exportimg.PNG";
import * as fileSaver from "file-saver";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { ColumnMenu } from "../402ContributionLimit/columnMenu";
import { Tooltip } from "@progress/kendo-react-tooltip";

const initialValues = {
  companyName: "Select One",
  companyId: null,
  planName: "All",
};

const selectOne = { label: "Select One", value: null };
const allOption = { label: "All", value: null };

class ProductNameHeader extends React.Component {
  render() {
    return (
      <a className="k-link" onClick={this.props.onClick}>
        <span title={this.props.title}>{this.props.title}</span>
        {this.props.children}
      </a>
    );
  }
}

const columns = [
  {
    value: 1,
    label: "Company name",
    className: "column-companyName",
    columnName: "companyName",
    field: "companyName",
    width: 233,
    dataType: "alphaNumeric",
    field1: "companyName",
  },
  {
    value: 2,
    label: "Plan ID",
    className: "column-planId",
    columnName: "planId",
    field: "planName",
    width: 111,
    dataType: "alphaNumeric",
    field1: "planName",
  },
  {
    value: 3,
    label: "SSN",
    className: "column-ssn",
    columnName: "ssn",
    field: "ssn",
    width: 183,
    dataType: "alphaNumeric",
    field1: "ssn",
  },
  {
    value: 4,
    label: "First name",
    className: "column-firstName",
    columnName: "firstName",
    field: "firstName",
    width: 164,
    dataType: "alphaNumeric",
    field1: "firstName",
  },
  {
    value: 5,
    label: "Last name",
    className: "column-lastName",
    columnName: "lastName",
    field: "lastName",
    width: 169,
    dataType: "alphaNumeric",
    field1: "lastName",
  },
  {
    value: 6,
    label: "Prior Status",
    className: "column-priorStatus",
    columnName: "priorStatus",
    field: "priorStatus",
    width: 169,
    dataType: "alphaNumeric",
    field1: "priorStatus",
  },
  {
    value: 7,
    label: "Updated Status",
    className: "column-updatedStatus",
    columnName: "updatedStatus",
    field: "updatedStatus",
    width: 169,
    dataType: "alphaNumeric",
    field1: "updatedStatus",
  },
  {
    value: 8,
    label: "Updated date & time",
    className: "column-date",
    columnName: "updatedDate",
    field: "date",
    width: 289,
    dataType: "date",
    field1: "updatedDateTimeFrom",
    field2: "updatedDateTimeTo",
  },
];

const EmployementStatus = (props) => {
  const formName = manageReportsFormNames.EMPLOYEMENT_STATUS;
  const fields = formFields[formName];
  const [final, setFinal] = useState(columns);
  const [toggle, setToggle] = useState(false);
  const [filteredValues, setFilteredValues] = useState({
    from: 1,
    count: 10,
  });
  const [dataChange, setDataChange] = useState([]);
  const [displayColumns, setDisplayColumns] = useState([]);
  const [totalRecord, setTotalRecord] = useState();
  const [trigger, setTrigger] = useState(true);

  const [selectedColumns, setSelectedColumns] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
  ]);
  const [companyList, setCompanyList] = useState("");
  const [gridFilters, setGridFilters] = useState();
  const [isScroll, setIsScroll] = useState(false);
  const [tableContent, setTableContent] = useState([]);
  const [lastScrollTop, setLastScrollTop] = useState(null);
  const [planList, setPlanList] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [sorting, setSorting] = useState();
  const [dataLoading, setDataLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { response: companies } = useRequest({
    method: getCompaniesDropDown,
    defaultResponse: [],
  });

  const exportReportFile = () => {
    var column = columns.filter(
      (column) => !final.map((item) => item.value).includes(column.value)
    );
    var data = column.map((item) => item.value);
    getDownloadEmploymentStatusReport({
      ...filteredValues,
      selectedColumns: data,
    })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "EmploymentStatusChangeReport.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving Employment Status Report");
      });
  };

  const apiCall = (data) => {
    setDataLoading(true);
    getEmploymentStatusReportInfo(data)
      .then((response) => {
        setDataLoading(false);
        setTableContent(response.employmentStatusReportDetails);
        setTotalRecord(response.count);
        if (response.count > 0) {
          setIsScroll(true);
        }
      })
      .catch((error) => {
        setDataLoading(false);

        //handle error
      });
  };

  useDeepEffect(() => {
    if (!isEmpty(companyList)) {
      setFilteredValues({
        ...filteredValues,
        innerFilters: gridFilters,
      });
      apiCall({ ...filteredValues, innerFilters: gridFilters });
    }
  }, [gridFilters]);

  const onSubmit = (values) => {
    setGridFilters(null);
    if (values.companyId !== null) {
      setCompanyList(values.companyName);
      setPageCount(1);
      setIsScroll(true);
      //setTableContent([]);
      var filters = {
        companyId: values.companyId,
        planId:
          planList.length === 1
            ? planList[0].planId
            : !values.planId
            ? 0
            : values.planId,
        nameOrSsn: values.nameOrSsn,
        fromDate: values.fromDate,
        toDate: values.toDate,
        from: 1,
        count: 20,
        innerFilters: null,
        selectedColumns: selectedColumns,
      };
      setFilteredValues(filters);
      apiCall(filters);
      // setToggle(!toggle);
    } else {
      setIsScroll(false);
      setTableContent([]);
      setCompanyList("");
    }
  };

  const scrollHandler = (event) => {
    const e = event.nativeEvent;
    if (lastScrollTop === e.target.scrollTop) {
      return;
    }
    setLastScrollTop(e.target.scrollTop);
    if (
      e.target.scrollTop + 20 >=
      e.target.scrollHeight - e.target.clientHeight
    ) {
      if (isScroll) {
        var fromCount = pageCount * 20 + 1;
        var filters = {
          companyId: filteredValues.companyId,
          planId:
            planList.length === 1
              ? planList[0].planId
              : !filteredValues.planId
              ? 0
              : filteredValues.planId,
          nameOrSsn: filteredValues.nameOrSsn,
          eligibilityStatus: filteredValues.eligibilityStatus,
          from: fromCount,
          count: 20,
          innerFilters: gridFilters,
        };
        setToggle(!toggle);
        setPageCount(pageCount + 1);
        setDataLoading(true);

        getEmploymentStatusReportInfo(filters)
          .then((response) => {
            setDataLoading(false);

            if (response === []) {
              setIsScroll(false);
            }
            setTableContent([
              ...tableContent,
              ...response.employmentStatusReportDetails,
            ]);
          })
          .catch((error) => {
            //handle error
            setDataLoading(false);
          });
      }
    }
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
  const hideColumns = () => {
    setSelectedColumns(final.map((item) => item.value));

    let x = document.getElementsByClassName("manage-column-dropdown");
    let y = x[0].style.display;
    if (y === "block") {
      x[0].style.display = "none";
    } else {
      x[0].style.display = "block";
    }
  };

  document.addEventListener("mouseup", function (e) {
    let container = document.getElementsByClassName("manage-column-dropdown");
    let button = document.getElementsByClassName("column-header");
    if (container[0] && !container[0]?.contains(e.target)) {
      container[0].style.display = "none";
    }
  });

  const applyColumns = () => {
    if (selectedColumns.length >= 1) {
      setFinal(
        columns.filter((column) =>
          selectedColumns.map((x) => x).includes(column.value)
        )
      );
    }
    hideColumns();
  };

  const renderValue = (value) => {
    value = value?.dataItem ? value.dataItem[value.field] : value;
    return <td>{value ? <div>{value}</div> : <div> -</div>}</td>;
  };

  const ssnGridCell = (props) => {
    var value = ssnMasking(props.dataItem.ssn);
    return renderValue(value);
  };

  const dateForm = (props) => {
    var value = usDateFormat(props.dataItem[props.field]);
    return renderValue(value);
  };

  return (
    <ManageReportLayout rptName="Employement Status">
      <div className="w-100 reports-container min-width-200">
        <div className="min-width-200">
          <Formik
            initialValues={{
              ...initialValues,
            }}
            onSubmit={onSubmit}
            enableReinitialize
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({
              handleChange,
              setFieldValue,
              handleSubmit,
              values,
              setValues,
              ...rest
            }) => {
              const onDaySelected = (fieldName, value) => {
                setFieldValue(fieldName, value);
              };

              const onCompanyChange = (value) => {
                setValues({
                  ...clearFieldValues({
                    values: values,
                    fieldsToClear: [fields.planId, fields.planName],
                  }),
                  [fields.companyId]:
                    value || value === 0
                      ? parseInt(companies[value].companyId)
                      : null,
                  [fields.companyName]:
                    value || value === 0
                      ? companies[value].companyName
                      : "Select One",
                });
                getPlansDropDown(get(companies[value], "companyId", 0))
                  .then((response) => {
                    setPlanList(response);
                  })
                  .catch((error) => {
                    //Handle Error
                  });
              };

              const onPlanChange = (value) => {
                if (value || value === 0) {
                  setFieldValue(
                    fields.planId,
                    parseInt(planList[value].planId)
                  );
                  setFieldValue(fields.planName, planList[value].planName);
                } else {
                  setFieldValue(fields.planId, null);
                  setFieldValue(fields.planName, "All");
                }
              };
              return (
                <Form
                  autoComplete="off"
                  className="mb-20 mt-10"
                  onSubmit={handleSubmit}
                  validated={!isEmpty(rest.errors)}
                >
                  <div className="d-flex align-item-center justify-content-between">
                    <div className="d-flex mr-4">
                      <Field
                        size="smdd"
                        isRequired
                        label="Company name *"
                        name={fields.companyName}
                        value={values[fields.companyName]}
                        placeholder="Select One"
                        direction="bottom"
                        validate={(value) =>
                          ["", undefined, null, "Select One"].includes(value)
                            ? "Select a company"
                            : null
                        }
                        popupContent={
                          <SearchableList
                            label="Select Company"
                            options={
                              companies && [
                                selectOne,
                                ...companies.map((company, index) => ({
                                  label: company.companyName,
                                  value: index,
                                })),
                              ]
                            }
                            onSelect={(value) => onCompanyChange(value)}
                            selectedValue={values[fields.companyName]}
                          />
                        }
                        component={FieldDropSide}
                      />
                      {/* <div className="d-flex ml-3 mr-2">
                        <Field
                          size="sm"
                          isRequired
                          label="Plan ID"
                          noLabelTransform
                          name={fields.planName}
                          value={
                            planList?.length > 1
                              ? values[fields.planName]
                                ? values[fields.planName]
                                : "All"
                              : planList[0]?.planName
                          }
                          direction="bottom"
                          popupContent={
                            <SearchableList
                              label="Select Plan ID"
                              options={
                                planList && [
                                  allOption,
                                  ...planList.map((plan, index) => ({
                                    label: plan.planName,
                                    value: index,
                                  })),
                                ]
                              }
                              onSelect={(value) => onPlanChange(value)}
                              selectedValue={
                                planList?.length > 1
                                  ? values[fields.planName]
                                    ? values[fields.planName]
                                    : "All"
                                  : planList[0]?.planName
                              }
                            />
                          }
                          component={FieldDropSide}
                        />
                      </div> */}
                      <div className="d-flex ml-3 mr-2">
                        <Field
                          size="md"
                          label="&nbsp;"
                          placeholder="Search SSN, Name"
                          label="Search"
                          isRequired
                          name={fields.nameOrSsn}
                          type="text"
                          autoComplete="off"
                          value={values[fields.nameOrSsn]}
                          onChange={handleChange}
                          component={FieldInput}
                        />
                      </div>
                      <div className="d-flex ml-3 mr-2">
                        <Field
                          size="smdd"
                          label="From date"
                          isRequired
                          name={fields.fromDate}
                          //placeholder="To"
                          value={usDateFormat(values[fields.fromDate])}
                          direction="bottom"
                          isDatePicker
                          onClear={() => setFieldValue(fields.fromDate, null)}
                          popupContent={
                            <DatePicker
                              onDayClick={(value) =>
                                onDaySelected(fields.fromDate, value)
                              }
                              value={values[fields.fromDate]}
                            />
                          }
                          component={FieldDropSide}
                        />
                      </div>
                    </div>
                    <Button
                      className="ml-2 mt-12 sort-button"
                      style={{ lineHeight: "19px", marginRight: "20%" }}
                      variant="secondary"
                      type="submit"
                    >
                      Search
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
        <div className="d-flex justify-content-between align-center divSpace header-button min-width-200">
          <div className="d-flex flex-col">
            <div
              style={{ fontSize: "14px", color: "#828282", paddingTop: "6px" }}
            >
              {companyList ? `Showing result for ${companyList} company` : null}
            </div>
            <div className="ft-12 grey-text font-weight-500">
              {totalRecord} Records found
            </div>
          </div>
          <div className="d-flex pad-top-10">
            <div style={{ diplay: "flex", flexDirection: "column" }}>
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
                  <p
                    className="apply-button"
                    onClick={() => {
                      hideColumns();
                      setTrigger(!trigger);
                    }}
                  >
                    Close
                  </p>
                </div>
                <div>
                  <MultiSelectDropdown
                    hideSelectedOptions="FALSE"
                    width="269px"
                    height="200px"
                    maxHeight="300px"
                    position="absolute"
                    background="white"
                    zIndex="2"
                    options={columns}
                    onSelect={(value) => {
                      setSelectedColumns(value);
                    }}
                    name={"Columns"}
                    value={selectedColumns}
                    trigger={trigger}
                    // disabled={}
                    // isTypeAhead={isEdit}
                  />
                </div>
                <div style={{ marginTop: "220px", paddingLeft: "100px" }}>
                  <Button onClick={applyColumns}>Apply</Button>
                </div>
              </div>
            </div>
            <div className="ft-12 grey-text font-weight-500 marg-right-5">
              <Button
                className="export-button"
                title="Export Excel"
                variant="secondary"
                style={{ border: "none" }}
                onClick={() => exportReportFile()}
              >
                <Image src={ExcelImage} width="20px" />
                Export
              </Button>
            </div>
          </div>
        </div>
        <div className="table-width grid-overflow" style={{ minWidth: "0px" }}>
          <ExcelExport data={tableContent}>
            <LoaderWrapper isLoading={dataLoading}>
              <Tooltip
                openDelay={100}
                position="bottom"
                anchorElement="element"
              >
                <Grid
                  data={tableContent}
                  total={tableContent.length}
                  resizable={true}
                  onScroll={scrollHandler}
                  style={{ height: "400px" }}
                  fixedScroll
                >
                  {final.map((column, idx) => (
                    <GridColumn
                      key={idx}
                      field={column.field}
                      width={column.width}
                      title={column.label}
                      filter={column.dataType}
                      cell={
                        (column.field === "ssn" && ssnGridCell) ||
                        (column.dataType === "date" && dateForm) ||
                        renderValue
                      }
                      headerCell={ProductNameHeader}
                      columnMenu={(props) =>
                        !isEmpty(tableContent) ? (
                          <ColumnMenu
                            {...props}
                            fields={fields}
                            sorting={sorting}
                            setSorting={setSorting}
                            gridFilters={gridFilters}
                            setGridFilters={setGridFilters}
                            field1={column.field1}
                            field2={column.field2 ? column.field2 : null}
                            columns={selectedColumns}
                          />
                        ) : null
                      }
                    />
                  ))}
                </Grid>
              </Tooltip>
            </LoaderWrapper>
          </ExcelExport>
        </div>
      </div>
    </ManageReportLayout>
  );
};

export default EmployementStatus;
