import { Field, Formik } from "formik";
import { isEmpty, get } from "lodash";
import React, { useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  useDeepEffect,
  useRequest,
  useRouterParams,
} from "shared/abstracts";
import {
  DatePicker,
  FieldDropSide,
  CsplTable as Table,
  MultiSelectDropdown,
  Link,
  SliderPanel,
} from "shared/components";
import {
  getPlansContributions,
  getSourceLevelContribution,
  getEmployeePlanSources,
} from "sponsor/services";
import {
  manageCensusFormNames,
  usDateFormat,
  formFields,
  toMultiSelectValue,
  formatDateForApiRequest,
} from "shared/utils";
import AddContributions from "./AddContributions";
import ContributionsSidePanel from "./ContributionsSidePanel";
import {
  setManageCensusPageLevelData,
  manageCensusStore,
} from "sponsor/contexts";
import { useContext } from "react";

const columns = [
  {
    label: "Pay date",
    className: "column-payDate",
    columnName: "payDate",
  },
  {
    label: "Total Contributions",
    className: "column-contributionAmount",
    columnName: "contributionAmount",
  },
  {
    label: "Updated Through",
    className: "column-uploadedThrough",
    columnName: "uploadedThrough",
  },
  {
    label: "Updated By",
    className: "column-updatedBy",
    columnName: "updatedBy",
  },
  {
    label: "Comments",
    className: "column-comments",
    columnName: "comments",
    link: `link`,
  },
];
const updatedThrough = ["FileUpload", "UI Editing", "CorrectionEntry"];
const updatedBy = [null, "Admin"];
const defaultStartDate = new Date();
defaultStartDate.setDate(defaultStartDate.getDate() - 120);
const defaultEndDate = new Date();

