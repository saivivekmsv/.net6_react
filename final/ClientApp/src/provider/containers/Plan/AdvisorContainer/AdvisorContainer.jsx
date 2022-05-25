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
    label: "Advisor Company Name",
    className: "column-custodianName",
    columnName: "advisorsCompanyName",
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

const AdvisorContainer = (props) => {
  const { state } = useContext(createPlanStore);
  const { planId } = useRouterParams();
  const advisorsData = get(state, "api.data.advisors", []);
  const newAdvisorsLink = getPathWithParam({
    path: MANAGE_PLAN_ROUTES.ADD_ADVISOR_MASTER,
    pathParam: [planId],
  });

  const buttons = [
    {
      link: newAdvisorsLink,
      label: "Add Advisor",
      variant: "primary",
      type: "button",
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons}>
      {isEmpty(advisorsData) && (
        <LoaderWrapper>
          <AddPlans
            content={
              <>
                No advisors have been
                <br />
                created for this plan.
              </>
            }
            buttonLabel="Add Advisor"
            link={getPathWithParam({
              path: MANAGE_PLAN_ROUTES.ADD_ADVISOR_MASTER,
              pathParam: [planId],
            })}
          />
        </LoaderWrapper>
      )}
      {!isEmpty(advisorsData) && (
        <LoaderWrapper>
          <div className="w-100">
            <div className="d-flex w-100 align-items-center justify-content-between mb-4">
              <div className="m-0 plan-heading">Advisor Information</div>
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
                {advisorsData.map((advisors, index) => {
                  return (
                    <Table.Tr key={index}>
                      <Table.Td className="column-trusteeName">
                        <Link
                          style={{ width: "100%" }}
                          to={getPathWithParam({
                            path: MANAGE_PLAN_ROUTES.ADD_ADVISOR,
                            pathParam: [FLOW_TYPES.EDIT, planId, advisors.id],
                          })}
                        >
                          <AddToolTip name={advisors.advisorCompanyName} />
                        </Link>
                      </Table.Td>
                      <Table.Td className="column-trusteeMail">
                        <AddToolTip name={advisors.contactDetails.email} />
                      </Table.Td>
                      <Table.Td className="column-trusteePhone">
                        <AddToolTip
                          name={advisors.contactDetails.mobilePhoneNumber}
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

export default AdvisorContainer;
