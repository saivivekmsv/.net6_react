import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { get, isEmpty } from "lodash";
import { Row, Col } from "react-bootstrap";
import { ManagePlanLayout, CsplTable as Table } from "../../../components";
import { getPathWithParam, toCurrency } from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import { createPlanStore } from "../../../contexts";

const columns = [
  {
    label: "Forfeiture Type",
    className: "column-source-name",
    columnName: "name",
  },
  {
    label: "Forfeiture Balance",
    className: "column-source-catergory",
    columnName: "balance",
  },
];

const ForfeitureContainer = (props) => {
  const { flow, planId } = useRouterParams();
  const { state } = useContext(createPlanStore);
  const forfeituresData = get(state, "api.data.forfeitures", []);

  return (
    <ManagePlanLayout pageFlow={flow}>
      <div className="w-100">
        <div className="d-flex w-100 align-items-center justify-content-between mb-4">
          <div className="m-0 plan-heading">Forfeiture Information</div>
        </div>
        <Row className="forfeiture-total-head">
          <Col>
            <div className="d-flex">
              <div className="w-46">Total Forfeiture Balance</div>
              <div className="w-50">
                {toCurrency(
                  forfeituresData.reduce((total, current) => {
                    return total + current.balance;
                  }, 0)
                )}
              </div>
            </div>
          </Col>
        </Row>
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
            {forfeituresData.map((source, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {!isEmpty(item.link) ? (
                          <Link
                            to={getPathWithParam({
                              path: item.link,
                              pathParam: [flow, planId],
                            })}
                          >
                            {source[item.columnName]}
                          </Link>
                        ) : item.dataMapper ? (
                          item.dataMapper[source[item.columnName]]
                        ) : (
                          source[item.columnName]
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
    </ManagePlanLayout>
  );
};

export default ForfeitureContainer;
