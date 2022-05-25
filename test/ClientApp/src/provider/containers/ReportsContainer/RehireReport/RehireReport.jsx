import React, { useState } from "react";
import { isEmpty } from "lodash";
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
  ssnMasking,
} from "../../../utils";
import {
  GetRehireParticipantsReport,
  getCompaniesDropDown,
  getDownloadRehireReport,
} from "../../../services";
import { useDeepEffect, useRequest } from "../../../abstracts";
import ExcelImage from "../../../styles/exportimg.PNG";
import * as fileSaver from "file-saver";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { ColumnMenu } from "../402ContributionLimit/columnMenu";
import { Tooltip } from "@progress/kendo-react-tooltip";

const today = new Date();
const initialValues = {
  companyName: "Select One",
  toDate: new Date(today.setDate(today.getDate())),
  fromDate: new Date(today.setDate(today.getDate() - 30)),
};

const selectOne = { label: "Select One", value: null };

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
    width: 120,
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
    field: "firstName",
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
    label: "Date of birth",
    className: "column-dateOfBirth",
    columnName: "dateOfBirth",
    field: "dateOfBirth",
    width: 169,
    dataType: "date",
    field1: "dateOfBirthFrom",
    field2: "dateOfBirthTo",
  },
  {
    value: 7,
    label: "Employment status",
    className: "column-employmentStatus",
    columnName: "employmentStatus",
    field: "employmentStatus",
    width: 180,
    dataType: "alphaNumeric",
    field1: "employmentStatus",
  },
  {
    value: 8,
    label: "Original date of hire",
    className: "column-originalDateOfHire",
    columnName: "dateOfHireOriginal",
    field: "dateOfHireOriginal",
    width: 200,
    dataType: "date",
    field1: "originalDateOfHireFrom",
    field2: "originalDateOfHireTo",
  },
  {
    value: 9,
    label: "Most recent termination date",
    className: "column-mostRecentTerminationDate",
    columnName: "mostRecentTerminationDate",
    field: "mostRecentTerminationDate",
    width: 250,
    dataType: "date",
    field1: "recentTerminationDateFrom",
    field2: "recentTerminationDateTo",
  },
  {
    value: 10,
    label: "Most recent rehire date",
    className: "column-mostRecentRehireDate",
    columnName: "mostRecentDateOfRehire",
    field: "mostRecentDateOfRehire",
    width: 250,
    dataType: "date",
    field1: "recentRehireDateFrom",
    field2: "recentRehireDateTo",
  },
  {
    value: 11,
    label: "Eligibility requirement met date",
    className: "column-eligibilityRequirementMetDate",
    columnName: "eligibilityRequirementMetDate",
    field: "eligibilityRequirementMetDate",
    width: 289,
    dataType: "date",
    field1: "eligibilityRequirementMetDateFrom",
    field2: "eligibilityRequirementMetDateTo",
  },
  {
    value: 12,
    label: "Eligibility Status",
    className: "column-eligibilityStatus",
    columnName: "eligibilityStatus",
    field: "eligibilityStatus",
    width: 160,
    dataType: "alphaNumeric",
    field1: "eligibilityStatus",
  },
  {
    value: 13,
    label: "Plan entry date",
    className: "column-planEntryDate",
    columnName: "planEntryDate",
    field: "planEntryDate",
    width: 160,
    dataType: "date",
    field1: "planEntryDateFrom",
    field2: "planEntryDateTo",
  },
  {
    value: 14,
    label: "Employee classification",
    className: "column-employeeClassification",
    columnName: "employeeClassification",
    field: "employeeClassification",
    width: 210,
    dataType: "alphaNumeric",
    field1: "employeeClassification",
  },
];

