import React, { useContext } from "react";
import { get, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import {
  ManageCompanyLayout,
  AddCompanyItemsLayout,
  CsplTable as Table,
} from "../../components";
import {
  MANAGE_COMPANY_ROUTES,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  OPTIONS_DATA_MAPPER,
} from "../../utils";
import { useMockLoading, useRouterParams } from "../../abstracts";
import { manageCompanyStore } from "../../contexts";

const columns = [
  {
    label: "Frequency Name",
    className: "column-frequency-name",
    columnName: "frequencyName",
    link: MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY,
  },
  {
    label: "Payroll Frequency",
    className: "column-payroll-frequency",
    columnName: "frequencyType",
  },
];

const ManagePayrollFrequencyContainer = (props) => {
  const { state } = useContext(manageCompanyStore);
  const payrollFrequencyListData = get(
    state,
    "api.data.payrollFrequencies",
    []
  );
  const { isMockLoading } = useMockLoading();
  const { companyId } = useRouterParams();

  const onAddClick = () => {
    const { history } = props;

    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY,
        pathParam: [FLOW_TYPES.ADD, companyId],
      })
    );
  };

  const buttons = [
    {
      label: "",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.EDIT],
      isAddButton: true,
      onClick: onAddClick,
    },
  ];
  return (
    <ManageCompanyLayout buttons={buttons} pageFlow={FLOW_TYPES.ADD}>
      {isEmpty(payrollFrequencyListData) && (
        <AddCompanyItemsLayout
          content={
            <>
              No payroll frequency
              <br />
              has been set for this company
            </>
          }
          buttonLabel="Add Payroll Frequency"
          link={getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY,
            pathParam: [FLOW_TYPES.ADD, companyId],
          })}
          className="mt-5"
        />
      )}
      {!isEmpty(payrollFrequencyListData) && (
        <Table isLoading={isMockLoading}>
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
            {payrollFrequencyListData.map((payrollFrequency, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    const getContent = () => {
                      if ("frequencyType" === item.columnName) {
                        return (
                          OPTIONS_DATA_MAPPER.PAYROLLFREQUENCY_TYPE[
                            payrollFrequency[item.columnName]
                          ] || ""
                        );
                      }
                      if (item.link) {
                        return (
                          <Link
                            to={getAdvancedPathWithParam({
                              path: item.link,
                              pathParam: [
                                FLOW_TYPES.EDIT,
                                companyId,
                                payrollFrequency.id,
                              ],
                            })}
                          >
                            {payrollFrequency[item.columnName]}
                          </Link>
                        );
                      }
                      return payrollFrequency[item.columnName];
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
      )}
    </ManageCompanyLayout>
  );
};

export default ManagePayrollFrequencyContainer;
