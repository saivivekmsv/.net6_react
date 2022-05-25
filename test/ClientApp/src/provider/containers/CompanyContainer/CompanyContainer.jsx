import React, { useState } from "react";
import { get, isEmpty } from "lodash";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link, SearchDropdownWithAPI } from "../../components";
import { ROUTES } from "../../utils";
import GenericTable from "./GenericTable";
import SponsorOrgTable from "./SponsorOrgTable";
import { useRequest } from "../../abstracts";
import { getCompanyCount, postCompanyGridView } from "../../services";

// import chipbuttons from "../../mocks/chipbuttons.json";
// import companies from "../../mocks/companies.json";
// import sponsoringOrganisation from "../../mocks/sponsoringOrganisation.json";

const CompanyContainer = () => {
  const [companyType] = useState({ value: null });
  const [recordsCount, setRecordsCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const isSponsoringOrg = get(companyType, "value") === 3;

  const { response: companyCount, loading: isLoadingCompanyCount } = useRequest(
    {
      method: getCompanyCount,
      defaultResponse: 0,
    }
  );

  // const onChipButtonSelect = (item) => {
  //   setCompanyType(item);
  // };

  const handleSearchChange = (val) => {
    setSearchText(val);
  };

  const totalCompanies = companyCount || 0;
  const totalSponsoringOrg = recordsCount;
  const countDetails = isSponsoringOrg
    ? `${totalSponsoringOrg} Sponsoring Org.`
    : `Total ${totalCompanies} Companies`;

  return (
    <div className="company-container d-flex flex-column">
      <div className="layout-head d-flex justify-content-between">
        <div className="plan-heading-plan">
          Manage Company <br />{" "}
          <span className="count-details">{countDetails}</span>
        </div>
        <div>
          <Link to={ROUTES.MANAGE_COMPANY}>
            <Button variant="primary" className="mr-8">
              New company
            </Button>
          </Link>
        </div>
      </div>
      <Row>
        <Col>
          <Form>
            <SearchDropdownWithAPI
              searchPayloadKey="searchString"
              labelKey="name"
              handleSelect={handleSearchChange}
              method={postCompanyGridView}
              placeholder="Search by Company Name"
            />
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <br />
          <div className="font-weight-500">
            {(isEmpty(searchText) || searchText == "") &&
              "Recently Added/Modified"}
          </div>
          <br />
        </Col>
      </Row>
      {!isSponsoringOrg && (
        <GenericTable
          isLoading={isLoadingCompanyCount}
          totalRecords={totalCompanies}
          searchText={searchText}
          companyType={get(companyType, "value", "")}
        />
      )}
      {isSponsoringOrg && (
        <SponsorOrgTable
          searchText={searchText}
          setRecordsCount={setRecordsCount}
        />
      )}
    </div>
  );
};

export default CompanyContainer;