const RehireReport = (props) => {
  const formName = manageReportsFormNames.REHIRE_REPORT;
  const fields = formFields[formName];
  const [toggle, setToggle] = useState(false);
  const [final, setFinal] = useState(columns);
  const [filteredValues, setFilteredValues] = useState({
    from: 1,
    count: 10,
  });
  const [selectedColumns, setSelectedColumns] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
  ]);
  const [companyList, setCompanyList] = useState("");
  const [gridFilters, setGridFilters] = useState();
  const [isScroll, setIsScroll] = useState(false);
  const [tableContent, setTableContent] = useState([]);
  const [lastScrollTop, setLastScrollTop] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [sorting, setSorting] = useState();
  const [dataLoading, setDataLoading] = useState(false);
  const [totalRecord, setTotalRecord] = useState();
  const [trigger, setTrigger] = useState(true);
  const { response: companies } = useRequest({
    method: getCompaniesDropDown,
    defaultResponse: [],
  });

  const apiCall = (data) => {
    setDataLoading(true);
    GetRehireParticipantsReport(data)
      .then((response) => {
        setDataLoading(false);
        setTableContent(response.rehireParticipantsDetails);
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
        nameOrSsn: values.nameOrSsn,
        fromDate: values.fromDate,
        toDate: values.toDate,
        from: 1,
        count: 20,
        innerFilters: null,
        selectedColumns: selectedColumns,
      };
      setFilteredValues(filters);
      // setToggle(!toggle);
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
          nameOrSsn: filteredValues.nameOrSsn,
          fromDate: filteredValues.fromDate,
          toDate: filteredValues.toDate,
          from: fromCount,
          count: 20,
          innerFilters: gridFilters,
        };
        setToggle(!toggle);
        setPageCount(pageCount + 1);
        setDataLoading(true);
        GetRehireParticipantsReport(filters)
          .then((response) => {
            setDataLoading(false);
            if (response === []) {
              setIsScroll(false);
            }

            setTableContent([
              ...tableContent,
              ...response.rehireParticipantsDetails,
            ]);
          })
          .catch((error) => {
            setDataLoading(false);
            //handle error
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

  const exportReportFile = () => {
    var column = columns.filter(
      (column) => !final.map((item) => item.value).includes(column.value)
    );
    var data = column.map((item) => item.value);
    getDownloadRehireReport({ ...filteredValues, selectedColumns: data })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "RehireReport.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving Rehire Report");
      });
  };

  const renderValue = (value) => {
    value = value?.dataItem ? value.dataItem[value.field] : value;
    return <td>{value ? <div>{value}</div> : <div>-</div>}</td>;
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
    <ManageReportLayout rptName="Rehire Report">
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
                  [fields.companyId]:
                    value || value === 0
                      ? parseInt(companies[value].companyId)
                      : null,
                  [fields.companyName]:
                    value || value === 0
                      ? companies[value].companyName
                      : "Select One",
                  [fields.fromDate]: values[fields.fromDate],
                  [fields.toDate]: values[fields.toDate],
                });
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
                                //selectOne,
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
                      <div className="d-flex ml-4 mr-2">
                        <Field
                          size="sm"
                          label="From date"
                          isRequired
                          name={fields.fromDate}
                          value={usDateFormat(values[fields.fromDate])}
                          direction="bottom"
                          isDatePicker
                          onClear={() => setFieldValue(fields.fromDate, "")}
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
                      <div className="d-flex ml-3 mr-2">
                        <Field
                          size="sm"
                          label="To date"
                          isRequired
                          name={fields.toDate}
                          value={usDateFormat(values[fields.toDate])}
                          direction="bottom"
                          isDatePicker
                          onClear={() => setFieldValue(fields.toDate, "")}
                          popupContent={
                            <DatePicker
                              onDayClick={(value) =>
                                onDaySelected(fields.toDate, value)
                              }
                              value={values[fields.toDate]}
                            />
                          }
                          component={FieldDropSide}
                        />
                      </div>
                    </div>
                    <Button
                      className="ml-2 mt-12 sort-button"
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
                    hideSelectedOptions="FALSE"
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
                //onClick={excelExport}
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

export default RehireReport;
