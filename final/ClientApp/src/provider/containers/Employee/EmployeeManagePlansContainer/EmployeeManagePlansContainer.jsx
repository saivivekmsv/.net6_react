import React from "react";
import { isEmpty } from "lodash";
import {
  LoaderWrapper,
  CsplTable as Table,
  ManageCensusLayout,
  Link,
} from "../../../components";
import {
  FLOW_TYPES,
  getPathWithParam,
  MANAGE_CENSUS_ROUTES,
  OPTIONS_DATA_MAPPER,
  usDateFormat,
} from "../../../utils";
import { getEmployeeManagePlans } from "../../../services";
import { useRouterParams, useRequest } from "../../../abstracts";

const columns = [
  {
    label: "Plan name",
    className: "column-planName col-md-4",
    columnName: "planName",
    link: MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLAN_MODULES,
  },
  {
    label: "Status",
    className: "column-status col-md-4",
    columnName: "status",
    // dataMapper: OPTIONS_DATA_MAPPER.ACCOUNT_STATUS,
  },
];

const EmployeeManagePlansContainer = () => {
  const { censusId = 1 } = useRouterParams();

  const { response, loading } = useRequest({
    method: getEmployeeManagePlans,
    payload: censusId,
    defaultResponse: [],
  });
  console.log("Response is ", response);
  return (
    <ManageCensusLayout>
      <p className="plan-heading">Enrolled Plans</p>
      <LoaderWrapper isLoading={loading} className="">
        {!loading && !isEmpty(response) && (
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
                {response.map((plans, index) => {
                  return (
                    <Table.Tr key={index}>
                      {columns.map((item, cellIndex) => {
                        const getContent = () => {
                          if (item.link) {
                            return (
                              <Link
                                to={getPathWithParam({
                                  path: item.link,
                                  pathParam: [
                                    FLOW_TYPES.EDIT,
                                    censusId,
                                    plans.id,
                                  ],
                                })}
                              >
                                {plans[item.columnName]}
                              </Link>
                            );
                          }

                          if (item.dataMapper) {
                            return item.dataMapper[plans[item.columnName]];
                          }
                          return plans[item.columnName];
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
      </LoaderWrapper>
    </ManageCensusLayout>
  );
};

export default EmployeeManagePlansContainer;
