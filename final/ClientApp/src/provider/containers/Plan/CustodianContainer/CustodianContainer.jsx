import React, { useContext } from "react";
import {
  ManagePlanLayout,
  CsplTable as Table,
  AddPlans,
  LoaderWrapper,
} from "../../../components";
import { isEmpty, get } from "lodash";
import { Link } from "react-router-dom";
import {
  getPathWithParam,
  MANAGE_PLAN_ROUTES,
  FLOW_TYPES,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import { createPlanStore } from "../../../contexts";
import AddToolTip from "../../../components/AddToolTip";

const columns = [
  {
    label: "Custodian Company Name",
    className: "column-custodianName",
    columnName: "custodianCompanyName",
  },
  {
    label: "Email",
    className: "column-custodianMail",
    columnName: "email",
  },
  {
    label: "Phone Number",
    className: "column-custodianPhone",
    columnName: "mobilePhoneNumber",
  },
];

const CustodianContainer = (props) => {
  const { state } = useContext(createPlanStore);
  const { planId } = useRouterParams();
  const custodianData = get(state, "api.data.custodians", []);
  const newCustodianLink = getPathWithParam({
    path: MANAGE_PLAN_ROUTES.ADD_CUSTODIAN_MASTER,
    pathParam: [planId],
  });

  const buttons = [
    {
      link: newCustodianLink,
      label: "Add Custodian",
      variant: "primary",
      type: "button",
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons}>
      {isEmpty(custodianData) && (
        <LoaderWrapper>
          <AddPlans
            content={
              <>
                No custodians have been
                <br />
                created for this plan.
              </>
            }
            buttonLabel="Add Custodian"
            link={getPathWithParam({
              path: MANAGE_PLAN_ROUTES.ADD_CUSTODIAN_MASTER,
              pathParam: [planId],
            })}
          />
        </LoaderWrapper>
      )}
      {!isEmpty(custodianData) && (
        <LoaderWrapper>
          <div className="w-100">
            <div className="d-flex w-100 align-items-center justify-content-between mb-4">
              <div className="m-0 plan-heading">Custodian Information</div>
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
                {custodianData.map((custodian, index) => {
                  return (
                    <Table.Tr key={index}>
                      <Table.Td className="column-custodianName">
                        <Link
                          style={{ width: "100%" }}
                          to={getPathWithParam({
                            path: MANAGE_PLAN_ROUTES.ADD_CUSTODIAN,
                            pathParam: [FLOW_TYPES.EDIT, planId, custodian.id],
                          })}
                        >
                          <AddToolTip name={custodian.custodianCompanyName} />
                        </Link>
                      </Table.Td>
                      <Table.Td className="column-custodianMail">
                        <AddToolTip name={custodian.contactDetails.email} />
                      </Table.Td>
                      <Table.Td className="column-custodianPhone">
                        <AddToolTip
                          name={custodian.contactDetails.mobilePhoneNumber}
                        />
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        </LoaderWrapper>
      )}
    </ManagePlanLayout>
  );
};

export default CustodianContainer;
