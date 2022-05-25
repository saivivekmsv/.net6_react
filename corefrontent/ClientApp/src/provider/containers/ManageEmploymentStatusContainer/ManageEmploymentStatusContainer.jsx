import React, { useContext } from "react";
import { isEmpty, get } from "lodash";
import { Link } from "react-router-dom";
import { ManageCompanyLayout, CsplTable as Table } from "../../components";
import { useMockLoading, useRouterParams } from "../../abstracts";
import {
  MANAGE_COMPANY_ROUTES,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  OPTIONS_DATA_MAPPER,
} from "../../utils";
import { manageCompanyStore } from "../../contexts";

const columns = [
  {
    label: "Employment status",
    className: "column-employment-status",
    columnName: "employmentStatusName",
    link: MANAGE_COMPANY_ROUTES.EMPLOYMENT_STATUS,
  },
  {
    label: "Employment status code",
    className: "column-employment-status-code",
    columnName: "employmentStatusCode",
  },
];

const ManageEmploymentStatusContainer = (props) => {
  const { state } = useContext(manageCompanyStore);
  const exployeeStatusData = get(state, "api.data.employmentStatus", []);
  // const { exployeeStatusData = exployeeStatus.data } = props;
  const { isMockLoading } = useMockLoading();
  const { companyId } = useRouterParams();

  const onAddClick = () => {
    const { history } = props;
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.EMPLOYMENT_STATUS,
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
      {!isEmpty(exployeeStatusData) && (
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
            {exployeeStatusData.map((exployee, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {!isEmpty(item.link) ? (
                          <Link
                            to={getAdvancedPathWithParam({
                              path: item.link,
                              pathParam: [
                                FLOW_TYPES.EDIT,
                                companyId,
                                exployee.id,
                              ],
                            })}
                          >
                            {exployee[item.columnName]}
                          </Link>
                        ) : (
                          exployee[item.columnName]
                        )}
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

export default ManageEmploymentStatusContainer;
