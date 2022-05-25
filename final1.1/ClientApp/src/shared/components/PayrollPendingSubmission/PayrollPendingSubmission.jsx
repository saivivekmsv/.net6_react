import React, { useEffect, useState } from "react";
import {
  getTempEmployeeDetailsforPayroll,
  retrievePayrollDetailsByFileId,
} from "../../services";
import { usDateFormat, ssnMasking } from "../../utils";
import { isEmpty } from "lodash";
const PayrollPendingSubmission = ({ data, fileId, hideField }) => {
  const [toggle, setToggle] = useState();
  const [payrollData, setPayrollData] = useState({ payrollFile: [] });
  const [payrollDataView, setPayrollDataView] = useState([]);

  useEffect(() => {
    getTempEmployeeDetailsforPayroll(data).then((response) => {
      var payrollFile = [];
      var obj = {};
      response.contributions.forEach((element) => {
        obj[element.sourceName] = element.contributionAmount;
      });
      payrollFile.push(obj);
      response["payrollFile"] = payrollFile;
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
      {hideField === false && !isEmpty(payrollData.payrollFile) ? (
        <>
          <div>
            <p className="ft-12 black-text mb-0 mt-20">
              {ssnMasking(payrollData.uniquePersonalIdentification) || ""}
            </p>
            <p className="ft-14 black-text font-weight-500">
              {`${payrollData.firstName || ""} ${payrollData.lastName || ""}`}
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <p className="grey-text ft-12">Plan name</p>
              <p className="black-text ft-14 font-weight-500">
                {payrollDataView.planName}
              </p>
            </div>
            <div>
              <p className="grey-text ft-12">Plan ID</p>
              <p className="black-text ft-14 font-weight-500">
                {payrollData.planId}
              </p>
            </div>
            <div>
              <p className="grey-text ft-12">Pay date</p>
              <p className="black-text ft-14 font-weight-500">
                {usDateFormat(payrollData.payDate)}
              </p>
            </div>
          </div>
          <div className="payroll-file-table-view">
            <div className="d-flex justify-content-between table-head">
              <div>Sources</div>
              <div>Amount</div>
            </div>
            <div className="table-body">
              {payrollData.payrollFile.map((payrollFileInfo, index) => (
                <>
                  {Object.keys(payrollFileInfo).map((id, index) => (
                    <div
                      className="d-flex justify-content-between"
                      key={`source${index}`}
                    >
                      <div>{id}</div>
                      <div>
                        ${" "}
                        {!payrollFileInfo[id] == null ? payrollFileInfo[id] : 0}
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </>
      ) : (
        hideField === true &&
        !isEmpty(payrollDataView) &&
        payrollDataView.map((data) => (
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
                  {usDateFormat(data.payrollTransactions[0].payDate)}
                </p>
              </div>
              <div>
                <p className="grey-text ft-12">Total Records</p>
                <p className="black-text ft-14 font-weight-500">{""}</p>
              </div>
            </div>
            <div className="payroll-file-table-view">
              <div className="d-flex justify-content-between table-head">
                <div>Sources</div>
                <div>Amount</div>
              </div>
              <div className="table-body">
                {data.payrollTransactions[0].transactionSourceDetails.map(
                  (item, index) => (
                    <div
                      className="d-flex justify-content-between"
                      key={`source${index}`}
                    >
                      <div>{item.sourceName}</div>
                      <div>$ {item.amount}</div>
                    </div>
                  )
                )}
                {data.payrollTransactions.map((item) => (
                  <>
                    <div className="line-separator" />
                    <div className="d-flex justify-content-between">
                      <div>Loan Repayments</div>
                      <div>$ {item.loanRepayments}</div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>Total</div>
                      <div>$ {item.total}</div>
                    </div>{" "}
                  </>
                ))}
              </div>
            </div>
          </>
        ))
      )}
    </>
  );
};
//       <div className="d-flex justify-content-between">
//         <div>
//           <p className="grey-text ft-12">Plan name</p>
//           <p className="black-text ft-14 font-weight-500">
//             {payrollDataView.planName}
//           </p>
//         </div>
//         {hideField === false ? (
//           <div>
//             <p className="grey-text ft-12">Plan ID</p>
//             <p className="black-text ft-14 font-weight-500">
//               {payrollData.planId}
//             </p>
//           </div>
//         ) : (
//           ""
//         )}
//         <div>
//           <p className="grey-text ft-12">Pay date</p>
//           <p className="black-text ft-14 font-weight-500">
//             {usDateFormat(payrollData.payDate)}
//           </p>
//         </div>
//       </div>
//       <div className="payroll-file-table-view">
//         <div className="d-flex justify-content-between table-head">
//           <div>Sources</div>
//           <div>Amount</div>
//         </div>
//         <div className="table-body">
//           {payrollData.payrollFile.map((payrollFileInfo, index) => (
//             <>
//               <div className="d-flex justify-content-between" key={index}>
//                <div>Pre Tax</div>
//                 <div>$ {payrollData.preTax}</div>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <div>After Tax</div>
//                 <div>$ {payrollData.afterTax}</div>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <div>Match</div>
//                 <div>$ {payrollData.match}</div>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <div>Safe harbor non elective</div>
//                 <div>$ {payrollData.safeHarborNonElective}</div>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <div>Roth</div>
//                 <div>$ {payrollData.roth}</div>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <div>Profit sharing</div>
//                 <div>$ {payrollData.profitSharing}</div>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <div>Safe harbor match</div>
//                 <div>$ {payrollData.safeHarborMatch}</div>
//               </div>
//               <div className="line-separator" />
//               <div className="d-flex justify-content-between">
//                 <div>Loan Repayments</div>
//                 <div>$ {payrollData.loanRepayment}</div>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <div>Total</div>
//                 <div>$ {payrollData.total}</div>
//               </div>
//               {Object.keys(payrollFileInfo).map((id, index) => (
//                 <div
//                   className="d-flex justify-content-between"
//                   key={`source${index}`}
//                 >
//                   <div>{id}</div>
//                   <div>
//                     $ {!payrollFileInfo[id] == null ? payrollFileInfo[id] : 0}
//                   </div>
//                 </div>
//               ))}
//             </>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

export default PayrollPendingSubmission;
