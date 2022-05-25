import React, { useEffect, useState } from "react";
import {
  getTempEmployeeDetailsforPayroll,
  retrievePayrollDetailsByFileId,
  getFundingTransactionDetailsOfEmployeeInPayrollSubmissionPage,
} from "../../services";
import { usDateFormat, ssnMasking } from "../../utils";
import { isEmpty } from "lodash";
const PayrollPendingSubmission = ({ data, fileId, hideField }) => {
  const [toggle, setToggle] = useState();
  const [payrollData, setPayrollData] = useState([]);
  const [payrollDataView, setPayrollDataView] = useState([]);

  useEffect(() => {
    getFundingTransactionDetailsOfEmployeeInPayrollSubmissionPage({
      fileId: fileId,
      employeeId: data,
    }).then((response) => {
      setPayrollData(response);
      setToggle(false);
    });
    retrievePayrollDetailsByFileId(fileId).then((res) => {
      setPayrollDataView(res);
      setToggle(false);
    });
  }, [toggle]);

  return (
    <>
      {hideField === false &&
        !isEmpty(payrollData) &&
        payrollData.map((payrollData) => (
          <>
            <div>
              <p className="ft-12 black-text mb-0 mt-20">
                {ssnMasking(payrollData.uniquePersonalIdentification) || ""}
              </p>
              <p className="ft-14 black-text font-weight-500">
                {`${payrollData.firstName || ""} ${payrollData.lastName || ""}`}
              </p>
            </div>
            {payrollData.employeePayrollTransactions.map((employee) => (
              <>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="grey-text ft-12">Plan name</p>
                    <p className="black-text ft-14 font-weight-500">
                      {employee.planName}
                    </p>
                  </div>
                  <div>
                    <p className="grey-text ft-12">Plan ID</p>
                    <p className="black-text ft-14 font-weight-500">
                      {employee.rkPlanNumber}
                    </p>
                  </div>
                  <div>
                    <p className="grey-text ft-12">Pay date</p>
                    <p className="black-text ft-14 font-weight-500">
                      {usDateFormat(employee.payDate)}
                    </p>
                  </div>
                </div>
                <div className="payroll-file-table-view">
                  <div className="d-flex justify-content-between table-head">
                    <div>Sources</div>
                    <div>Amount</div>
                  </div>
                  <div className="table-body">
                    {employee.transactionSourceDetails.map((item, index) => (
                      <div
                        className="d-flex justify-content-between"
                        key={`source${index}`}
                      >
                        <div>{item.sourceName}</div>
                        <div>$ {parseFloat(item.amount)?.toFixed(2)}</div>
                      </div>
                    ))}
                    <div className="line-separator" />
                    <div className="d-flex justify-content-between">
                      <div>Loan Repayments</div>
                      <div>
                        $ {parseFloat(employee.loanRepayments)?.toFixed(2)}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>Total</div>
                      <div>$ {parseFloat(employee.total)?.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </>
        ))}
      {hideField === true &&
        !isEmpty(payrollDataView) &&
        payrollDataView.map((data) =>
          data.payrollTransactions.map((transaction) => (
            <>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="grey-text ft-12">Plan name</p>
                  <p className="black-text ft-14 font-weight-500">
                    {data.planName}
                  </p>
                </div>
                <div>
                  <p className="grey-text ft-12">Pay date</p>
                  <p className="black-text ft-14 font-weight-500">
                    {usDateFormat(transaction.payDate)}
                  </p>
                </div>
                <div>
                  <p className="grey-text ft-12">Total Records</p>
                  <p className="black-text ft-14 font-weight-500">
                    {data.totalRecords}
                  </p>
                </div>
              </div>
              <div className="payroll-file-table-view">
                <div className="d-flex justify-content-between table-head">
                  <div>Sources</div>
                  <div>Amount</div>
                </div>
                <div className="table-body">
                  {transaction.transactionSourceDetails.map((item, index) => (
                    <div
                      className="d-flex justify-content-between"
                      key={`source${index}`}
                    >
                      <div>{item.sourceName}</div>
                      <div>$ {parseFloat(item.amount)?.toFixed(2)}</div>
                    </div>
                  ))}
                  <div className="line-separator" />
                  <div className="d-flex justify-content-between">
                    <div>Loan Repayments</div>
                    <div>
                      $ {parseFloat(transaction.loanRepayments)?.toFixed(2)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>Total</div>
                    <div>$ {parseFloat(transaction.total)?.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </>
          ))
        )}
    </>
  );
};

export default PayrollPendingSubmission;
