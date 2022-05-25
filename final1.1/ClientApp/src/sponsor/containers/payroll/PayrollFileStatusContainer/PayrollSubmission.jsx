import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Image,
  Button,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  SliderPanel,
  CsplTable as Table,
  PayrollPendingSubmission,
  FormControlSearch,
} from "../../../../shared/components";
import { MANAGE_PAYROLL_ROUTES } from "../../../../shared/utils/constants/payroll";
import pendingSubmissionMaster from "../../../../shared/mocks/pendingSubmissionMaster.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { get, toLower } from "lodash";
import { deleteTempEmployeeById, getAllRecords } from "../../../services";
import { ssnMasking, usDateFormat } from "../../../../shared/utils";
import upload from "../../../../shared/styles/upload.png";
import AddToolTip from "../../../../shared/components/AddToolTip";
import {
  getTempEmployeeDetailsforPayroll,
  finalSubmit,
} from "../../../services";
import { useHistory } from "react-router-dom";
const columns = [
  {
    label: "Social Security Number",
    className: "column-snn col-md-3",
    columnName: "ssn",
  },
  {
    label: "Employee name",
    className: "column-employeeName col-md-3",
    columnName: "employeeName",
  },
  {
    label: "Plan ID",
    className: "column-planId col-md-2",
    columnName: "planId",
  },
  {
    label: "Pay date",
    className: "column-payDate col-md-2",
    columnName: "payDate",
  },
  {
    label: "Action",
    className: "column-action col-md-2",
    columnName: "",
  },
];

