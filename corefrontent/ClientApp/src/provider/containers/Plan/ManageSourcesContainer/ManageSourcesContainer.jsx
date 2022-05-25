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
    label: "Source Name",
    className: "column-source-name",
    columnName: "sourceName",
    link: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
  },
  {
    label: "Source Catergory",
    className: "column-source-catergory",
    columnName: "sourceCategory",
    dataMapper: OPTIONS_DATA_MAPPER.SOURCE_CATEGORY_TYPES,
  },
  // {
  //   label: "Status",
  //   className: "column-source-status",
  //   columnName: "status",
  //   dataMapper: OPTIONS_DATA_MAPPER.SOURCES_ADDED_TOPLAN,
  // },
];

const ManageSourcesContainer = (props) => {
  const { flow, planId } = useRouterParams();
  const { state } = useContext(createPlanStore);
  const sourcesData = get(state, "api.data.sources", []);

  const onAddClick = () => {
    const { history } = props;

    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
        pathParam: [planId],
      })
    );
  };

  const buttons = [
    {
      label: "New Source",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT, FLOW_TYPES.SAVE],
      onClick: onAddClick,
    },
  ];
  const noOfSources = sourcesData.length ? `${sourcesData.length} Sources` : "";
  return (
    <ManagePlanLayout buttons={buttons} pageFlow={flow}>
      {isEmpty(sourcesData) && (
        <AddPlans
          content="No sources have been setup for this plan"
          buttonLabel="Create A New Source"
          // secondaryButtonLabel="Add Sources From Master"
          // secondaryButtonLink={getPathWithParam({
          //   path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_MASTER,
          //   pathParam: [planId],
          // })}
          link={getPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
            pathParam: [planId],
          })}
        />
      )}
      {!isEmpty(sourcesData) && (
        <div className="w-100">
          <div className="d-flex w-100 align-items-center justify-content-between mb-4">
            <div className="m-0 plan-heading">Manage Sources</div>
            <div>{noOfSources}</div>
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
              {sourcesData.map((source, index) => {
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
                                {source[item.columnName]}
                              </Link>
                            ) : item.dataMapper ? (
                              item.dataMapper[source[item.columnName]]
                            ) : (
                              source[item.columnName]
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

export default ManageSourcesContainer;