const Contributions = (props) => {
  const [filteredResponse, setFilteredResponse] = useState([]);
  const { state, dispatch } = useContext(manageCensusStore);
  const [showContributionsForm, setShowContributionsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sidePanelData, setSidePanelData] = useState({});
  const { planId, censusId } = useRouterParams();
  const [toggle, setToggle] = useState(false);
  const [sources, setSources] = useState([]);

  // const { response: sources } = useRequest({
  //   method: getEmployeePlanSources,
  //   payload: {
  //     planId: planId,
  //     companyId: get(state, "companyId", 0),
  //   },
  //   defaultResponse: [],
  // });

  useDeepEffect(() => {
    getEmployeePlanSources({
      planId: parseInt(planId),
      companyId: get(state, "companyId", 0),
    })
      .then((response) => {
        setSources(response);
      })
      .catch((error) => {
        //Handle Error
      });
  }, [toggle]);

  useDeepEffect(() => {
    getPlansContributions({
      employeeId: parseInt(censusId),
      planId: parseInt(planId),
      sourceslist: sources.map((source) => source.id),
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    })
      .then((response) => {
        setFilteredResponse(response);
      })
      .catch((error) => {
        //Handle Error
      });
  }, [sources, toggle]);

  const formName = manageCensusFormNames.CONTRIBUTIONS_FILTER;
  const fields = formFields[formName];

  const onFormSubmit = (values) => {
    dispatch(
      setManageCensusPageLevelData({
        formName: formName,
        fieldData: values,
      })
    );
  };

  const onFilter = (values) => {
    setIsLoading(true);
    getPlansContributions({
      sourcesList: values.sourcesList,
      employeeId: parseInt(censusId),
      planId: parseInt(planId),
      startDate: values.startDate,
      endDate: values.endDate,
    })
      .then((res) => {
        setFilteredResponse(res);
      })
      .catch((error) => {
        //Handle Errors
      });
    setIsLoading(false);
  };

  const toggleContributionsForm = () => {
    setShowContributionsForm(!showContributionsForm);
  };

  const onViewButtonClick = (data) => {
    getSourceLevelContribution({
      planId: planId,
      employeeId: censusId,
      payDate: get(data, "payDate", "").replaceAll("/", "-"),
    })
      .then((response) => {
        data = {
          ...data,
          contributions: response,
        };
        setSidePanelData(data);
        setModalOpen(true);
      })
      .catch((error) => {
        //Handle Error
        // console.log("Error while retrieving source level split up");
      });
  };

  return (
    <>
      {!showContributionsForm && (
        <div className="w-100">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <div className="plan-sub-heading">Show records of period</div>
          </div>

          <Formik
            initialValues={{
              startDate: defaultStartDate,
              endDate: defaultEndDate,
              sourcesList: sources.map((source) => source.id),
            }}
            onSubmit={onFormSubmit}
            enableReinitialize
          >
            {({
              handleChange,
              setFieldValue,
              handleSubmit,
              values,
              ...rest
            }) => {
              const onDaySelected = (fieldName, value) => {
                setFieldValue(fieldName, value);
              };
              const selectedSources = values[fields.sourcesList];
              return (
                <Form
                  autoComplete="off"
                  className="h-100"
                  onSubmit={handleSubmit}
                >
                  <div className="d-flex justify-content-between compensation-container w-100">
                    <div className="d-flex align-items-center justify-content-between w-100 ">
                      <Field
                        size="smd"
                        label="Start Date"
                        name={fields.startDate}
                        value={usDateFormat(values[fields.startDate])}
                        isDatePicker
                        onClear={() => onDaySelected(fields.startDate, "")}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.startDate, value)
                            }
                            value={values[fields.payDate]}
                          />
                        }
                        component={FieldDropSide}
                      />
                      <Field
                        size="smd"
                        label="End Date"
                        name={fields.endDate}
                        value={usDateFormat(values[fields.endDate])}
                        isDatePicker
                        onClear={() => onDaySelected(fields.endDate, "")}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.endDate, value)
                            }
                            value={values[fields.endDate]}
                          />
                        }
                        component={FieldDropSide}
                      />
                      <Field
                        size="smd"
                        label="Sources"
                        name={fields.sourcesList}
                        value={toMultiSelectValue(selectedSources, sources)}
                        isMultiSelect
                        popupContent={
                          <MultiSelectDropdown
                            label="Select Sources"
                            name={fields.sourcesList}
                            onSelect={(value) =>
                              setFieldValue(fields.sourcesList, value)
                            }
                            value={values[fields.sourcesList]}
                            options={
                              sources &&
                              sources.map((source, index) => ({
                                label: source.name,
                                value: source.id,
                              }))
                            }
                          />
                        }
                        component={FieldDropSide}
                      />
                      <Button
                        onClick={() => onFilter(values)}
                        type="button"
                        className="align-center"
                      >
                        Go
                      </Button>
                      <div className="mr-4 mt-12">
                        {filteredResponse.length} records
                      </div>
                    </div>
                    <div className="align-center">
                      <Button
                        type="button"
                        className="add-btn"
                        onClick={toggleContributionsForm}
                        variant="secondary"
                      >
                        Add Contributions
                      </Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
          <Table isLoading={isLoading} className="contributions-table">
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
              {filteredResponse.map((contributions, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      const getContent = () => {
                        if (!isEmpty(item.link)) {
                          return (
                            <OverlayTrigger
                              overlay={
                                <Tooltip>{contributions.tooltip}</Tooltip>
                              }
                            >
                              <Link>{contributions[item.columnName]}</Link>
                            </OverlayTrigger>
                          );
                        }

                        if (item.columnName === "contributionAmount") {
                          return (
                            <Link
                              onClick={() =>
                                onViewButtonClick({
                                  payDate: contributions.payDate,
                                  totalContribution:
                                    "$" +
                                    contributions.contributionAmount.toFixed(2),
                                })
                              }
                            >
                              {"$" + contributions[item.columnName].toFixed(2)}
                            </Link>
                          );
                        }

                        if (item.columnName === "payDate") {
                          return usDateFormat(contributions[item.columnName]);
                        }
                        if (item.columnName === "uploadedThrough") {
                          return updatedThrough[
                            contributions[item.columnName] - 1
                          ];
                        }
                        if (item.columnName === "updatedBy") {
                          return updatedBy[contributions[item.columnName]];
                        }
                        if (item.dataMapper) {
                          return item.dataMapper[
                            contributions[item.columnName]
                          ];
                        }
                        return contributions[item.columnName];
                      };
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {getContent()}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      )}
      {/* {showContributionsForm && (
        <AddContributions
          toggleContributionsForm={toggleContributionsForm}
          sources={sources}
          setToggle={setToggle}
          toggle={toggle}
          {...props}
        />
      )} */}
      <SliderPanel
        isOpen={showContributionsForm}
        size="40"
        onClose={() => setModalOpen(false)}
      >
        <AddContributions
          toggleContributionsForm={toggleContributionsForm}
          sources={sources}
          setToggle={setToggle}
          toggle={toggle}
          {...props}
        />
      </SliderPanel>

      <SliderPanel
        isOpen={isModalOpen}
        size="40"
        onClose={() => setModalOpen(false)}
      >
        <ContributionsSidePanel data={sidePanelData} />
      </SliderPanel>
    </>
  );
};

export default Contributions;
