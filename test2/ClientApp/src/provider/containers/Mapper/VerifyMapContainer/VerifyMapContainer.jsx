import { get, isEmpty } from "lodash-es";
import React, { useContext, useEffect, useState } from "react";
import { useRequest } from "../../../abstracts";
import { CsplTable, ManageMapperLayout } from "../../../components";
import { CsplTable as Table } from "../../../components";
import { manageMapperStore } from "../../../contexts";
import { verifyMapService } from "../../../services";
import { getPathWithParam, MANAGE_MAPPER_ROUTES } from "../../../utils";
import { useRouterParams } from "../../../abstracts";

const propertyNames = [
  "EmployeeClassifications",
  "Compensations",
  "Contributions",
  "PayrollLoans",
];
const VerifyMapContainer = (props) => {
  const { state, dispatch } = useContext(manageMapperStore);
  const { flow, profileId } = useRouterParams();
  const [res, setRes] = useState([]);
  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
      link: getPathWithParam({
        path: `${MANAGE_MAPPER_ROUTES.RULESET}`,
        pathParam: [flow, profileId],
      }),
    },
  ];
  const columns = [
    {
      label: "Target Fields",
      columnName: "propertyName",
      className: "column-frequency",
    },
    {
      label: "Source Data",
      columnName: "propertyValue",
      className: "column-frequency",
    },
  ];
  const id = get(state, "api.data.id");
  const { response, loading } = useRequest({
    method: verifyMapService,
    payload: parseInt(get(state, "profileId")),
  });
  // const requiredResponse = !isEmpty(response)  ?
  // response.map(e => {

  //   if(propertyNames.includes(e.propertyName))
  //   {
  //     const a = e.propertyValue;
  //     setRes([...res,...a])
  //   }
  //   return e
  // }) : [];

  return (
    <ManageMapperLayout buttons={buttons}>
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
          {response?.map((source, index) => {
            if (propertyNames.includes(source.propertyName)) {
              return source.propertyValue.map((e, i) => (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {e[item.columnName]}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ));
            }
            return (
              <Table.Tr key={index}>
                {columns.map((item, cellIndex) => {
                  return (
                    <Table.Td key={cellIndex} className={item.className}>
                      {source[item.columnName]}
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ManageMapperLayout>
  );
};

export default VerifyMapContainer;
