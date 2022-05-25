import React, { useContext, useEffect } from "react";
import { get, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import {
  ManageCompanyLayout,
  AddCompanyItemsLayout,
  CsplTable as Table,
} from "../../components";
import {
  MANAGE_COMPANY_ROUTES,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  usDateFormat,
  OPTIONS_DATA_MAPPER,
} from "../../utils";
import { useMockLoading, useRouterParams } from "../../abstracts";
import {
  clearMamangeCompanyLocalCacheByModel,
  manageCompanyStore,
} from "../../contexts";

const columns = [
  {
    label: "Frequency Name",
    className: "column-frequency-name",
    columnName: "frequencyName",
    link: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
  },
  {
    label: "Frequency",
    className: "column-frequency",
    columnName: "frequencyType",
  },
  {
    label: "Schedule start date",
    className: "column-schedule-start-date",
    columnName: "scheduleBeginDate",
  },
  {
    label: "Schedule end date",
    className: "column-schedule-end-date",
    columnName: "scheduleEndDate",
  },
  {
    label: "Next pay date",
    className: "column-next-pay-date",
    columnName: "nextPayDate",
  },
];

const ManagePayrollCalendarContainer = (props) => {
  const { state, dispatch } = useContext(manageCompanyStore);
  const payrollCalendarsData = get(state, "api.data.payrollCalendars", []);
  const { isMockLoading } = useMockLoading();
  const { companyId } = useRouterParams();

  useEffect(() => {
    dispatch(clearMamangeCompanyLocalCacheByModel("payrollCalendar"));
    dispatch(clearMamangeCompanyLocalCacheByModel("payrollCalendarPayPeriods"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddClick = () => {
    const { history } = props;
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
        pathParam: [FLOW_TYPES.ADD, companyId, payrollCalendarsData.length],
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
      {isEmpty(payrollCalendarsData) && (
        <AddCompanyItemsLayout
          content={
            <>
              No payroll calendar
              <br />
              has been created for this company.
            </>
          }
          buttonLabel="Add Payroll Calendar"
          link={getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
            pathParam: [FLOW_TYPES.ADD, companyId, payrollCalendarsData.length],
          })}
          className="mt-5"
        />
      )}
      {!isEmpty(payrollCalendarsData) && (
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
            {payrollCalendarsData.map((payrollFrequency, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    const getContent = () => {
                      if (
                        [
                          "scheduleBeginDate",
                          "scheduleEndDate",
                          "nextPayDate",
                        ].includes(item.columnName)
                      ) {
                        return usDateFormat(payrollFrequency[item.columnName]);
                      }

                      if ("frequencyType" === item.columnName) {
                        return (
                          OPTIONS_DATA_MAPPER.PAYROLLFREQUENCY_TYPE[
                            payrollFrequency[item.columnName]
                          ] || ""
                        );
                      }
                      if (item.link) {
                        return (
                          <Link
                            to={getAdvancedPathWithParam({
                              path: item.link,
                              pathParam: [FLOW_TYPES.EDIT, companyId, index],
                            })}
                          >
                            {payrollFrequency[item.columnName]}
                          </Link>
                        );
                      }
                      return payrollFrequency[item.columnName];
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
      )}
    </ManageCompanyLayout>
  );
};

export default ManagePayrollCalendarContainer;
