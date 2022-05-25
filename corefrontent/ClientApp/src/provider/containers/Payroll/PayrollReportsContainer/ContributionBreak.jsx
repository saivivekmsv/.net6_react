import React from "react";
import { get } from "lodash";
import { useRequest } from "../../../abstracts";
import { getSourceLevelPayrollDetailsByFileId } from "../../../services";
import PayrollAndCensus from "../../../mocks/payrollAndCensusData.json";
import { find } from "lodash";
import { useRouterParams } from "../../../abstracts";
import { usDateFormat } from "../../../utils";

const ContributionBreak = (props) => {
  const { payrollId } = props;
  const { response: data, loading: isLoading } = useRequest({
    method: getSourceLevelPayrollDetailsByFileId,
    payload: payrollId,
    defaultResponse: [],
  });
  const contributionDetails = data?.contributionDetails;

  return (
    <>
      {contributionDetails &&
        contributionDetails.map((data, index) => (
          <div key={index}>
            {data.dataTransactions.map((item, index) => (
              <div key={index}>
                <div className="d-flex justify-content-between mt-10">
                  <div>
                    <p className="grey-text ft-12 mb-0">Plan name</p>
                    <p className="black-text ft-14 font-weight-500">
                      {data.planName}
                    </p>
                  </div>
                  <div>
                    <p className="grey-text ft-12 mb-0">Pay date</p>
                    <p className="black-text ft-14 font-weight-500">
                      {usDateFormat(item.payDate)}
                    </p>
                  </div>
                </div>
                <div className="payroll-contribution-table-view">
                  <div className="d-flex justify-content-between table-head">
                    <div>Payroll file total</div>
                    <div>Amount</div>
                  </div>
                  <div className="table-body">
                    {item.sourceTransactionDetails.map((source, index) => (
                      <>
                        <div
                          className="d-flex justify-content-between"
                          key={index}
                        >
                          <div> {source.name}</div>
                          <div>$ {source.amount}</div>
                        </div>
                      </>
                    ))}

                    <div className="line-separator"></div>
                    <div className="d-flex justify-content-between">
                      <div>Loan Repayments</div>
                      <div>
                        ${" "}
                        {/* {item.loanTransactionDetails.map((loan, index) => (
                          <div key={index}> */}
                        {item.loanTransactionDetails.reduce(
                          (a, v) => (a = a + v.amount),
                          0
                        )}
                        {/* </div>
                        ))} */}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>Total</div>
                      <div>$ {item.total}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
    </>
  );
};

export default ContributionBreak;
