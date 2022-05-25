import React from "react";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { CsplTable as Table, ManagePlanLayout } from "../../../components";
import associatedPlans from "../../../mocks/associatedPlans.json";
import {
  FLOW_TYPES,
  getPathWithParam,
  MANAGE_PLAN_ROUTES,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";

const columns = [
  {
    label: "Plan name",
    className: "column-inv-plan-name",
    columnName: "planName",
  },
];

const ViewAssociatedPlansContainer = () => {
  const { planId, investmentId } = useRouterParams();
  const buttons = [
    {
      label: "",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT],
      icon: faTimes,
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS,
        pathParam: [FLOW_TYPES.EDIT, planId, investmentId],
      }),
    },
  ];
  const totalAssociatedPlans =
    associatedPlans.length > 0 && `(${associatedPlans.length})`;
  return (
    <ManagePlanLayout buttons={buttons} pageFlow={FLOW_TYPES.EDIT}>
      <div>
        <div className="w-100">
          <div className="d-flex justify-content-between mb-4">
            <div className="">
              <div className="m-0 plan-heading">
                Associated Plans{totalAssociatedPlans}
              </div>
            </div>
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
            {associatedPlans.map((restriction, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    const getContent = () => {
                      return restriction[item.columnName];
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
    </ManagePlanLayout>
  );
};

export default ViewAssociatedPlansContainer;
