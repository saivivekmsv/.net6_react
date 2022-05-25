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
    label: "Trustee Company Name",
    className: "column-custodianName",
    columnName: "trusteeCompanyName",
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

const TrusteeContainer = (props) => {
  const { state } = useContext(createPlanStore);
  const { planId } = useRouterParams();
  const trusteeData = get(state, "api.data.trustees", []);
  const newTrusteeLink = getPathWithParam({
    path: MANAGE_PLAN_ROUTES.ADD_TRUSTEE_MASTER,
    pathParam: [planId],
  });

  const buttons = [
    {
      link: newTrusteeLink,
      label: "Add Trustee",
      variant: "primary",
      type: "button",
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons}>
      {isEmpty(trusteeData) && (
        <LoaderWrapper>
          <AddPlans
            content={
              <>
                No trustees have been
                <br />
                created for this plan.
              </>
            }
            buttonLabel="Add Trustee"
            link={getPathWithParam({
              path: MANAGE_PLAN_ROUTES.ADD_TRUSTEE_MASTER,
              pathParam: [planId],
            })}
          />
        </LoaderWrapper>
      )}
      {!isEmpty(trusteeData) && (
        <LoaderWrapper>
          <div className="w-100">
            <div className="d-flex w-100 align-items-center justify-content-between mb-4">
              <div className="m-0 plan-heading">Trustee Information</div>
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
                {trusteeData.map((trustee, index) => {
                  return (
                    <Table.Tr key={index}>
                      <Table.Td className="column-custodianName">
                        <Link
                          style={{ width: "100%" }}
                          to={getPathWithParam({
                            path: MANAGE_PLAN_ROUTES.ADD_TRUSTEE,
                            pathParam: [FLOW_TYPES.EDIT, planId, trustee.id],
                          })}
                        >
                          <AddToolTip name={trustee.trusteeCompanyName} />
                        </Link>
                      </Table.Td>
                      <Table.Td className="column-custodianMail">
                        <AddToolTip name={trustee.contactDetails.email} />
                      </Table.Td>
                      <Table.Td className="column-custodianPhone">
                        <AddToolTip
                          name={trustee.contactDetails.mobilePhoneNumber}
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

export default TrusteeContainer;
