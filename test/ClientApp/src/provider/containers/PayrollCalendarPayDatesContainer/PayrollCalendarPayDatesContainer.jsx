import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { isEmpty, get } from "lodash";
import { Form, Row, Col } from "react-bootstrap";
import {
  ManageCompanyLayout,
  CsplTable as Table,
  AddButton,
  InnerLayoutHeaderTabs,
} from "../../components";
import { useRouterParams, useDeepEffect } from "../../abstracts";
import {
  manageCompanyStore,
  saveCompanyDetails,
  setManageCompanyLocalCache,
  setManageCompanyToastInfo,
} from "../../contexts";
import {
  MANAGE_COMPANY_ROUTES,
  getAdvancedPathWithParam,
  usDateFormat,
  FLOW_TYPES,
  ROUTES,
} from "../../utils";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";

const columns = [
  {
    label: " ",
    className: "column-sno",
    columnName: "sno",
  },
  {
    label: "Pay date",
    className: "column-pay-date",
    columnName: "payDate",
    link: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES,
  },
  {
    label: "Pay period begin date",
    className: "column-pay-period-begin-date",
    columnName: "beginDate",
  },
  {
    label: "Pay period end date",
    className: "column-pay-period-end-date",
    columnName: "endDate",
  },
  {
    label: "Pay period status",
    className: "column-pay-period-status",
    columnName: "payPeriodStatus",
  },
];

const PayrollCalendarPayDatesContainer = (props) => {
  const { state, dispatch } = useContext(manageCompanyStore);
  const [isFuturePayDateChecked, setIsFuturePayDateChecked] = useState(true);
  const { companyId, flow, frequencyId } = useRouterParams();
  const intFrequencyId = parseInt(frequencyId, 10);
  const apiResponse = get(state, "api", {});
  const isApiLoading = get(apiResponse, "isFetching", false);
  const payrollCalendarListData = get(state, "payrollCalendar", []);
  const formValues = get(payrollCalendarListData, intFrequencyId, {});
  const payPeriods = get(state, "payrollCalendarPayPeriods", []);
  const [isLoadingPayPeriods, setIsLoadingPayPeriods] = useState(false);
  const [filteredPayPeriods, setFilteredPayPeriods] = useState([]);
  const [futurePayPeriods, setFuturePayPeriods] = useState([]);
  const { history } = props;

  useDeepEffect(() => {
    if (isEmpty(futurePayPeriods)) {
      setFuturePayPeriods(
        payPeriods.filter(({ payDate }) => {
          return new Date(payDate) >= new Date();
        })
      );
    }

    setFilteredPayPeriods(
      payPeriods.filter(({ payDate }) => {
        return isFuturePayDateChecked ? new Date(payDate) >= new Date() : true;
      })
    );
  }, [payPeriods, isFuturePayDateChecked]);

  const onFuturePayCheckboxClick = () => {
    setIsFuturePayDateChecked(!isFuturePayDateChecked);
  };

  const addPayDatesClick = () => {
    const payPeriodId = payPeriods.length;
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES,
        pathParam: [FLOW_TYPES.ADD, companyId, frequencyId, payPeriodId],
      })
    );
  };

  const menuList = [
    {
      label: "SETTINGS",
      path: getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
        pathParam: [flow, companyId, frequencyId],
      }),
    },
    {
      label: "PAYDATES",
      path: getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
        pathParam: [flow, companyId, frequencyId],
      }),
      selected: true,
    },
  ];
  const onDeleteClick = () => {
    const frequencyName = payrollCalendarListData[intFrequencyId].frequencyName;
    saveCompanyDetails(
      {
        payrollCalendars: payrollCalendarListData.filter(
          ({ id }, index) => index !== intFrequencyId
        ),
      },
      dispatch,
      state
    ).then(() => {
      dispatch(
        setManageCompanyToastInfo({
          showToast: true,
          toastMessage: `Payroll calendar ${frequencyName} deleted successfully`,
        })
      );
      history.push(
        getAdvancedPathWithParam({
          path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
          pathParam: [flow, companyId],
        })
      );
    });
  };
  const getDataForSave = () => {
    return payrollCalendarListData.map((item, index) => {
      if (index === intFrequencyId) {
        return { ...item, payPeriods };
      }
      return {
        ...item,
      };
    });
  };

  const onSavePayDates = () => {
    saveCompanyDetails(
      {
        payrollCalendars: getDataForSave(),
      },
      dispatch,
      state
    ).then(() => {
      history.push(
        getAdvancedPathWithParam({
          path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
          pathParam: [FLOW_TYPES.EDIT, companyId],
        })
      );
      dispatch(
        setManageCompanyToastInfo({
          showToast: true,
          toastMessage: "Data saved successfully",
        })
      );
    });
  };
  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      link: getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
        pathParam: [flow, companyId],
      }),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      onClick: onSavePayDates,
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
        pathParam: [flow, companyId],
      }),
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
            pathParam: [FLOW_TYPES.SAVE, companyId, frequencyId],
          })
        ),
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTrashAlt,
      onClick: onDeleteClick,
    },
  ];
  // const buttons = [
  //   {
  //     label: "Cancel",
  //     variant: "secondary",
  //     type: "button",
  //     flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE, FLOW_TYPES.EDIT],
  //     link: getAdvancedPathWithParam({
  //       path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
  //       pathParam: [flow, companyId],
  //     }),
  //   },
  //   {
  //     label: "Save",
  //     variant: "primary",
  //     type: "submit",
  //     flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE, FLOW_TYPES.EDIT],
  //     onClick: onSavePayDates,
  //   },
  // ];
  return (
    <ManageCompanyLayout
      buttons={buttons}
      tabs={<InnerLayoutHeaderTabs menuList={menuList} />}
      pageFlow={flow}
    >
      <Row>
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-4 pay-dates-details">
            <div>
              <Form.Check
                custom
                id="isFuturePaydates"
                name="isFuturePaydates"
                type="checkbox"
                label="Show only future pay dates"
                onChange={onFuturePayCheckboxClick}
                checked={isFuturePayDateChecked}
              />
            </div>
            <div>Total pay dates: {payPeriods.length}</div>
            <div>Remaining pay dates: {futurePayPeriods.length}</div>
            <div>
              <AddButton onAddClick={addPayDatesClick} />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table isLoading={isLoadingPayPeriods}>
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
            <Table.Tbody
              isLoading={isApiLoading}
              totalRecords={filteredPayPeriods.length}
            >
              {filteredPayPeriods.map((payrollFrequency, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {!isEmpty(item.link) ? (
                            <Link
                              to={getAdvancedPathWithParam({
                                path: item.link,
                                pathParam: [
                                  FLOW_TYPES.EDIT,
                                  companyId,
                                  frequencyId,
                                  index,
                                ],
                              })}
                            >
                              {usDateFormat(payrollFrequency[item.columnName])}
                            </Link>
                          ) : item.columnName === "sno" ? (
                            index + 1
                          ) : (
                            usDateFormat(payrollFrequency[item.columnName])
                          )}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Col>
      </Row>
    </ManageCompanyLayout>
  );
};

export default PayrollCalendarPayDatesContainer;
