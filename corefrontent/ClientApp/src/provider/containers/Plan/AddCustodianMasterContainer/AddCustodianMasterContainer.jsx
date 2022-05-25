import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { find, get, isEmpty, uniqBy } from "lodash";
import { Formik } from "formik";
import { ManagePlanLayout, CsplTable as Table } from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  getAdvancedPathWithParam,
  FLOW_TYPES,
} from "../../../utils";
import {
  useRouterParams,
  useTableChecboxSelect,
  useRequest,
} from "../../../abstracts";
import { getCustodianCompany } from "../../../services";
import {
  createPlanStore,
  savePlanDetailsAction,
  setManagePlanToastInfo,
} from "../../../contexts";
import AddToolTip from "../../../components/AddToolTip";

const AddCustodianMasterContainer = (props) => {
  const [newFlow] = useState("");
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow } = useRouterParams();
  const apiData = get(state, "api.data", {});
  const custodianListData = get(apiData, "custodians", []);
  const { response, loading } = useRequest({
    method: getCustodianCompany,
    defaultResponse: [],
  });
  const {
    data,
    isAllChecked,
    selectedData,
    onHeaderCheckboxClick,
    onRowItemClick,
  } = useTableChecboxSelect({
    response,
    listData: [...custodianListData],
  });
  const [dirtyFlag, setDirtyFlag] = useState(true);

  const buttons = [
    {
      link: getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.CUSTODIAN,
        pathParam: [FLOW_TYPES.EDIT, planId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      link: getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_CUSTODIAN,
        pathParam: [planId],
      }),
      label: "New Custodian",
      variant: "primary",
      type: "button",
    },
  ];

  const columns = [
    {
      label: "",
      className: "",
      columnName: "",
    },
    {
      label: "Custodian Company Name",
      className: "column-trusteeName",
      columnName: "custodianCompanyName",
    },
    {
      label: "Email",
      className: "column-trusteeMail",
      columnName: "email",
    },
    {
      label: "Phone Number",
      className: "column-trusteePhone",
      columnName: "phoneNumber",
    },
    {
      label: "Added to Plan",
      className: "column-trusteePlanAdded",
      columnName: "addedToPlan",
    },
  ];

  const onAddToPlanClick = ({ setFieldError, setFieldTouched }) => {
    setDirtyFlag(true);
    savePlanDetailsAction(
      {
        custodians: uniqBy([...custodianListData, ...selectedData], "id"),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: `Custodian(s) added successfully`,
          })
        );
        props.history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.CUSTODIAN,
            pathParam: [FLOW_TYPES.EDIT, planId],
          })
        );
      } else {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      }
    });
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {}}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ setFieldValue }) => {
        return (
          <ManagePlanLayout
            buttons={buttons}
            pageFlow={newFlow || flow}
            useBlockNavigationAlways
            blockNavigation={dirtyFlag}
          >
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div style={{ maxWidth: "80%", overflow: "scroll" }}>
                  <p className="selected-title-head py-2">
                    Selected custodian from master to add to plan
                  </p>
                  {selectedData &&
                    selectedData.map((item) => (
                      <span className="selected-table-value">
                        {item.custodianCompanyName}
                      </span>
                    ))}
                </div>
                <div className="">
                  <Button
                    variant="secondary"
                    disabled={
                      !selectedData.some(
                        (data) => data.checked && !data.disabled
                      )
                    }
                    onClick={onAddToPlanClick}
                    className="mr-2"
                  >
                    Add to Plan
                  </Button>
                </div>
              </div>
              <div className="plan-heading">Master Custodian Information</div>
              <Table isLoading={loading}>
                <Table.Thead>
                  <Table.Tr>
                    {columns.map((item, index) => {
                      if (index === 0) {
                        return (
                          <Table.Th key={index} className={item.className}>
                            <Form.Check
                              custom
                              name="master-sources-radio-head"
                              type="checkbox"
                              label=""
                              id={`master-sources-radio-head`}
                              onChange={onHeaderCheckboxClick}
                              checked={isAllChecked}
                            />
                          </Table.Th>
                        );
                      }
                      return (
                        <Table.Th key={index} className={item.className}>
                          {item.label}
                        </Table.Th>
                      );
                    })}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.map((custodian, index) => {
                    return (
                      <Table.Tr key={index}>
                        {columns.map((item, cellIndex) => {
                          if (cellIndex === 0) {
                            return (
                              <Table.Td
                                key={cellIndex}
                                className={item.className}
                              >
                                <Form.Check
                                  custom
                                  name="master-sources-radio-head"
                                  type="checkbox"
                                  label=""
                                  id={`master-sources-radio-head-${index}`}
                                  checked={custodian.checked}
                                  disabled={custodian.disabled}
                                  onChange={() => {
                                    setDirtyFlag(false);
                                    onRowItemClick(custodian);
                                  }}
                                />
                              </Table.Td>
                            );
                          } else if (item.columnName == "addedToPlan") {
                            return (
                              <Table.Td
                                key={cellIndex}
                                className={item.className}
                              >
                                <div style={{ width: "100px" }}>
                                  {custodian.disabled ? "Added" : ""}
                                </div>
                              </Table.Td>
                            );
                          }
                          return (
                            <Table.Td
                              key={cellIndex}
                              className={item.className}
                            >
                              {!isEmpty(item.link) ? (
                                <Link
                                  to={getAdvancedPathWithParam({
                                    path: item.link,
                                    pathParam: [flow, planId, custodian.id],
                                  })}
                                >
                                  {custodian[item.columnName]}
                                </Link>
                              ) : item.dataMapper ? (
                                item.dataMapper[custodian[item.columnName]]
                              ) : (
                                <AddToolTip name={custodian[item.columnName]} />
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
      }}
    </Formik>
  );
};

export default AddCustodianMasterContainer;
