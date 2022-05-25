import React from "react";
import { get, isEmpty, map } from "lodash";
const PayrollTransactionDetails = ({ data: TransDetail }) => {
  return (
    <>
      {TransDetail &&
        TransDetail.map((data, index) => (
          <>
            <div>
              <div>
                <p className="grey-text ft-12">Plan name</p>
                <p className="black-text ft-14 font-weight-500">
                  {data.planName}
                </p>
              </div>
            </div>

            <div>
              <p className="grey-text ft-12">Pay date</p>
              <p className="black-text ft-14 font-weight-500">{data.payDate}</p>
            </div>
            <div className="payroll-transaction-table-view">
              <div className="d-flex justify-content-between table-head">
                <div>Contribution Breakup</div>
                <div>Amount</div>
              </div>
              <div className="table-body">
                {/* <div className="d-flex justify-content-between"> */}
                {data.transactionSourceDetails.map((data, index) => (
                  <div className="d-flex justify-content-between">
                    {/* <div>
                      <p className="ft-12 grey-text mb-15">Source Id</p>
                      <p className="ft-14 black-text">{data.sourceId}</p>
                    </div> */}
                    {/* <div className="d-flex justify-content-between"> */}
                    <div>{data.sourceName} </div>
                    <div>${data.amount}</div>
                    {/* </div> */}
                  </div>
                ))}
                {/* </div> */}

                <div className="d-flex justify-content-between">
                  <div>Loan Repayment</div>
                  <div>$ {data.loanRepayments}</div>
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

export default PayrollTransactionDetails;
