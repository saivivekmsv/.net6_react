import React, { useContext, useState } from "react";
import { get, isEmpty, uniqBy } from "lodash";
import {
  ManagePlanLayout,
  AddPlans,
  CsplTable as Table,
  Link,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  FLOW_TYPES,
  getPathWithParam,
  OPTIONS_DATA_MAPPER,
  getFilteredInvestments,
  getNullTableItem,
} from "../../../utils";
import { createPlanStore } from "../../../contexts";
import { useDeepEffect, useRouterParams } from "../../../abstracts";
import PlanFilterComponent from "./PlanFilterComponent";

const columns = [
  {
    label: "Investment Name",
    className: "column-investment-name",
    columnName: "name",
    link: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS,
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
];

const ManageInvestmentsPlanContainer = (props) => {
  const { state } = useContext(createPlanStore);
  const { history } = props;
  const [selectedInvestmentSearch, setSelectedInvestmentSearch] = useState("");
  const [selectedInvestmentType, setSelectedInvestmentType] = useState();
  const [selectedInvestmentStatus, setSelectedInvestmentStatus] = useState();
  const [investmentTypeOptions, setInvestmentTypeOptions] = useState([]);
  const [investmentStatusOptions, setInvestmentStatusOptions] = useState([]);
  const { planId, flow } = useRouterParams();
  const apiData = get(state, "api.data", {});
  const investmentsData = get(apiData, "investments", []);

  const onAddClick = () => {
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_INVESTMENTS_MASTER,
        pathParam: [flow, planId],
      })
    );
  };

  useDeepEffect(() => {
    const investmentTypes = uniqBy(
      investmentsData.map((item) => ({
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
  }, [investmentsData]);

  const buttons = [
    {
      label: "Add Investment",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT],
      onClick: onAddClick,
    },
  ];

  const onAddSelectedPlan = () => {}; // dummy function

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
    list: investmentsData,
    selectedInvestmentSearch,
    selectedInvestmentType,
    selectedInvestmentStatus,
  });

  return (
    <ManagePlanLayout buttons={buttons} pageFlow={FLOW_TYPES.ADD}>
      <div className="plan-sub-heading">Manage Investments</div>
      {isEmpty(investmentsData) && (
        <AddPlans
          content="No Investments"
          buttonLabel="ADD INVESTMENT"
          onPrimaryClick={onAddClick}
        />
      )}

      {!isEmpty(investmentsData) && (
        <div>
          <PlanFilterComponent
            onAddSelectedPlan={onAddSelectedPlan}
            handleSearchChange={handleSearchChange}
            handleInvestmentTypeChange={handleInvestmentTypeChange}
            handleInvestmentStatusChange={handleInvestmentStatusChange}
            investmentType={selectedInvestmentType}
            investmentStatus={selectedInvestmentStatus}
            investmentTypeOptions={investmentTypeOptions}
            investmentStatusOptions={investmentStatusOptions}
            investmentCount={filteredData.length}
          />
          <Table>
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
            <Table.Tbody isLoading={false} totalRecords={filteredData.length}>
              {filteredData.map((investment, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      const getContent = () => {
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
        </div>
      )}
    </ManagePlanLayout>
  );
};

export default ManageInvestmentsPlanContainer;
