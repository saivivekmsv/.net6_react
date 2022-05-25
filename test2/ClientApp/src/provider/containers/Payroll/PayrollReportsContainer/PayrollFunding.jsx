import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ExcelNameExport } from "../../../components";
import { maskedBankAccountNumberNormalizer } from "../../../utils";
import { getDateTimeAMPM } from "../../../utils";
import { getDateWithSlash } from "../../../utils";
import { get } from "lodash";
import { useRequest } from "../../../abstracts";
import {
  getPayrollFundingInformationById,
  getDownloadFundingReport,
} from "../../../services";
import ExcelImage from "../../../styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
// import axios from "axios";
// import { apiDetails } from "../../../services/helpers";

const PayrollFunding = ({ data, payrollId }) => {
  const { response: fundingInfo, loading: isLoading } = useRequest({
    method: getPayrollFundingInformationById,
    payload: { fileId: payrollId, pageNumber: 1 },
    defaultResponse: [],
  });

  const exportReportFile = (data) => {
    getDownloadFundingReport(payrollId)
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "PayrollFunding.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving payroll funding");
      });
  };

  // function exportReportFile() {
  //   axios.get(apiDetails.baseUrl.trim() + '/api/v1/Report/DownloadPayrollFundingInformation/1', { responseType: 'arraybuffer' })
  //     .then((response) => {
  //       var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       fileSaver.saveAs(blob, 'PayrollFunding.xlsx');
  //     });
  // }

  const length =
    fundingInfo.payrollFileTransactionDetails?.length +
    fundingInfo.fundingDetails?.length;

  return (
    <div>
      <div className="d-flex justify-content-between align-center">
        <div className="ft-12 grey-text font-weight-500">
          Payroll Funding in {length} Records
        </div>
        {/* <div>
          <ExcelNameExport
            data={contributionDetails}
            fileName={"payroll_funding_contribution.xls"}
            name="Payroll Funding Report"
          />
        </div> */}
        <p className="excel-text" onClick={() => exportReportFile()}>
          Payroll Funding Report
          <Image src={ExcelImage} width="14px" />
        </p>
      </div>
      {/* {fundingInfo &&
        fundingInfo.map((item) => ( */}
      <div>
        <div className="filename">Contribution Details</div>
        {fundingInfo &&
          fundingInfo.payrollFileTransactionDetails?.map((data, index) => (
            <div className="contribution-detail" key={index}>
              <Row className="mb-20">
                <Col md="2">
                  <p className="ft-12 grey-text font-weight-500">Plan ID</p>
                  <p className="ft-12 black-text font-weight-500">
                    {data.planId}
                  </p>
                </Col>
                <Col md="2">
                  <p className="ft-12 grey-text font-weight-500">Pay date</p>
                  <p className="ft-12 black-text font-weight-500">
                    {/* {item.contributionDetails.payDate} */}
                    {getDateWithSlash(data.payDate)}
                  </p>
                </Col>
                <Col md="8" className="text-right">
                  <p className="ft-12 grey-text font-weight-500">
                    Total amount
                  </p>
                  <p className="ft-18 black-text font-weight-500">
                    $ {data.total}
                  </p>
                </Col>
              </Row>
              <div className="d-flex justify-content-between">
                {data.sourceTransactions.map((source, index) => (
                  <div key={index}>
                    <p className="ft-12 grey-text font-weight-500">
                      {source.name}
                    </p>
                    <p className="ft-12 black-text font-weight-500">
                      $ {source.amount}
                    </p>
                  </div>
                ))}
                <div>
                  <p className="ft-12 grey-text font-weight-500">
                    Loan repayment
                  </p>
                  <p className="ft-12 black-text font-weight-500">
                    ${" "}
                    {data.loanTransactions.reduce(
                      (a, v) => (a = a + v.amount),
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}

        <div className="filename">Funding Details</div>
        {fundingInfo.fundingDetails?.map((data, index) => (
          <div className="funding-detail" key={index}>
            <Row className="mb-40">
              <Col md="3">
                <p className="ft-12 grey-text font-weight-500">
                  File load rate
                </p>
                <p className="ft-12 black-text font-weight-500">
                  {getDateTimeAMPM(data.fileLoadDate)}
                </p>
              </Col>
              <Col md="3">
                <p className="ft-12 grey-text font-weight-500">Funding date</p>
                <p className="ft-12 black-text font-weight-500">
                  {getDateTimeAMPM(data.fundingDate)}
                </p>
              </Col>
              <Col md="3">
                <p className="ft-12 grey-text font-weight-500">Plan ID</p>
                <p className="ft-12 black-text font-weight-500">
                  {data.planId}
                </p>
              </Col>
              <Col md="3">
                <p className="ft-12 grey-text font-weight-500">Pay date</p>
                <p className="ft-12 black-text font-weight-500">
                  {getDateWithSlash(data.payDate)}
                </p>
              </Col>
            </Row>
            <Row className="mb-20">
              <Col md="3">
                <p className="ft-12 grey-text font-weight-500">Bank details</p>
                <p className="ft-12 black-text font-weight-500">
                  {data.bankName}
                </p>
              </Col>
              <Col md="3">
                <p className="ft-12 grey-text font-weight-500">
                  Bank account number
                </p>
                <p className="ft-12 black-text font-weight-500">
                  {maskedBankAccountNumberNormalizer(data.bankAccountNumber)}
                </p>
              </Col>
              <Col md="2">
                <p className="ft-12 grey-text font-weight-500">
                  Forfeiture Type
                </p>
                {data.forfeitureDetails.map((item, index) => (
                  <div key={index}>
                    <p className="ft-12 black-text font-weight-500">
                      <div> {item.forfeitureType}</div>
                    </p>
                  </div>
                ))}
              </Col>
              <Col md="2">
                <p className="ft-12 grey-text font-weight-500">
                  Forfeiture Amount
                </p>
                {data.forfeitureDetails.map((item, index) => (
                  <div key={index}>
                    <p className="ft-12 black-text font-weight-500">
                      <div> ${item.forfeitureAmount}</div>
                    </p>
                  </div>
                ))}
              </Col>
              <Col md="2">
                <p className="ft-12 grey-text font-weight-500">
                  Funding amount
                </p>
                <p className="ft-12 black-text font-weight-500">
                  $ {data.fundingAmount}
                </p>
              </Col>
            </Row>
          </div>
        ))}
      </div>
      {/* ))} */}
    </div>
  );
};

export default PayrollFunding;
