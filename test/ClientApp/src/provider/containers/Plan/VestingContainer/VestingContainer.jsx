import React, { useContext, useEffect } from "react";
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
import { clearLocalCacheByModel, createPlanStore } from "../../../contexts";

const columns = [
  {
    label: "Vesting Name",
    className: "column-source-name",
    columnName: "name",
    link: `${MANAGE_PLAN_ROUTES.ADD_VESTING}`,
  },
  {
    label: "Vesting Method",
    className: "column-source-catergory",
    columnName: "method",
    dataMapper: OPTIONS_DATA_MAPPER.VESTING_METHOD,
  },
];

const VestingContainer = (props) => {
  const { flow, planId } = useRouterParams();
  const { state, dispatch } = useContext(createPlanStore);
  const vestingData = get(state, "api.data.vestings", []);

  useEffect(() => {
    dispatch(clearLocalCacheByModel("vestings"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddClick = () => {
    const { history } = props;

    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_VESTING,
        pathParam: [planId, FLOW_TYPES.ADD, vestingData.length],
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

  return (
    <ManagePlanLayout buttons={buttons} pageFlow={flow}>
      {isEmpty(vestingData) && (
        <AddPlans
          content="No vesting rules."
          buttonLabel="Add Vesting"
          link={getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ADD_VESTING,
            pathParam: [planId, FLOW_TYPES.ADD, vestingData.length],
          })}
        />
      )}
      {!isEmpty(vestingData) && (
        <div className="w-100">
          <div className="d-flex w-100 align-items-center justify-content-between mb-4">
            <div className="m-0 plan-heading font-weight-500">
              Manage Vesting
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
              {vestingData.map((vesting, index) => {
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
                              {vesting[item.columnName]}
                            </Link>
                          ) : item.dataMapper ? (
                            get(
                              item.dataMapper,
                              vesting[item.columnName],
                              "Immediate"
                            )
                          ) : (
                            vesting[item.columnName]
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

export default VestingContainer;
