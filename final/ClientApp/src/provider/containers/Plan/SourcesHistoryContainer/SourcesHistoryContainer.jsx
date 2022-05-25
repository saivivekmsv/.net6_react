import React from "react";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { ManagePlanLayout, CsplTable as Table } from "../../../components";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  usDateFormat,
} from "../../../utils";
import { useRouterParams, useRequest } from "../../../abstracts";
import { getSourcesHistory } from "../../../services";

const columns = [
  {
    label: "Start Date",
    className: "column-start-date",
    columnName: "startDate",
    type: "date",
  },
  {
    label: "End Date",
    className: "column-end-date",
    columnName: "endDate",
    type: "date",
  },
  {
    label: "Update By",
    className: "column-update-by",
    columnName: "updatedBy",
  },
  {
    label: "Update On",
    className: "column-updated-on",
    columnName: "updatedOn",
    type: "date",
  },
];

const ViewMasterSourcesContainer = (props) => {
  const { flow, planId, sourceId } = useRouterParams();
  const { loading, response } = useRequest({
    method: getSourcesHistory,
    defaultResponse: [],
  });

  const buttons = [
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
        pathParam: [flow, planId, sourceId],
      }),
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons} pageFlow={FLOW_TYPES.EDIT}>
      <div className="plan-heading">Sources Effective Date History</div>
      <Table isLoading={loading}>
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
        <Table.Tbody isLoading={loading} totalRecords={response.length}>
          {response.map((history, index) => {
            return (
              <Table.Tr key={index}>
                {columns.map((item, cellIndex) => {
                  return (
                    <Table.Td key={cellIndex} className={item.className}>
                      {item.type === "date"
                        ? usDateFormat(history[item.columnName])
                        : history[item.columnName]}
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
};

export default ViewMasterSourcesContainer;
