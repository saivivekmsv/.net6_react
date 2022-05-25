import React from "react";
import { get } from "lodash";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import {
  CsplTable as Table,
  ManagePlanLayout,
  Select,
} from "../../../components";
import {
  FLOW_TYPES,
  getPathWithParam,
  MANAGE_PLAN_ROUTES,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  usDateFormat,
} from "../../../utils";
import restrictionHistory from "../../../mocks/restrictionHistory.json";
import { useRouterParams } from "../../../abstracts";
import { useState } from "react";

const columns = [
  {
    label: "Effective Start Date",
    className: "column-inv-effective-start-date",
    columnName: "effectiveStartDate",
    type: "date",
  },
  {
    label: "Effective End Date",
    className: "column-inv-effective-end-date",
    columnName: "effectiveEndDate",
    type: "date",
  },
  {
    label: "Applicable Types",
    className: "column-inv-applicable-types",
    columnName: "applicableTypes",
    dataMapper: OPTIONS_DATA_MAPPER.TEMP_APPLICABLE_TYPES,
  },
];
const ViewRestrictionHistoryContainer = () => {
  const [selectedApplicableType, setSelectedApplicableType] = useState("");
  const { planId, investmentId } = useRouterParams();
  const buttons = [
    {
      label: "",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT],
      icon: faTimes,
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS,
        pathParam: [FLOW_TYPES.EDIT, planId, investmentId],
      }),
    },
  ];

  const handleInvestmentStatusChange = (e) => {
    setSelectedApplicableType(e.target.value);
  };
  return (
    <ManagePlanLayout buttons={buttons} pageFlow={FLOW_TYPES.EDIT}>
      <div>
        <div className="w-100">
          <div className="d-flex justify-content-between mb-4">
            <div className="">
              <div className="m-0 plan-heading">Restriction History</div>
            </div>
            <div className="w-25">
              <Select
                title={`Type: ${
                  !selectedApplicableType
                    ? "All"
                    : OPTIONS_DATA_MAPPER.TEMP_APPLICABLE_TYPES[
                        selectedApplicableType
                      ]
                }`}
                optionsList={[
                  {
                    label: "All",
                    value: "",
                  },
                  ...toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.TEMP_APPLICABLE_TYPES
                  ),
                ]}
                className="bg-transparent p-0 no-caret"
                onClick={handleInvestmentStatusChange}
                value={selectedApplicableType}
              />
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
            {restrictionHistory
              .filter((restriction) => {
                return (
                  !selectedApplicableType ||
                  get(restriction, "applicableTypes", []).includes(
                    selectedApplicableType
                  )
                );
              })
              .map((restriction, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      const getContent = () => {
                        if (item.type === "date") {
                          return usDateFormat(restriction[item.columnName]);
                        }
                        if (item.columnName === "applicableTypes") {
                          return get(restriction, "applicableTypes", [])
                            .map((val) => {
                              return item.dataMapper[val];
                            })
                            .join(", ");
                        }
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

export default ViewRestrictionHistoryContainer;
