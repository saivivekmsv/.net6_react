import React, { useState } from "react";
import { Button, Col, ListGroup, Row, Tab } from "react-bootstrap";
import { FormControlSearch, SliderPanel } from "../../components";
import SponsorCard from "../../components/SponsorCards/SponsorCard";
import SponsorFieldview from "../../components/SponsorClassificationCard/SponsorFieldview";
import SponsorClassificationCard from "../../components/SponsorClassificationCard/SponsorClassificationCard";
import SponsorListingSearch from "../../components/SponsorListingSearch/SponsorListingSearch";

const SponsorEmployeeStatusContainer = (data) => {
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [classificationCodes, setClassificationCodes] = useState();
  const onCardClick = () => {
    setSliderOpen(true);
  };
  return (
    <>
      <div className="emp-classification">
        <div className="flex-row space-between border-bot">
          <div className="ft-20 fw-500">Employee Status</div>
          <Button className="create-button">Create</Button>
        </div>
        <div className="marg-top-30">
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
              <Col>
                <div className="classification-container-heading">
                  <div className="ft-16 fw-500 marg-bottom-6">
                    Employment Status
                  </div>
                  <div className="title">07 Records </div>
                </div>
                <ListGroup className="list-group">
                  <ListGroup.Item
                    action
                    href="#link1"
                    className="list-group-item"
                  >
                    Active
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    href="#link2"
                    className="list-group-item"
                  >
                    InActive
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    href="#link3"
                    className="list-group-item"
                  >
                    On leave
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    href="#link4"
                    className="list-group-item"
                  >
                    Rehired
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    href="#link5"
                    className="list-group-item"
                  >
                    Suspended
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    href="#link6"
                    className="list-group-item"
                  >
                    Deceased
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    href="#link7"
                    className="list-group-item"
                  >
                    Terminated
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col>
                <Tab.Content>
                  <Tab.Pane eventKey="#link1">
                    <div className="classification-container">
                      <div className="flex-row space-between border-bottom marg-bottom-10">
                        <div className="ft-18 fw-500">
                          Employment Status Information
                        </div>
                        <div>
                          <Button className="delete-button">Delete</Button>
                          <Button className="edit-button">Edit</Button>
                        </div>
                      </div>
                      <div className="classification-inner-box">
                        <div className="disp-flex-col">
                          <SponsorFieldview title1="Status" value1=" Active" />
                          <SponsorFieldview title1="Status code" value1="A" />
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link2">
                    <div className="classification-container">
                      <div className="flex-row space-between border-bottom marg-bottom-10">
                        <div className="ft-18 fw-500">
                          Employment Status Information
                        </div>
                        <div>
                          <Button className="delete-button">Delete</Button>
                          <Button className="edit-button">Edit</Button>
                        </div>
                      </div>
                      <div className="classification-inner-box">
                        <div className="disp-flex-col">
                          <SponsorFieldview title1="Status" value1="InActive" />
                          <SponsorFieldview title1="Status code" value1="A" />
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link3">
                    <div className="classification-container">
                      <div className="flex-row space-between border-bottom marg-bottom-10">
                        <div className="ft-18 fw-500">
                          Employment Status Information
                        </div>
                        <div>
                          <Button className="delete-button">Delete</Button>
                          <Button className="edit-button">Edit</Button>
                        </div>
                      </div>
                      <div className="classification-inner-box">
                        <div className="disp-flex-col">
                          <SponsorFieldview title1="Status" value1="On leave" />
                          <SponsorFieldview title1="Status code" value1="A" />
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link4">
                    <div className="classification-container">
                      <div className="flex-row space-between border-bottom marg-bottom-10">
                        <div className="ft-18 fw-500">
                          Employment Status Information
                        </div>
                        <div>
                          <Button className="delete-button">Delete</Button>
                          <Button className="edit-button">Edit</Button>
                        </div>
                      </div>
                      <div className="classification-inner-box">
                        <div className="disp-flex-col">
                          <SponsorFieldview title1="Status" value1="Rehired" />
                          <SponsorFieldview title1="Status code" value1="A" />
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link5">
                    <div className="classification-container">
                      <div className="flex-row space-between border-bottom marg-bottom-10">
                        <div className="ft-18 fw-500">
                          Employment Status Information
                        </div>
                        <div>
                          <Button className="delete-button">Delete</Button>
                          <Button className="edit-button">Edit</Button>
                        </div>
                      </div>
                      <div className="classification-inner-box">
                        <div className="disp-flex-col">
                          <SponsorFieldview
                            title1="Status"
                            value1="Suspended"
                          />
                          <SponsorFieldview title1="Status code" value1="A" />
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link6">
                    <div className="classification-container">
                      <div className="flex-row space-between border-bottom marg-bottom-10">
                        <div className="ft-18 fw-500">
                          Employment Status Information
                        </div>
                        <div>
                          <Button className="delete-button">Delete</Button>
                          <Button className="edit-button">Edit</Button>
                        </div>
                      </div>
                      <div className="classification-inner-box">
                        <div className="disp-flex-col">
                          <SponsorFieldview title1="Status" value1="Deceased" />
                          <SponsorFieldview title1="Status code" value1="A" />
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link7">
                    <div className="classification-container">
                      <div className="flex-row space-between border-bottom marg-bottom-10">
                        <div className="ft-18 fw-500">
                          Employment Status Information
                        </div>
                        <div>
                          <Button className="delete-button">Delete</Button>
                          <Button className="edit-button">Edit</Button>
                        </div>
                      </div>
                      <div className="classification-inner-box">
                        <div className="disp-flex-col">
                          <SponsorFieldview
                            title1="Status"
                            value1="Terminated"
                          />
                          <SponsorFieldview title1="Status code" value1="A" />
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </>
  );
};

export default SponsorEmployeeStatusContainer;
