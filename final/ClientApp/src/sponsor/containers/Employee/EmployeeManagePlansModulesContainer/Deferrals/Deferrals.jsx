import React from "react";
import { CsplTable as Table, Link } from "../../../../../shared/components"
import sourceDeferrals from "../../../../../shared/mocks/plansDeferrals1.json";
import {
  getNullTableItem,
  usDateFormat,
  MANAGE_CENSUS_ROUTES,
  ROUTES,
  getPathWithParam,
  FLOW_TYPES,
} from "../../../../../shared/utils"
import { useRequest, useRouterParams } from "../../../../../shared/abstracts";
import { getSourceDeferral } from "../../../../services";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const columns = [
  {
    label: "Source Name",
    className: "column-deferrals-source col-sm-2",
    columnName: "sourceName",
  },
  {
    label: "Entry Date",
    className: "column-deferrals-source col-sm-2",
    columnName: "EntryDate",
  },
  // {
  //   label: "Minimum",
  //   className: "column-minimumDeferral col-md-2",
  //   columnName: "minimumAmount",
  // },
  // {
  //   label: "Maximum",
  //   className: "column-maximumDeferral col-md-2",
  //   columnName: "maximumAmount",
  // },
  {
    label: "Deferral Range (Min-Max)",
    className: "column-deferrals col-sm-2",
    columnName: "deferralRange",
  },
  {
    label: "Deferral Election",
    className: "column-deferralElection  col-sm-1",
    columnName: "deferralElection",
  },
  {
    label: "Enrollment Date",
    className: "column-enrollmentDate col-sm-2",
    columnName: "enrollmentDate",
  },
  {
    label: "Enrollment Status",
    className: "column-enrollmentStatus col-sm-2",
    columnName: "enrollmentStatus",
  },
  {
    label: "Enrollment History",
    className: "column-enrollmentHistory col-sm-1 text-left",
    columnName: "enrollmentHistory",
  },
];
// const onViewButtonClick = (data) => {};
const Deferrals = (props) => {
  const { history, planName } = props;
  const { censusId, planId } = useRouterParams();
  const intPlanId = parseInt(planId, 10);

  // const { loading: isLoading, response: sourceDeferrals } = useRequest({
  //   method: getSourceDeferral,
  //   payload: intPlanId,
  // });

  const onClickPush = () => {
    history.push(
      getPathWithParam({
        path: MANAGE_CENSUS_ROUTES.MANUAL_ENROLLMENT,
        pathParam: [FLOW_TYPES.ADD, censusId, planId],
        queryParam: ["?name=" + planName],
      })
    );
  };

  return (
    <>
      <div className="d-flex w-100 align-items-center justify-content-between">
        <div className="plan-sub-heading">
          Employee Enrollment Detail&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div className="align-center">
          <Button
            type="button"
            className="add-btn"
            onClick="{toggleHoursForm}"
            variant="secondary"
          >
            Opt out of plan
          </Button>
          &nbsp;
          <Link>
            <Button
              type="button"
              className="add-btn"
              variant="secondary"
              onClick={() => onClickPush()}
            >
              Enroll
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-2">
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
            {sourceDeferrals &&
              sourceDeferrals.map((deferrals, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      var fieldValue = "";
                      if (item.columnName === "EntryDate") {
                        fieldValue = usDateFormat(deferrals[item.columnName]);
                      } else if (item.columnName === "enrollmentHistory") {
                        return <Link>View</Link>;
                      } else fieldValue = deferrals[item.columnName];

                      const getContent = () => {
                        return fieldValue;
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
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
};

export default Deferrals;
