import React from "react";
import SidebarApp from "../../components/Sidebar/Sidebar";
import { FormControlSearch, SidebarForSponsor } from "../../components";
import SponsorCard from "../../components/SponsorCards/SponsorCard";
import SponsorLoanInformationCard from "../../components/SponsorCards/SponsorLoanInformationCard";
import logo from "../../assets/netflix-logo-0.png";
import {
  Button,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import SponsorClassificationContainer from "../../containers/SponsorClassificationContainer/SponsorClassificationContainer";
import SponsorEmployeeContainer from "../../containers/SponsorEmployeeContainer/SponsorEmployeeContainer";
import SponsorCompanyCard from "../../components/SponsorCompanyCard/SponsorCompanyCard";
import { Bar } from "recharts";
import DoughnutChart from "../../mocks/doughnutChart";
import SponsorPayrollListingContainer from "../../containers/SponsorPayrollListingContainer/SponsorPayrollListingContainer";
//import SponsorEmployeeSummaryContainer from "../../containers/SponsorEmployeeSummaryContainer/SponsorEmployeeSummaryContainer";
//import SponsorEmployeeRetirementReadinessCard from "../../components/SponsorEmployeeRetirementReadinessCard/SponsorEmployeeRetirementReadinessCard";
//import SponsorPerformanceIndicesCard from "../../components/SponsorPerformaceIndicesCard/SponsorPerformanceIndicesCard";
//import SponsorTaskManagementCard from "../../components/SponsorCards/SponsorTaskManagementCard";
//import SponsorDashboardContainer from "../../containers/SponsorDashboardContainer/SponsorDashboardContainer";
//import SponsorCarouselCard from "../../components/SponsorCards/SponsorCarouselCard";
import SponsorEmployeeHistoryContainer from "../../containers/SponsorEmployeeHistoryContainer/SponsorEmployeeHistoryContainer";
import SponsorEmployeeStatusContainer from "../../containers/SponsorEmployeeStatusContainer/SponsorEmployeeStatusContainer";
import SponsorSettingsContainer from "../../containers/SponsorSettingsContainer/SponsorSettingsContainer";

const SponsorLayout = () => {
  return (
    <>
      <SidebarForSponsor />

      <div className="Card-container">
        <div className="sponsor-card-container">
          <SponsorCard type="img" image={logo} />
          <SponsorCard
            value="Netflix International Inc"
            title="Company name"
            type="text"
          />
          <SponsorCard value="2345" title="No. of employee" type="text" />
          <SponsorCard value="60%" title="Participated" type="text" />
        </div>
      </div>
      <div className="Card-container">
        <div>
          <p className="sponsor-container-title">Contact Details</p>
        </div>
        <div className="sponsor-card-container">
          <SponsorCard value="434-434-3456" title="Phone Number" type="text" />
          <SponsorCard
            value="netflixcorp@netflix.com"
            title="Email"
            type="text"
          />
          <SponsorCard
            value="Netflix.com"
            title="Company Website"
            type="link"
          />
        </div>
      </div>

      <div className="Card-container">
        <div>
          <p className="sponsor-container-title">Address Details</p>
        </div>
        <div className="sponsor-card-container">
          <SponsorCard
            value="155, New york street"
            title="Address 1"
            type="text"
          />
          <SponsorCard value="Washington LLC" title="Address 2" type="text" />
          <SponsorCard value="USA" title="Country" type="text" />
          <SponsorCard value="New York" title="State" type="text" />
          <SponsorCard value="424 324" title="Zip Code" type="text" />
        </div>
      </div>

      <div className="Card-container">
        <div>
          <p className="sponsor-container-title">Business Details</p>
        </div>
        <div className="sponsor-card-container">
          <SponsorCard value="LLC" title="Bussiness type" type="text" />
          <SponsorCard value="Corp" title="Taxed as" type="text" />
          <SponsorCard value="Jan,31" title="Fiscal year end" type="text" />
          <SponsorCard
            value="Alabama"
            title="State of incorporation"
            type="text"
          />
          <SponsorCard
            value="03/04/2001"
            title="Company start date"
            type="text"
          />
          <SponsorCard value="-" title="Tax EIN" type="text" />
        </div>
      </div>

      <div className="emp-classification">
        <div className="flex-row space-between border-bot">
          <div className="ft-20 fw-500">Employee Classification</div>
          <Button className="create-button">Create</Button>
        </div>
        <div className="marg-top-30">
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
              <Col>
                <div className="classification-container-heading">
                  <div className="ft-16 fw-500 marg-bottom-6">
                    Classification Type
                  </div>
                  <div className="title">03 Records </div>
                </div>
                <ListGroup className="list-group">
                  <ListGroup.Item
                    action
                    href="#link1"
                    className="list-group-item"
                  >
                    Location
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    href="#link2"
                    className="list-group-item"
                  >
                    Division
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    href="#link3"
                    className="list-group-item"
                  >
                    Department
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col>
                <Tab.Content>
                  <Tab.Pane eventKey="#link1">
                    <SponsorClassificationContainer />
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link2">
                    <SponsorClassificationContainer />
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link3">
                    <SponsorClassificationContainer />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>

      <div>
        <SponsorSettingsContainer />
      </div>
      <div>
        <SponsorEmployeeStatusContainer />
      </div>

      <div>
        <SponsorEmployeeContainer />
      </div>
      <div>
        <SponsorPayrollListingContainer />
      </div>

      <div>
        <SponsorEmployeeHistoryContainer />
      </div>

      {/* <div className='w-100'>
        <SponsorDashboardContainer/>
        
      </div> */}
    </>
  );
};

export default SponsorLayout;