const PayrollSubmission = (props) => {
  const { fileId, data, totalFunding, tabChange } = props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenAll, setModalOpenAll] = useState(false);
  const [submissionReport, setSubmissionReport] = useState(
    pendingSubmissionMaster
  );
  const history = useHistory();
  const [selectedList, setSelectedList] = useState({
    payrollFile: [],
  });
  const [filteredValues, setFilteredValues] = useState([]);

  useEffect(() => {
    getAllRecords(fileId).then((response) => {
      setSubmissionReport(response);
      setFilteredValues(response);
      console.log(response, "ALL RECORDS", fileId);
    });
  }, [fileId]);
  const finalSubmitClick = () => {
    finalSubmit(fileId, 3)
      .then((response) => {
        //history.push(`${MANAGE_PAYROLL_ROUTES.UPLOADED_FILES_LISTING}`);
        tabChange(4);
        console.log(response);
      })
      .catch((error) => {
        console.log("final submit failed", error);
      });
  };
  const showPopup = (id) => {
    console.log(id, "gfhfhfff");

    setSelectedList(id);
    setModalOpen(true);
  };
  const showPopupAll = () => {
    setModalOpenAll(true);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilteredValues(
      submissionReport.filter((item) => {
        return (
          toLower(item.ssn).replace(/-/g, "").indexOf(toLower(val)) !== -1 ||
          toLower(item.employeeName).indexOf(toLower(val)) !== -1
        );
      })
    );
  };

  return (
    <div className="pending-submission" id={fileId}>
     
      <Row>
        <Col md="8">
          {get(data, "fileName") && get(data, "fileName").length >= 30 ? (
            <div>
              <p className="mt-20 text-black ft-14 font-weight-500">
                <Image src={upload} className="mr-3" />
                <OverlayTrigger
                  overlay={<Tooltip>{get(data, "fileName")}</Tooltip>}
                >
                  <span>
                    {(get(data, "fileName") || "").slice(0, 30)}... .xlsx
                  </span>
                </OverlayTrigger>
              </p>
            </div>
          ) : (
            <div>
              <p className="mt-20 text-black ft-14 font-weight-500">
                <Image src={upload} className="mr-3" />
                <span>{get(data, "fileName")}</span>
              </p>
            </div>
          )}

          <div className="d-flex justify-content-between pending-payroll-wrapper mt-4 mb-4">
            <div>
              <p className="grey-text ft-12 wd-120">Employees in the file</p>
              <p className="black-text ft-18 mt-10">
                {submissionReport.length}
              </p>
            </div>
            <div>
              <p className="grey-text ft-12 wd-120">
                Employees accessible to you
              </p>
              <p className="black-text ft-18 mt-10">
                {submissionReport.length}
              </p>
            </div>
            <div>
              <p className="grey-text ft-12 wd-120">
                Errors detected and resolved
              </p>
              <p className="black-text ft-18 mt-10">0</p>
            </div>
            <div>
              <p className="grey-text ft-12 wd-120">
                Employees
                <br /> deleted
              </p>
              <p className="black-text ft-18 mt-10">0</p>
            </div>
            <div>
              <p className="grey-text ft-12 wd-120">
                Forfeiture monies to offset funding
              </p>
              <p className="black-text ft-18 mt-10">Y</p>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <div className="search-bar">
              <Form>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text className="plan-search-button">
                      <Image src="/assets/icons/svg/search.svg" width="14px" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControlSearch
                    type="search"
                    placeholder="Search SSN or employee name, Plan ID"
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Form>
            </div>
            <div>
              <p className="ft-14 font-weight-500 black-text mt-20">
                Total Records {filteredValues.length}
              </p>
            </div>
          </div>
          <div className="border-top mb-10" />
          <Table className="pending-submission-table">
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
              {filteredValues.map((pending, index) => {
                return (
                  <Table.Tr key={index}>
                    <Table.Td className="column-ssn col-md-3">
                      {ssnMasking(pending.ssn)}
                    </Table.Td>
                    {pending.employeeName.length >= 30 ? (
                      <AddToolTip
                        name={pending.employeeName}
                        placement="bottom"
                      >
                        <Table.Td className="column-employeeName col-md-3">
                          {(pending.employeeName || "").slice(0, 30)}...
                        </Table.Td>
                      </AddToolTip>
                    ) : (
                      <Table.Td className="column-employeeName col-md-3">
                        {pending.employeeName}
                      </Table.Td>
                    )}
                    <Table.Td className="column-planId col-md-2">
                      {pending.planId}
                    </Table.Td>
                    <Table.Td className="column-payDate col-md-2">
                      {usDateFormat(pending.payDate.split("T")[0])}
                    </Table.Td>
                    <Table.Td className="column-action col-md-2">
                      <span
                        className="link-text"
                        onClick={() => showPopup(pending.id)} //pending.id
                      >
                        view
                      </span>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Col>
        <Col md="3">
          <div className="pl-4">
            <h4 className="total-text">Total Funding</h4>
            <h1 className="total-amount">${totalFunding}</h1>
            <p className="link-text" onClick={showPopupAll}>
              View payroll details
            </p>
            <p className="grey-text ft-12 mt-20 mb-2">
              All records have been corrected. Click on submit to confirm.
            </p>
            <Button variant="primary" onClick={finalSubmitClick}>
              Submit Payroll
            </Button>
          </div>
        </Col>
      </Row>
      <SliderPanel
        isOpen={isModalOpen}
        size="30"
        showCancel={false}
        backdropClicked={() => setModalOpen(false)}
      >
        <div className="d-flex justify-content-between">
          <div className="ft-14 font-weight-500">Payroll details</div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              size="md"
              color="#828282"
              onClick={() => setModalOpen(false)}
              className="pointer"
            />
          </div>
        </div>
        <div className="border-top" />
        <PayrollPendingSubmission
          data={selectedList}
          fileId={fileId}
          hideField={false}
        />
      </SliderPanel>
      <SliderPanel
        isOpen={isModalOpenAll}
        size="30"
        showCancel={false}
        backdropClicked={() => setModalOpenAll(false)}
      >
        <div className="d-flex justify-content-between">
          <div className="ft-14 font-weight-500">Payroll details</div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              size="md"
              color="#828282"
              onClick={() => setModalOpenAll(false)}
              className="pointer"
            />
          </div>
        </div>
        <div className="line-separator" />
        <PayrollPendingSubmission fileId={fileId} hideField={true} />
      </SliderPanel>
    </div>
  );
};

export default PayrollSubmission;
