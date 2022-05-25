import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import { CsplTable as Table, LoaderWrapper } from "../../components";
import {
  MANAGE_COMPANY_ROUTES,
  getCommaSeparatedValuesFromArr,
  getNullTableItem,
  OPTIONS_DATA_MAPPER,
} from "../../utils";
import {
  useRequest,
  useLazyLoadForTable,
  useDeepEffect,
} from "../../abstracts";
import {
  postSponsoringOrganisations,
  postCompaniesGridViewBySponsoringOrganisation,
} from "../../services";

const columns = [
  {
    label: "Company Name",
    className: "column-company-name",
    columnName: "name",
    isSortable: true,
    orderBy: "",
    link: MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS,
  },
  {
    label: "Type",
    className: "column-company-type",
    columnName: "employerType",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "Plan IDs",
    className: "column-company-plan",
    columnName: "planIds",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "Employees",
    className: "column-company-employees",
    columnName: "totalEmployees",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "Participation %",
    className: "column-company-participation",
    columnName: "participaton",
    isSortable: true,
    orderBy: "",
  },
];

const SponsorOrgTable = ({ searchText, setRecordsCount }) => {
  const defaultPageNumbers = {
    from: 1,
    to: 20,
  };
  const [sortingData, setSortingData] = useState({});
  const [
    companyGridSponsoringOrgpayload,
    setCompanyGridSponsoringOrgPayload,
  ] = useState({
    ...defaultPageNumbers,
    searchString: "",
    companyType: 3,
  });
  const [selectedSponsoringOrg, setSelectedSponsoringOrg] = useState({
    sponsoringOrganisationName: "",
    selectedSponsoredOrgCount: "",
  });
  const {
    sponsoringOrganisationName,
    selectedSponsoredOrgCount,
  } = selectedSponsoringOrg;

  const [sponsoringOrgPayload, setSponsoringOrgPayload] = useState({
    ...defaultPageNumbers,
    searchString: "",
  });

  const { response: sponsoringOrgGridResponse, loading } = useRequest({
    method: postCompaniesGridViewBySponsoringOrganisation,
    payload: companyGridSponsoringOrgpayload,
    defaultResponse: [],
  });

  const { tableData } = useLazyLoadForTable(sponsoringOrgGridResponse, {
    searchString: companyGridSponsoringOrgpayload.searchString,
    companyType: companyGridSponsoringOrgpayload.companyType,
    orderDescending: companyGridSponsoringOrgpayload.orderDescending,
    id: companyGridSponsoringOrgpayload.id,
  });

  const {
    response: sponsoringOrganisationsResponse,
    loading: sponsoringOrganisationsLoading,
  } = useRequest({
    method: postSponsoringOrganisations,
    payload: sponsoringOrgPayload,
    defaultResponse: [],
  });
  const totalSponsoringOrg = (sponsoringOrganisationsResponse || []).length;

  useDeepEffect(() => {
    setRecordsCount(totalSponsoringOrg);
    if (!isEmpty(sponsoringOrganisationsResponse)) {
      const firstRecord = get(sponsoringOrganisationsResponse, 0, {});
      onOrgSelect(firstRecord);
    }
  }, [totalSponsoringOrg]);

  useDeepEffect(
    () => {
      setSponsoringOrgPayload({
        ...defaultPageNumbers,
        searchString: searchText,
      });
    },
    [searchText],
    true
  );

  const onSortClick = (item, index, orderBy) => {
    const details = {
      column: item.columnName,
      columnIndex: index,
      orderBy,
    };
    setSortingData(details);
    handleSortForSponsorOrgTable(details);
  };

  const onOrgSelect = (item) => {
    setSelectedSponsoringOrg({
      ...item,
      selectedSponsoredOrgCount: item.count,
    });
    handleSponsorOrgChange({
      sponsoringOrganisationName: item.sponsoringOrganisationName,
      count: item.count,
      id: item.id,
    });
  };

  const handleSortForSponsorOrgTable = (detail) => {
    setCompanyGridSponsoringOrgPayload({
      ...companyGridSponsoringOrgpayload,
      ...defaultPageNumbers,
      sortOn: detail.column,
      orderDescending: detail.orderBy === "desc",
    });
  };

  const handleSponsorOrgChange = (detail) => {
    setCompanyGridSponsoringOrgPayload({
      ...companyGridSponsoringOrgpayload,
      ...defaultPageNumbers,
      id: detail.id,
    });
  };

  const scrollEndCallBack = (details) => {
    setCompanyGridSponsoringOrgPayload({
      ...companyGridSponsoringOrgpayload,
      from: details.from,
      to: details.to,
    });
  };
  return (
    <Row className="sponsor-org-table">
      <Col xs={2} className="sponsored-org-list">
        <LoaderWrapper isLoading={sponsoringOrganisationsLoading}>
          <div className="d-flex flex-column sponsored-org">
            {sponsoringOrganisationsResponse.map((item) => {
              const className =
                item.id === selectedSponsoringOrg.id ? "selected" : "";
              return (
                <button
                  className={`d-flex justify-content-between sponsored-org-item ${className}`}
                  variant="link"
                  onClick={() => onOrgSelect(item)}
                >
                  <div className="sponsored-org-name">
                    {item.sponsoringOrganisationName}
                  </div>
                  <div>
                    <span className="sponsored-org-count">{item.count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </LoaderWrapper>
      </Col>
      <Col xs={10} className="sponsored-org-list-table d-flex flex-column">
        <div className="selected-sponsor-org-title">
          {sponsoringOrganisationName}{" "}
          {selectedSponsoredOrgCount && `(${selectedSponsoredOrgCount})`}
        </div>
        <Table isLoading={sponsoringOrganisationsLoading || loading}>
          <Table.Thead>
            <Table.Tr>
              {columns.map((item, index) => {
                const orderBy =
                  sortingData.columnIndex === index ? sortingData.orderBy : "";
                return (
                  <Table.Th
                    key={index}
                    className={item.className}
                    isSortable={item.isSortable}
                    orderBy={orderBy}
                    onClick={(sortOrder) => onSortClick(item, index, sortOrder)}
                  >
                    {item.label}
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody
            scrollEndCallBack={scrollEndCallBack}
            interVal={20}
            totalRecords={selectedSponsoringOrg.selectedSponsoredOrgCount}
          >
            {tableData.map((company, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    const getContent = () => {
                      if (item.columnName === "planIds") {
                        return getCommaSeparatedValuesFromArr(
                          company[item.columnName]
                        );
                      }

                      if (item.columnName === "companyType") {
                        return OPTIONS_DATA_MAPPER.COMPANY_TYPE[
                          company[item.columnName]
                        ];
                      }

                      if (item.link) {
                        return (
                          <Link to={`${item.link}/edit/${company.id}`}>
                            {company[item.columnName]}
                          </Link>
                        );
                      }
                      return company[item.columnName];
                    };
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {getNullTableItem(getContent())}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default SponsorOrgTable;
