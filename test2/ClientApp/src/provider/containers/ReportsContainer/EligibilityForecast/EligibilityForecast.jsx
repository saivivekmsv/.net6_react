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
  getEligibilityForecastReportInfo,
  getDownloadEligibilityForecastReport,
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
    label: "Plan ID",
    className: "column-planId",
    columnName: "planId",
    field: "planName",
    width: 111,
    dataType: "alphaNumeric",
    field1: "planName",
  },
  {
    value: 2,
    label: "SSN",
    className: "column-ssn",
    columnName: "ssn",
    field: "ssn",
    width: 133,
    dataType: "alphaNumeric",
    field1: "ssn",
  },
  {
    value: 3,
    label: "First name",
    className: "column-firstName",
    columnName: "firstName",
    field: "firstName",
    width: 144,
    dataType: "alphaNumeric",
    field1: "firstName",
  },
  {
    value: 4,
    label: "Last name",
    className: "column-lastName",
    columnName: "lastName",
    field: "lastName",
    width: 149,
    dataType: "alphaNumeric",
    field1: "lastName",
  },
  {
    value: 5,
    label: "Source name",
    className: "column-sourceName",
    columnName: "sourceName",
    field: "sourceName",
    width: 226,
    dataType: "alphaNumeric",
    field1: "sourceName",
  },
  {
    value: 6,
    label: "Eligibility Criteria",
    className: "column-eligibilityCriteria",
    columnName: "eligibilityCriteria",
    field: "eligibilityCriteria",
    width: 226,
    dataType: "alphaNumeric",
    field1: "eligibilityCriteria",
  },
  {
    value: 7,
    label: "Forecasted Eligibility Requirement met date",
    className: "column-requirementMetDate",
    columnName: "requirementMetDate",
    field: "requirementMetDate",
    width: 221,
    dataType: "date",
    field1: "requirementMetDateFrom",
    field2: "requirementMetDateTo",
    //columnMenu: ColumnMenuCustomDateColumn,
  },
  {
    value: 8,
    label: "Forecasted Entry Date",
    className: "column-forecastedEntryDate",
    columnName: "forecastedEntryDate",
    field: "forecastedEntryDate",
    width: 221,
    dataType: "date",
    field1: "forecastedEntryDateFrom",
    field2: "forecastedEntryDateTo",
  },
];

