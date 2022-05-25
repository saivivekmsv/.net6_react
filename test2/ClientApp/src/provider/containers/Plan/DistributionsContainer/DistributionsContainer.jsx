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
  getNullTableItem,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import { createPlanStore } from "../../../contexts";

const columns = [
  {
    label: "Distribution Name",
    className: "column-eligibilityName",
    columnName: "withdrawalDescription",
    link: `${MANAGE_PLAN_ROUTES.ADD_DISTRIBUTIONS}`,
  },
  {
    label: "Type",
    className: "column-eligibilityType",
    columnName: "withDrawalType",
    dataMapper: OPTIONS_DATA_MAPPER.DISTRIBUTIONS_TYPE,
  },
];

const Distributions = (props) => {
  const { flow, planId } = useRouterParams();
  const { state } = useContext(createPlanStore);
  const withdrawals = get(state, "api.data.withdrawals", []);

  const onAddClick = () => {
    const { history } = props;

    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_DISTRIBUTIONS,
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

  const totalDistributions =
    withdrawals.length > 0 && `${withdrawals.length} Distributions`;
  return (
    <ManagePlanLayout buttons={buttons} pageFlow={flow}>
      {isEmpty(withdrawals) && (
        <AddPlans
          content="No distributions"
          buttonLabel="Add Distribution"
          link={getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ADD_DISTRIBUTIONS,
            pathParam: [planId],
          })}
        />
      )}
      {!isEmpty(withdrawals) && (
        <div className="w-100">
          <div className="d-flex w-100 align-items-center justify-content-between mb-4">
            <div className="m-0 plan-heading font-weight-500">
              Manage Distributions
            </div>
            <div className="text-black total-distribution font-weight-500">
              {totalDistributions}
            </div>
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
              {withdrawals.map((distributions, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {getNullTableItem(
                            !isEmpty(item.link) ? (
                              <Link
                                to={getPathWithParam({
                                  path: item.link,
                                  pathParam: [FLOW_TYPES.EDIT, planId, index],
                                })}
                              >
                                {getNullTableItem(
                                  distributions["withDrawalType"] === 2
                                    ? distributions["hardshipReason"] === 7
                                      ? distributions["otherHardshipReason"]
                                      : OPTIONS_DATA_MAPPER
                                          .DISTRIBUTIONS_HARDSHIP_REASONS[
                                          distributions["hardshipReason"]
                                        ]
                                    : distributions[item.columnName]
                                )}
                              </Link>
                            ) : item.dataMapper ? (
                              item.dataMapper[distributions[item.columnName]]
                            ) : (
                              distributions[item.columnName]
                            )
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

export default Distributions;
