import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import { CsplTable as Table } from "../../../../shared/components";

const VerifyMapContainer = (props) => {
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
    },
  ];
  const columns = [
    {
      label: "Target Fields",
      columnName: "Target Fields",
      className: "none",
    },
    {
      label: "Source Data",
      columnName: "Source Data",
      className: "none",
    },
  ];

  const TableData = [
    { "Target Fields": "Dummy1", "Source Data": "Value 1" },
    { "Target Fields": "Dummy2", "Source Data": "Value 2" },
    { "Target Fields": "Dummy3", "Source Data": "Value 3" },
    { "Target Fields": "Dummy4", "Source Data": "Value 4" },
    { "Target Fields": "Dummy5", "Source Data": "Value 5" },
    { "Target Fields": "Dummy1", "Source Data": "Value 1" },
    { "Target Fields": "Dummy2", "Source Data": "Value 2" },
    { "Target Fields": "Dummy3", "Source Data": "Value 3" },
    { "Target Fields": "Dummy4", "Source Data": "Value 4" },
    { "Target Fields": "Dummy5", "Source Data": "Value 5" },
    { "Target Fields": "Dummy1", "Source Data": "Value 1" },
    { "Target Fields": "Dummy2", "Source Data": "Value 2" },
    { "Target Fields": "Dummy3", "Source Data": "Value 3" },
    { "Target Fields": "Dummy4", "Source Data": "Value 4" },
    { "Target Fields": "Dummy5", "Source Data": "Value 5" },
    { "Target Fields": "Dummy1", "Source Data": "Value 1" },
    { "Target Fields": "Dummy2", "Source Data": "Value 2" },
    { "Target Fields": "Dummy3", "Source Data": "Value 3" },
    { "Target Fields": "Dummy4", "Source Data": "Value 4" },
    { "Target Fields": "Dummy5", "Source Data": "Value 5" },
    { "Target Fields": "Dummy1", "Source Data": "Value 1" },
    { "Target Fields": "Dummy2", "Source Data": "Value 2" },
    { "Target Fields": "Dummy3", "Source Data": "Value 3" },
    { "Target Fields": "Dummy4", "Source Data": "Value 4" },
    { "Target Fields": "Dummy5", "Source Data": "Value 5" },
  ];

  return (
    <ManageMapperLayout buttons={buttons}>
      <Table className="border-0">
        <Table.Thead
          className=" bg-transparent mapper-verifymap-tableheader"
          style={{ width: "100%" }}
        >
          <Table.Tr style={{ width: "50%" }}>
            {columns.map((item, index) => {
              return (
                <Table.Th key={index} className={item.className}>
                  <div style={{ fontSize: "12px" }}> {item.label} </div>
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {TableData.map((source, index) => {
            return (
              <div className="border-bottom">
                <Table.Tr
                  className="mapper-verifymap-tablerow"
                  key={index}
                  style={{ width: "50%" }}
                >
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td
                        key={cellIndex}
                        className={item.className}
                        style={{ fontSize: "14px" }}
                      >
                        <div style={{ fontSize: "14px", padding: "5px" }}>
                          {" "}
                          {source[item.columnName]}
                        </div>
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              </div>
            );
          })}
        </Table.Tbody>
      </Table>
    </ManageMapperLayout>
  );
};

export default VerifyMapContainer;
