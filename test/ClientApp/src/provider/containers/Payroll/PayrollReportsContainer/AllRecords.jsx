import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Form, InputGroup, Image, Button } from "react-bootstrap";
import { get, toLower, isEmpty } from "lodash";
import {
  FormControlSearch,
  ExcelNameExport,
  SliderPanel,
} from "../../../components";
import { ssnMasking, usDateFormat } from "../../../utils";
import EditContribution from "./EditContribution";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { allRecordReport } from "./constant";
import {
  getDataChangeInformationById,
  getDownloadDataChangeReport,
  getEmployeePayDateLevelTransactionDetails,
  getAllEmployeeRecordsInformation,
  downloadAllFileEmployeeDetails,
} from "../../../services";
import { useRequest } from "../../../abstracts";
import ExcelImage from "../../../styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
import { Link } from "react-router-dom";

const AllRecords = ({ data, payrollId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  // const PayrollReport = get(data, "AllRecords", []);
  const [searchText, setSearchText] = useState(" ");
  const [searchValue, setSearchValue] = useState(" ");
  const [pageCount, setPageCount] = useState(1);
  const [name, setName] = useState();
  const [ssn, setSSN] = useState();
  const [selectedList, setSelectedList] = useState([]);
  const [element, setElement] = useState(null);
  const [start, setStart] = useState(1);
  const [isScroll, setIsScroll] = useState(true);
  const [count, setCount] = useState(0);

  const { response: PayrollReport, loading: isLoading } = useRequest({
    method: getAllEmployeeRecordsInformation,
    payload: { fileId: payrollId, searchString: " ", pageNumber: 1 },
    defaultResponse: [],
  });
  const [filteredValues, setFilteredValues] = useState([]);

  const handleSearchChange = (searchValue) => {
    setSearchText(searchValue);
    setStart(1);
    getAllEmployeeRecordsInformation({
      fileId: payrollId,
      searchString: !isEmpty(searchValue) ? searchValue : " ",
      pageNumber: 1,
    })
      .then((response) => {
        setCount(response.count);
        setFilteredValues(response.allEmployeeDetails);
      })
      .catch((error) => {
        //handle error
      });
  };

  const onViewButtonClick = (employeeId, paydate, planId, index) => {
    getEmployeePayDateLevelTransactionDetails({
      employeeId: employeeId,
      payDate: paydate,
      planId: planId,
      fileId: payrollId,
    }).then((response) => {
      setSelectedList(response);
    });
    setModalOpen(true);
    setName(filteredValues[index].name);
    setSSN(filteredValues[index].ssn);
  };
  useEffect(() => {
    if (PayrollReport && PayrollReport.isSuccessfull) {
      setCount(PayrollReport.count);
      setFilteredValues([
        ...filteredValues,
        ...PayrollReport.allEmployeeDetails,
      ]);
    }
  }, [PayrollReport]);

  useEffect(() => {
    if (start != 1) {
      getAllEmployeeRecordsInformation({
        fileId: payrollId,
        searchString: !isEmpty(searchText) ? searchText : " ",
        pageNumber: start,
      })
        .then((response) => {
          if (response.allEmployeeDetails === []) {
            setIsScroll(false);
          } else {
            setFilteredValues([
              ...filteredValues,
              ...response.allEmployeeDetails,
            ]);
          }
          setCount(response.count);
        })
        .catch((error) => {
          //handle error
        });
    }
  }, [start]);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting) {
          if (isScroll) {
            if (PayrollReport.allEmployeeDetails == []) {
              setIsScroll(false);
            } else {
              // var pageNo = start + 1;
              setStart((start) => start + 1);
              // setPageCount((pageCount) => pageCount + 1);
            }
          }
        }
      },
      { threshold: 0.9 }
    )
  );

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  const exportReportFile = (data) => {
    downloadAllFileEmployeeDetails({
      searchString: !isEmpty(searchText) ? searchText : null,
      fileId: payrollId,
    })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "Allrecords.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving Allrecords");
      });
  };

  return (
    <div>
      <div
        className="d-flex justify-content-between align-center"
        style={{ marginBottom: "20px" }}
      >
        <div style={{ paddingLeft: "30px" }}>
          <Form>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text className="plan-search-button">
                  <Image src="/assets/icons/svg/search.svg" width="14px" />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControlSearch
                size="sm"
                type="search"
                placeholder="Search SSN or employee"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </InputGroup>
          </Form>
        </div>
        <Button
          onClick={() => {
            handleSearchChange(searchValue);
          }}
        >
          Search
        </Button>
        <div>
          {count} Records Found
          {/* <ExcelNameExport
            headers={allRecordReport}
            data={downloadReport}
            fileName={"all_records.xls"}
            name="All Records"
          /> */}
          {/* <Link
            className="excel-text"
            onClick={() =>
              exportReportFile()
            }
          >
            All Records
            <Image src={ExcelImage} width="14px" />
          </Link> */}
        </div>
      </div>
      <Row className="all-records">
        <Col md="3">Social Security Number</Col>
        <Col md="3">Employee name</Col>
        <Col md="2">Plan ID</Col>
        <Col md="2">Pay date</Col>
        <Col md="2">Action</Col>
      </Row>
      <div className="payroll_scroll">
        {filteredValues.map((records, index) => (
          <div ref={setElement}>
            <Row className="all-records-inner" key={index}>
              <Col md="3">{ssnMasking(records.ssn)}</Col>
              <Col md="3">{records.name}</Col>
              <Col md="2">{records.planName}</Col>
              <Col md="2">{usDateFormat(records.payDate)}</Col>
              <Col
                md="2"
                className="link-text"
                onClick={() =>
                  onViewButtonClick(
                    records.id,
                    records.payDate,
                    records.planId,
                    index
                  )
                }
              >
                view
              </Col>
            </Row>
          </div>
        ))}
      </div>
      <SliderPanel
        isOpen={isModalOpen}
        size="35"
        showCancel={false}
        backdropClicked={() => setModalOpen(false)}
      >
        <div className="d-flex justify-content-between align-baseline">
          <div>
            <p>Payroll Contributions</p>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setModalOpen(false)}
              className="pointer"
            />
          </div>
        </div>
        <div className="bb-1" />
        <div className="scroll-body">
          <EditContribution
            PayrollReport={selectedList}
            name={name}
            ssn={ssn}
          />
        </div>
      </SliderPanel>
    </div>
  );
};

export default AllRecords;
