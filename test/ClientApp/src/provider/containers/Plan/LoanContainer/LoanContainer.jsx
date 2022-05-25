import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { get, isEmpty } from "lodash";
import {
  ManagePlanLayout,
  AddPlans,
  CsplTable as Table,
} from "../../../components";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  OPTIONS_DATA_MAPPER,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import { createPlanStore } from "../../../contexts";

const columns = [
  {
    label: "Loan Name",
    className: "column-source-name",
    columnName: "id",
    dataMapper: OPTIONS_DATA_MAPPER.MANAGE_LOAN_TYPE,
    link: `${MANAGE_PLAN_ROUTES.ADD_LOANS}`,
  },
];

const LoanContainer = (props) => {
  const { flow, planId } = useRouterParams();
  const { state } = useContext(createPlanStore);
  const data = get(state, "api.data.loans", []);

  const onAddClick = () => {
    const { history } = props;

    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_LOANS,
        pathParam: [planId],
      })
    );
  };

  const buttons = [
    {
      label: "",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT, FLOW_TYPES.SAVE],
      isAddButton: true,
      onClick: onAddClick,
    },
  ];

  const totalLoans = data.length > 0 && `${data.length} Loans`;
  return (
    <ManagePlanLayout buttons={buttons} pageFlow={flow}>
      {isEmpty(data) && (
        <AddPlans
          content="No loans have been created for this plan."
          buttonLabel="Add Loan"
          link={getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ADD_LOANS,
            pathParam: [planId],
          })}
        />
      )}
      {!isEmpty(data) && (
        <div className="w-100">
          <div className="d-flex w-100 align-items-center justify-content-between mb-4">
            <div className="m-0 plan-heading font-weight-500">
              Manage Loan Types
            </div>
            <div>{totalLoans}</div>
          </div>
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
            <Table.Tbody>
              {data.map((loans, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {!isEmpty(item.link) ? (
                            <Link
                              to={getPathWithParam({
                                path: item.link,
                                pathParam: [FLOW_TYPES.EDIT, planId, index],
                              })}
                            >
                              {loans.loanDescription}
                            </Link>
                          ) : item.dataMapper ? (
                            item.dataMapper[loans[item.columnName]]
                          ) : (
                            loans[item.columnName]
                          )}
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

export default LoanContainer;
