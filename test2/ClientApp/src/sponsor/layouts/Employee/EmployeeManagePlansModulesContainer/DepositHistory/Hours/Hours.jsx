import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get, isEmpty } from "lodash";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CsplTable as Table, SliderPanel } from "shared/components";
import {
  useRequest,
  useRouterParams,
  useDeepEffect,
} from "shared/abstracts";
import { getPlansHours } from "sponsor/services";
import AddHours from "./AddHours";
import { censusFormFields, usDateFormat } from "shared/utils"

const columns = [
  {
    label: "Pay date",
    className: "column-payDate",
    columnName: "payDate",
  },
  {
    label: "Pay period hours",
    className: "column-payPeriodHours",
    columnName: "payPeriodHours",
  },
  {
    label: "Updated Through",
    className: "column-updatedThrough",
    columnName: "uploadedThrough",
  },
  {
    label: "Updated By",
    className: "column-updatedBy",
    columnName: "updatedBy",
  },
  {
    label: "Comments",
    className: "column-comments",
    columnName: "comments",
    link: `link`,
  },
];
const updatedBy = [null, "Admin"];
const Hours = (props) => {
  const [filteredResponse] = useState([]);
  const [showHoursForm, setShowHoursForm] = useState(false);
  const [isLoading] = useState(false);
  const { censusId } = useRouterParams();
  const [totalPay, setTotalPay] = useState(0);
  const [hoursList, setHoursList] = useState([]);
  const [toggle, setToggle] = useState(false);

  useDeepEffect(() => {
    getPlansHours(censusId).then((response) => {
      setHoursList(response);
      console.log(response);
    });
  }, [toggle]);

  // const { response, loading } = useRequest({
  //   method: getPlansHours,
  //   payload: censusId,
  //   defaultResponse: filteredResponse,
  // });
  // console.log(response);

  var totPayHours = 0;
  if (!isEmpty(hoursList)) {
    hoursList.map((hr, initValue) => {
      totPayHours = totPayHours + hr.payPeriodHours;
    });
  }
  console.log(totPayHours, "payPeriodHours");

  const toggleHoursForm = () => {
    setShowHoursForm(!showHoursForm);
  };

  return (
    <>
      {!showHoursForm && (
        <div className="w-100 hours-table">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <div className="plan-sub-heading">
              Total Pay Period Hours &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{totPayHours}
            </div>
            <div className="align-center">
              <Button
                type="button"
                className="add-btn"
                onClick={toggleHoursForm}
                variant="secondary"
              >
                Add PayPeriod Hours
              </Button>
            </div>
          </div>

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
              {hoursList.map((hours, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {!isEmpty(item.link) ? (
                            <OverlayTrigger
                              overlay={<Tooltip>{hours.tooltip}</Tooltip>}
                            >
                              <Link>{hours[item.columnName]}</Link>
                            </OverlayTrigger>
                          ) : item.dataMapper ? (
                            item.dataMapper[hours[item.columnName]]
                          ) : item.columnName === "payDate" ? (
                            usDateFormat(hours[item.columnName])
                          ) : item.columnName === "updatedBy" ? (
                            updatedBy[hours[item.columnName]]
                          ) : (
                            hours[item.columnName]
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
      )}
      {/* {showHoursForm && (
        <AddHours
          {...props}
          toggleHoursForm={toggleHoursForm}
          setToggle={setToggle}
          toggle={toggle}
        />

        
      )} */}
      <SliderPanel isOpen={showHoursForm} size="55" showCancel={false}>
        <div className="d-flex mr-600">
          <AddHours
            {...props}
            toggleHoursForm={toggleHoursForm}
            setToggle={setToggle}
            toggle={toggle}
          />
        </div>
      </SliderPanel>
    </>
  );
};

export default Hours;
