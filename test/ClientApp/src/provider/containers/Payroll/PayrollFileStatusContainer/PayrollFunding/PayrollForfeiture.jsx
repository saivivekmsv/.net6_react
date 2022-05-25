import React from "react";
import { CsplTable as Table, FieldInputDollar } from "../../../../components";
import { Field, FieldArray, useFormikContext } from "formik";
import { getNullTableItem, required } from "../../../../utils";
import { get } from "lodash";
import { useDeepEffect } from "../../../../abstracts";

const columns = [
  {
    label: "Forfeiture Type",
    className: "column-forfeiture-type",
    columnName: "forfeitureType",
  },
  {
    label: "Forfeiture Balance",
    className: "column-forfeiture-balance",
    columnName: "forfeitureBalance",
  },
  {
    label: "Funding Amount",
    className: "column-forfeiture-funding-amount",
    columnName: "fundingAmount",
  },
];

const PayrollFunding = ({ fields, data, parentIndex, parentFieldName }) => {
  // const [forfeiture, setForfeiture] = useState();
  let { values, setFieldValue, handleChange } = useFormikContext();
  const fieldArrayName = `${parentFieldName}[${parentIndex}].${fields.fundingAmount}`;
  const payrollFundingDetails = get(data, "forfeitureListDetails", []);

  useDeepEffect(() => {
    setFieldValue(fieldArrayName, data);
  }, [data]);

  return (
    <>
      <FieldArray name={fieldArrayName}>
        {() => {
          return (
            <Table className="error-report-table">
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
                {payrollFundingDetails.map((payrollItem, index) => {
                  const fundingAmount = get(
                    payrollFundingDetails,
                    `${[index]}.fundingAmount`,
                    0
                  );
                  // const forfeitureBalances = get(
                  //   payrollFundingDetails,
                  //   `${[index]}.forfeitureBalance`,
                  //   0
                  // );

                  return (
                    <Table.Tr key={index}>
                      {columns.map((item, cellIndex) => {
                        const getContent = () => {
                          const fieldName = `${fieldArrayName}[${index}].${item.columnName}`;
                          const forfeitureBalance =
                            Number(get(payrollItem, item.columnName, 0)) -
                              Number(fundingAmount) >=
                            0
                              ? Number(get(payrollItem, item.columnName, 0)) -
                                Number(fundingAmount)
                              : 0;
                          if (item.columnName === "fundingAmount") {
                            return (
                              <div
                                className="display-block"
                                style={{ marginLeft: "-3.5rem" }}
                              >
                                <Field
                                  name={fieldName}
                                  isRequired
                                  autoComplete="off"
                                  value={payrollItem[item.columnName]}
                                  onChange={handleChange}
                                  component={FieldInputDollar}
                                  validate={required}
                                />
                                <div>
                                  {data.forfeitureBalance < fundingAmount ? (
                                    <span className="err-msg">
                                      Amount should less than forfeiture balance
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            );
                          }
                          if (item.columnName === "forfeitureBalance") {
                            return <span>${forfeitureBalance}</span>;
                          }
                          return payrollItem[item.columnName];
                        };

                        return (
                          <Table.Td key={cellIndex} className={item.className}>
                            {getNullTableItem(getContent())}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}
                <Table.Tr>
                  <Table.Td className="column-forfeiture-type">
                    Funding from bank
                  </Table.Td>
                  <Table.Td className="column-forfeiture-balance"></Table.Td>
                  <Table.Td className="column-forfeiture-funding-amount">
                    <div> $ {data.fundingBank}</div>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td className="column-forfeiture-type">
                    Total funding
                  </Table.Td>
                  <Table.Td className="column-forfeiture-balance"></Table.Td>
                  <Table.Td className="column-forfeiture-funding-amount">
                    $ {data.totalFunding}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          );
        }}
      </FieldArray>
    </>
  );
};

export default PayrollFunding;
