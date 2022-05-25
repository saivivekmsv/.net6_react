import React from "react";
import { CsplTable as Table } from "../../../../components";
import { getPlansEmployeeClassificationHistory } from "../../../../services";
import { useRequest, useRouterParams } from "../../../../abstracts";
import { isEmpty, get } from "lodash";
import { useState } from "react";
import { usDateFormat } from "../../../../utils";
import { EmployeeClassificationTable } from "./EmployeeClassificationTable";

const columns = [
  {
    label: "Classification type",
    className: "column-classificationType",
    columnName: "classificationTypeName",
  },
  {
    label: "Classification code",
    className: "column-classificationCode",
    columnName: "code",
  },
  {
    label: "Effective start date",
    className: "column-startDate",
    columnName: "effectiveStartDate",
  },
  {
    label: "Effective end date",
    className: "column-endDate",
    columnName: "effectiveEndDate",
  },
];

const EmployeeClassificationSliderTable = ({ data, isEdit }) => {
  console.log("Pkk", data);
  const employeeClassification = get(data, "employeeClassificationHistory", "");
  // const { censusId, flow } = useRouterParams();
  // const { response } = useRequest({
  //   method: getPlansEmployeeClassificationHistory,
  //   payload: {
  //     employeeId: censusId,
  //     classificationTypeId: get(data, "id", "123"),
  //   },
  //   defaultResponse: [],
  // });

  return (
    <div className="employee-slider-table">
      <div className="plan-sub-heading">Employee Classification</div>
      <div className="header-details">
        <div className="label">Classification type</div>
        <div className="value">{get(data, "classificationTypeName", "")}</div>
      </div>
      <div className="d-flex mt-10">
        <div className="header-details">
          <div className="label">Classification code</div>
          <div className="value">{get(data, "code", "")}</div>
        </div>
        <div className="header-details">
          <div className="label">Classification name</div>
          <div className="value">{get(data, "classificationName", "")}</div>
        </div>
        <div className="header-details">
          <div className="label">Start date</div>
          <div className="value">
            {usDateFormat(get(data, "effectiveStartDate", ""))}
          </div>
        </div>
        <div className="header-details">
          <div className="label">End date</div>
          <div className="value">
            {usDateFormat(get(data, "effectiveEndDate", ""))}
          </div>
        </div>
      </div>
      <div className="line-separator" />
      <div className="plan-sub-heading">Employee Classification History</div>
      <EmployeeClassificationTable
        data={employeeClassification}
        isEdit={isEdit}
      />
    </div>
  );
};

export default EmployeeClassificationSliderTable;
