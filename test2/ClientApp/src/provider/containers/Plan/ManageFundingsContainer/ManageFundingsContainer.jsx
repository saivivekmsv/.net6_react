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
  maskedBankAccountNumberNormalizer,
  abaRoutingNumber,
  OPTIONS_DATA_MAPPER,
} from "../../../utils";
import { createPlanStore } from "../../../contexts";
import { useRouterParams } from "../../../abstracts";

const columns = [
  {
    label: "Bank Account Number (Last 6 Digits)",
    className: "column-account-number",
    columnName: "bankAccountNumber",
    link: MANAGE_PLAN_ROUTES.MANAGE_FUNDING_DETAIL,
  },
  {
    label: "ABA Routing Number",
    className: "column-routing-number",
    columnName: "abaRoutingNumber",
  },
  {
    label: "Bank Account Type",
    className: "column-account-type",
    columnName: "bankAccountType",
    dataMapper: OPTIONS_DATA_MAPPER.ACCOUNT_TYPE,
  },
  {
    label: "Bank Account Status",
    className: "column-account-status",
    columnName: "bankAccountStatus",
    dataMapper: OPTIONS_DATA_MAPPER.ACCOUNT_STATUS,
  },
  {
    label: "Default Bank Account?",
    className: "column-default-account",
    columnName: "defaultBankAccountIndicator",
    type: "boolean",
  },
];

const ManageFundingsContainer = (props) => {
  const { flow, planId } = useRouterParams();
  const { state } = useContext(createPlanStore);
  const { history } = props;
  const fundingsData = get(state, "api.data.fundings", []);

  const goForward = () => {
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_FUNDING_DETAIL,
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
      onClick: goForward,
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons} pageFlow={flow}>
      <div className="d-flex w-100 align-items-center justify-content-between mb-4">
        <div className="m-0 plan-heading">Manage Funding Accounts</div>
      </div>
      {isEmpty(fundingsData) && (
        <AddPlans
          content="No funding account has been created for this plan"
          buttonLabel="Add Funding Account"
          onPrimaryClick={goForward}
        />
      )}
      {!isEmpty(fundingsData) && (
        <div className="w-100">
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
              {fundingsData.map((funding, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      const getContent = () => {
                        if (item.link) {
                          return (
                            <Link
                              to={getPathWithParam({
                                path: item.link,
                                pathParam: [flow, planId, funding.id],
                              })}
                            >
                              {maskedBankAccountNumberNormalizer(
                                funding[item.columnName]
                              )}
                            </Link>
                          );
                        }
                        if (item.columnName === "abaRoutingNumber") {
                          return abaRoutingNumber(funding[item.columnName]);
                        }
                        if (item.type === "boolean") {
                          return funding[item.columnName] ? "Yes" : "No";
                        }
                        if (item.dataMapper) {
                          return item.dataMapper[funding[item.columnName]];
                        }
                        return funding[item.columnName];
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
    </ManagePlanLayout>
  );
};

export default ManageFundingsContainer;
