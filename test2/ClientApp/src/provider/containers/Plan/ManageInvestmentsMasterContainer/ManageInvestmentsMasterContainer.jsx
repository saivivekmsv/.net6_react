import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { get, isEmpty, uniqBy } from "lodash";
import { Formik } from "formik";
import {
  ManagePlanLayout,
  CsplTable as Table,
  Link,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  OPTIONS_DATA_MAPPER,
  getFilteredInvestments,
  getNullTableItem,
  FLOW_TYPES,
} from "../../../utils";
import {
  createPlanStore,
  savePlanDetailsAction,
  setManagePlanToastInfo,
} from "../../../contexts";
import {
  useDeepEffect,
  useRequest,
  useRouterParams,
  useTableChecboxSelect,
} from "../../../abstracts";
import MasterFilterComponent from "./MasterFilterComponent";
// import investmentsMasterData from "../../../mocks/investmentsMaster.json";
import { getInvestmentsMasterData } from "../../../services";

const columns = [
  {
    label: "",
    className: "",
    columnName: "isSelected",
  },
  {
    label: "Investment Name",
    className: "column-investment-name",
    columnName: "name",
  },
  {
    label: "Investment Type",
    className: "column-investment-type",
    columnName: "type",
    dataMapper: OPTIONS_DATA_MAPPER.INVESTMENT_TYPES,
  },
  {
    label: "Ticker Symbol",
    className: "column-investment-ticker",
    columnName: "tickerSymbol",
  },
  {
    label: "Investment Status",
    className: "column-investment-status",
    columnName: "status",
    dataMapper: OPTIONS_DATA_MAPPER.INVESTMENT_STATUS,
  },
  {
    label: "",
    className: "column-investment-is-added",
    columnName: "isAddedToPlan",
  },
];

const ManageInvestmentsMasterContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const [selectedInvestmentSearch, setSelectedInvestmentSearch] = useState("");
  const [selectedInvestmentType, setSelectedInvestmentType] = useState();
  const [selectedInvestmentStatus, setSelectedInvestmentStatus] = useState();
  const [investmentTypeOptions, setInvestmentTypeOptions] = useState([]);
  const [investmentStatusOptions, setInvestmentStatusOptions] = useState([]);
  const { planId, flow } = useRouterParams();
  const apiData = get(state, "api.data", {});
  const investmentsData = get(apiData, "investments", []);
  const [filteredResponse, setFilteredResponse] = useState([]);
  const { response: investmentsMasterData, loading } = useRequest({
    method: getInvestmentsMasterData,
    defaultResponse: [],
  });

  const {
    data,
    isAllChecked,
    onHeaderCheckboxClick,
    onRowItemClick,
    selectedData,
  } = useTableChecboxSelect({
    response: filteredResponse,
  });

  useDeepEffect(() => {
    setFilteredResponse(
      investmentsMasterData.map((item) => ({
        ...item,
        checked: item.isSelected,
      }))
    );
    const investmentTypes = uniqBy(
      investmentsMasterData.map((item) => ({
        label: OPTIONS_DATA_MAPPER.INVESTMENT_TYPES[item.type],
        value: item.type,
      })),
      "value"
    );
    setInvestmentTypeOptions([
      {
        label: "All",
        value: "",
      },
      ...investmentTypes,
    ]);

    setInvestmentStatusOptions([
      {
        label: "All",
        value: "",
      },
      {
        label: OPTIONS_DATA_MAPPER.INVESTMENT_STATUS[1],
        value: 1,
      },
      {
        label: OPTIONS_DATA_MAPPER.INVESTMENT_STATUS[0],
        value: 0,
      },
    ]);
  }, [investmentsMasterData]);

  const onAddSelectedPlan = ({ setFieldError, setFieldTouched }) => {
    const { history } = props;

    savePlanDetailsAction(
      {
        investments: [...investmentsData, ...selectedData],
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: "Data saved successfully",
          })
        );
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_INVESTMENTS_PLAN,
            pathParam: [flow, planId],
          })
        );
      } else {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      }
    });
  };

  const handleSearchChange = (e) => {
    setSelectedInvestmentSearch(e.target.value);
  };

  const handleInvestmentTypeChange = (e) => {
    setSelectedInvestmentType(get(e, "target.data.value"));
  };

  const handleInvestmentStatusChange = (e) => {
    setSelectedInvestmentStatus(get(e, "target.data.value"));
  };

  const filteredData = getFilteredInvestments({
    list: data,
    selectedInvestmentSearch,
    selectedInvestmentType,
    selectedInvestmentStatus,
  });

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_INVESTMENTS_PLAN,
        pathParam: [flow, planId],
      }),
    },
    {
      label: "New Investment",
      type: "button",
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS,
        pathParam: [FLOW_TYPES.ADD, planId],
      }),
    },
  ];

  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {}}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ setFieldValue }) => {
        return (
          <ManagePlanLayout buttons={buttons}>
            <div>
              <p className="selected-title-head py-2">
                Selected investment from master to add to plan
              </p>
              {selectedData &&
                selectedData.map((item) => (
                  <span className="selected-table-value">{item.name}</span>
                ))}
            </div>
            <div className="plan-sub-heading">Manage Investments</div>
            <MasterFilterComponent
              onAddSelectedPlan={onAddSelectedPlan}
              handleSearchChange={handleSearchChange}
              handleInvestmentTypeChange={handleInvestmentTypeChange}
              handleInvestmentStatusChange={handleInvestmentStatusChange}
              investmentType={selectedInvestmentType}
              investmentStatus={selectedInvestmentStatus}
              investmentTypeOptions={investmentTypeOptions}
              investmentStatusOptions={investmentStatusOptions}
              isAnySelected={selectedData.length > 0}
              investmentCount={filteredData.length}
            />

            <Table isLoading={loading}>
              <Table.Thead>
                <Table.Tr>
                  {columns.map((item, index) => {
                    if (index === 0) {
                      return (
                        <Table.Th key={index} className={item.className}>
                          <Form.Check
                            custom
                            name="master-sources-radio-head"
                            type="checkbox"
                            label=""
                            id={`master-sources-radio-head`}
                            onChange={onHeaderCheckboxClick}
                            checked={isAllChecked}
                          />
                        </Table.Th>
                      );
                    }
                    return (
                      <Table.Th key={index} className={item.className}>
                        {item.label}
                      </Table.Th>
                    );
                  })}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody isLoading={false} totalRecords={filteredData.length}>
                {filteredData.map((investment, index) => {
                  const onRowCheckboxClick = () => {
                    setFieldValue("dummy", true); // addition this to triggere dirty check flag
                    onRowItemClick(investment, index);
                  };
                  return (
                    <Table.Tr key={index}>
                      {columns.map((item, cellIndex) => {
                        const getContent = () => {
                          if (cellIndex === 0) {
                            return (
                              <Form.Check
                                custom
                                name={item.columnName}
                                type="checkbox"
                                label=""
                                id={`${item.columnName}-${index}`}
                                checked={
                                  investment.checked || investment.isAddedToPlan
                                }
                                onChange={onRowCheckboxClick}
                                disabled={investment.isAddedToPlan}
                              />
                            );
                          }

                          if (!isEmpty(item.link)) {
                            return (
                              <Link
                                to={getPathWithParam({
                                  path: item.link,
                                  pathParam: [flow, planId, investment.id],
                                })}
                              >
                                {investment[item.columnName]}
                              </Link>
                            );
                          }

                          if (item.dataMapper) {
                            return item.dataMapper[investment[item.columnName]];
                          }
                          if (
                            item.columnName === "isAddedToPlan" &&
                            investment[item.columnName]
                          ) {
                            return "Added To Plan";
                          }

                          return investment[item.columnName];
                        };

                        return (
                          <Table.Td key={cellIndex} className={item.className}>
                            {getNullTableItem(getContent())}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </ManagePlanLayout>
        );
      }}
    </Formik>
  );
};

export default ManageInvestmentsMasterContainer;
