import { get } from "lodash-es";
import React, { useContext, useEffect, useState } from "react";
import { CsplTable as Table, CustomColumnMenu } from "../../components";
import {
  faEllipsisVAlt,
  faFileDownload,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDeepEffect, useRequest } from "../../abstracts";
import {
  Grid,
  GridColumn,
  GridColumnMenuFilter,
} from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import sampleData from "./sampleData.json";

const columns = [
  {
    value: 1,
    label: "Plan name",
    className: "column-companyName",
    columnName: "planName",
    field: "planName",
    width: 233,
  },
  {
    value: 2,
    label: "File name",
    className: "column-ssn",
    columnName: "fileName",
    field: "fileName",
    width: 400,
  },
  {
    value: 3,
    label: "File status",
    className: "column-firstName",
    columnName: "fileStatus",
    field: "fileStatus",
    width: 250,
  },
  {
    value: 4,
    label: "Error description",
    className: "column-lastName",
    columnName: "errorDescription",
    field: "errorDescription",
    width: 250,
  },
  {
    value: 5,
    label: "Download output",
    className: "column-deletedBy",
    columnName: "downloadOutput",
    field: "downloadOutput",
    width: 250,
  },
];
const skip = 0;
const take = 10;

const BooleanCell = (props) => {
  if (props.field == "downloadOutput") {
    return (
      <td>
        <FontAwesomeIcon
          className={`text-${
            props.dataItem[props.field] ? "primary" : "secondary"
          }`}
          icon={faFileDownload}
          size="lg"
          color="#828282"
        />
      </td>
    );
  } else if (props.field == "errorDescription") {
    return (
      <td>
        <div>
          {props.dataItem[props.field] ? (
            <div style={{ color: "blue" }}>{props.dataItem[props.field]} </div>
          ) : (
            "Not Applicable"
          )}
        </div>
      </td>
    );
  }
};

class KendoGridDateCell extends React.Component {
  render() {
    const value = this.props.dataItem[this.props.field];

    // return <td>{value != null ? formatDate(new Date(value), "d") : ""}</td>;
    return <div>hello</div>;
  }
}

const OutputFilesTable = (props) => {
  const [tableContent, settableContent] = useState(columns);

  const [dataState, setDataState] = useState({
    skip: 0,
    take: sampleData.length,
  });
  const [result, setResult] = useState(sampleData, dataState);
  const [selectedColumns, setSelectedColumns] = useState([]);

  useDeepEffect(() => {
    setSelectedColumns(columns.map((item) => item.value));
    // setFinal(columns);
  }, []);

  const onColumnsSubmit = (columnsState) => {
    setSelectedColumns(columnsState);
  };

  const onDataStateChange = (event) => {
    setDataState(event.dataState);
    setResult(process(sampleData, event.dataState));
  };
  // const response = [
  //   { columnName: "propertyValue1", downloadOutput: true, planName: "401K", fileName: "Test file 1", fileStatus: "Active", errorDescription: "Not Applicable" },
  //   { columnName: "propertyValue1", downloadOutput: false, planName: "401K", fileName: "Test file 1", fileStatus: "Active", errorDescription: "Sample description" }
  // ]
  return (
    <div>
      {/* <Table>
        <Table.Thead>
          <Table.Tr>
            {columns.map((item, index) => {
              return (
                <Table.Th key={index} className={item.className}>
                  {item.label}
                  <FontAwesomeIcon
                    className="ml-auto"
                    icon={faEllipsisVAlt}
                    size="lg"
                    color="#828282"
                  />
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {response?.map((source, index) => {
            return (
              <Table.Tr key={index} className={(index % 2 == 0) ? "" : "bg-secondary bg-opacity-10"}>
                {columns.map((item, cellIndex) => {
                  return (
                    <Table.Td key={cellIndex} className={item.className}>
                      {
                        (item.columnName == columns[4].columnName) ?

                          <FontAwesomeIcon
                            className={`text-${source["downloadOutput"] == true ? "primary" : "secondary"}`}
                            icon={faFileDownload}
                            size="2x"
                            color="#828282"
                          /> :
                          <div>
                            {source[item.columnName]}
                          </div>
                      }
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table> */}

      <Grid
        //scrollable={true}
        //data={tableContent.slice(skip, skip + take)}
        data={result}
        //pageable={true}
        skip={skip}
        take={take}
        //onPageChange={onPageChange}
        total={sampleData.length}
        //filterable={true}
        //sortable={true}
        columnVirtualization={true}
        onDataStateChange={onDataStateChange}
        {...dataState}
        style={{ maxHeight: "430px" }}
      >
        {tableContent.map((column, idx) =>
          column.field == "downloadOutput" ||
          column.field == "errorDescription" ? (
            <GridColumn
              key={idx}
              field={column.field}
              width={column.width}
              title={column.label}
              filter={"numeric"}
              cell={BooleanCell}
              columnMenu={(props) => (
                <CustomColumnMenu
                  {...props}
                  columns={selectedColumns}
                  onColumnsSubmit={onColumnsSubmit}
                  tableData={sampleData}
                />
              )}
            />
          ) : (
            <GridColumn
              key={idx}
              field={column.field}
              width={column.width}
              title={column.label}
              filter={"numeric"}
              columnMenu={(props) => (
                <CustomColumnMenu
                  {...props}
                  columns={selectedColumns}
                  onColumnsSubmit={onColumnsSubmit}
                  tableData={sampleData}
                />
              )}
            />
          )
        )}
      </Grid>
    </div>
  );
};

export default OutputFilesTable;