const EligibilityForecast = (props) => {
  const formName = manageReportsFormNames.ELIGIBILITY_FORECAST;
  const fields = formFields[formName];
  const [companyList, setCompanyList] = useState("");
  const [planList, setPlanList] = useState([]);
  const [final, setFinal] = useState(columns);
  const [toggle, setToggle] = useState(false);
  const [filteredValues, setFilteredValues] = useState({
    from: 1,
    count: 20,
  });
  const [gridFilters, setGridFilters] = useState();
  const [sorting, setSorting] = useState();
  const [totalRecord, setTotalRecord] = useState();
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

  const [tableContent, setTableContent] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(null);
  const [trigger, setTrigger] = useState(true);

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

  const { response: companies } = useRequest({
    method: getCompaniesDropDown,
    defaultResponse: [],
  });

  const apiCall = (data) => {
    setDataLoading(true);
    getEligibilityForecastReportInfo(data)
      .then((response) => {
        setDataLoading(false);
        setTableContent(response.eligibilityForecastReportDetails);
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
        search: values.search,
        asOfDate: values.asOfDate,
        from: 1,
        count: 20,
        innerFilters: null,
        selectedColumns: selectedColumns,
      };
      setFilteredValues(filters);
      apiCall(filters);
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
          search: filteredValues.search,
          asOfDate: filteredValues.asOfDate,
          from: 1,
          count: 20,
          innerFilters: gridFilters,
        };
        setToggle(!toggle);
        setPageCount(pageCount + 1);

        setDataLoading(true);
        getEligibilityForecastReportInfo(filters)
          .then((response) => {
            setDataLoading(false);
            if (response === []) {
              setIsScroll(false);
            }
            setTableContent([...tableContent, ...response]);
          })
          .catch((error) => {
            setDataLoading(false);
            //handle error
          });
      }
    }
  };

  const exportReportFile = () => {
    var column = columns.filter(
      (column) => !final.map((item) => item.value).includes(column.value)
    );
    var data = column.map((item) => item.value);
    getDownloadEligibilityForecastReport({
      ...filteredValues,
      selectedColumns: data,
    })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "EligibilityForecastReport.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving Eligibility Forecast Report");
      });
  };

  const renderValue = (value) => {
    value = value?.dataItem ? value.dataItem[value.field] : value;
    return <td>{value ? <div>{value}</div> : <div>- </div>}</td>;
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
    <ManageReportLayout rptName="Forecasted Eligibility Report">
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
              setValues,
              values,
              ...rest
            }) => {
              const onDaySelected = (fieldName, value) => {
                setFieldValue(fieldName, value);
              };

              const onCompanyChange = (value) => {
                setValues({
                  ...clearFieldValues({
                    //values: values,
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
                        size="sm"
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
                      <div className="d-flex ml-4 mr-1">
                        <Field
                          size="sm"
                          isRequired
                          label="Plan ID"
                          name={fields.planName}
                          value={
                            planList?.length > 1
                              ? values[fields.planName]
                                ? values[fields.planName]
                                : "All"
                              : planList[0]?.planName
                          }
                          placeholder="Select"
                          direction="bottom"
                          popupContent={
                            <SearchableList
                              label="Select Plan"
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
                      </div>
                      <div className="d-flex ml-3 mr-2">
                        <Field
                          size="md"
                          label="&nbsp;"
                          placeholder="Search SSN, Name"
                          label="Search"
                          isRequired
                          name={fields.search}
                          type="text"
                          autoComplete="off"
                          value={values[fields.search]}
                          onChange={handleChange}
                          component={FieldInput}
                        />
                      </div>
                      {/* <div className="d-flex ml-3 mr-2">
                        <Field
                          size="sm"
                          label="As of date"
                          isRequired
                          name={fields.asOfDate}
                          placeholder="To"
                          value={usDateFormat(values[fields.asOfDate])}
                          direction="bottom"
                          isDatePicker
                          onClear={() => setFieldValue(fields.asOfDate, "")}
                          popupContent={
                            <DatePicker
                              onDayClick={(value) =>
                                onDaySelected(fields.asOfDate, value)
                              }
                              value={values[fields.asOfDate]}
                            />
                          }
                          component={FieldDropSide}
                        />
                      </div> */}
                    </div>
                    <Button
                      className="mt-12 sort-button "
                      style={{ lineHeight: "19px", marginRight: "30%" }}
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
          <div className="d-flex  flex-col">
            <div
              style={{ fontSize: "14px", color: "#828282", paddingTop: "6px" }}
            >
              {companyList ? `Showing result for ${companyList} company` : null}
            </div>
            <div className="ft-12 grey-text font-weight-500">
              {totalRecord} Records found
            </div>
            <div style={{ fontSize: "14px", paddingTop: "6px" }}>
              The Forecasted Dates in the report are indicative and tentative.
              They may not represent the actual dates.
            </div>
          </div>

          <div className="d-flex pad-top-10">
            <div style={{ diplay: "flex", flexDirection: "column" }}>
              <div className="column-button">
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
                <div className="manage-columns ">
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
                    //hideSelectedOptions="FALSE"
                    //width="269px"
                    height="200px"
                    maxHeight="300px"
                    position="absolute"
                    background="white"
                    zIndex="2"
                    overflow={true}
                    options={columns}
                    onSelect={(value) => {
                      setSelectedColumns(value);
                    }}
                    name={"Columns"}
                    value={selectedColumns}
                    trigger={trigger}
                  />
                </div>
                <div style={{ marginTop: "220px", paddingLeft: "100px" }}>
                  <Button onClick={applyColumns}>Apply</Button>
                </div>
              </div>
            </div>
            <div className="ft-12 grey-text font-weight-500  marg-right-5">
              <Button
                className="export-button"
                title="Export Excel"
                variant="secondary"
                style={{ border: "none" }}
                // onClick={<ExcelExport />}
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

export default EligibilityForecast;
