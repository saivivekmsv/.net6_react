import React from "react";
import { get } from "lodash";
import { useRequest } from "../../../../shared/abstracts";
import { getSourceLevelPayrollDetailsByFileId } from "../../../services";
import PayrollAndCensus from "../../../../shared/mocks/payrollAndCensusData.json";
import { find } from "lodash";
import { useRouterParams } from "../../../../shared/abstracts";

const ContributionBreak = (props) => {
  const { response: data, loading: isLoading } = useRequest({
    method: getSourceLevelPayrollDetailsByFileId,
    payload: 1,
    defaultResponse: [],
  });

  // console.log(data)

  return (
    <>
      {data.map((data, index) => (
        <>
          <div className="d-flex justify-content-between mt-10">
            <div>
              <p className="grey-text ft-12 mb-0">Plan name</p>
              <p className="black-text ft-14 font-weight-500">
                {data.planName}
              </p>
            </div>
            <div>
              <p className="grey-text ft-12 mb-0">Pay date</p>
              <p className="black-text ft-14 font-weight-500">{data.payDate}</p>
            </div>
          </div>
          <div className="payroll-contribution-table-view">
            <div className="d-flex justify-content-between table-head">
              <div>Contribution Breakup</div>
              <div>Amount</div>
            </div>
            <div className="table-body">
              {data.sourceTransactionDetails.map((data, index) => (
                <>
                  <div className="d-flex justify-content-between" key={index}>
                    <div> {data.name}</div>
                    <div>$ {data.amount}</div>
                  </div>
                </>
              ))}
              <div className="line-separator"></div>
              <div className="d-flex justify-content-between">
                <div>Loan Repayments</div>
                <div>
                  ${" "}
                  {data.loanTransactionDetails.reduce(
                    (a, v) => (a = a + v.amount),
                    0
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div>Total</div>
                <div>$ {data.total}</div>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default ContributionBreak;
