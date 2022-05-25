import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

import { CsplTable as Table, Link } from "../../components";
import { MANAGE_COMPANY_ROUTES } from "../../utils";
import {
  useRequest,
  useLazyLoadForTable,
  useDeepEffect,
} from "../../abstracts";
import { postCompanyGridView } from "../../services";
import CompanyCard from "./CompanyCard";
import { isEmpty } from "lodash";
const GenericTable = ({ searchText, companyType, isLoading, totalRecords }) => {
  const defaultPageNumbers = {
    from: 1,
    to: 20,
  };

  const [showAllRecords, setShowAllRecords] = useState(false);
  const [companyGridpayload, setCompanyGridPayload] = useState({
    ...defaultPageNumbers,
    searchString: "",
    companyType: null,
  });

  const { response: companiesResponse, loading } = useRequest({
    method: postCompanyGridView,
    payload: companyGridpayload,
    defaultResponse: [],
  });

  const { tableData } = useLazyLoadForTable(companiesResponse, {
    searchString: companyGridpayload.searchString,
    companyType: companyGridpayload.companyType,
    orderDescending: companyGridpayload.orderDescending,
  });

  useDeepEffect(
    () => {
      setCompanyGridPayload({
        ...companyGridpayload,
        ...defaultPageNumbers,
        searchString: searchText,
        companyType,
      });
      if (searchText) {
        setShowAllRecords(true);
      } else {
        setShowAllRecords(false);
      }
    },
    [searchText, companyType],
    true
  );

  const scrollEndCallBack = (details) => {
    setCompanyGridPayload({
      ...companyGridpayload,
      from: details.from,
      to: details.to,
    });
  };

  const recordsToDisplay = showAllRecords ? tableData : tableData.slice(0, 8);
  return (
    <Table isLoading={isLoading || loading}>
      <Table.Tbody
        scrollEndCallBack={scrollEndCallBack}
        totalRecords={totalRecords}
        interVal={20}
        isLoading={isLoading || loading}
        className="company-card-list-wrapper"
      >
        <Row>
          {!isEmpty(recordsToDisplay) ? (
            recordsToDisplay.map((company, index) => {
              return (
                <Col md="3" key={index}>
                  <Link
                    to={`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/edit/${company.id}`}
                    className="company-card-item"
                  >
                    <CompanyCard
                      {...company}
                      editLink={`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/save/${company.id}`}
                    />
                  </Link>
                </Col>
              );
            })
          ) : (
            <span style={{ margin: "auto", fontSize: "18px" }}>
              No Records Found
            </span>
          )}
        </Row>
      </Table.Tbody>
    </Table>
  );
};

export default GenericTable;
