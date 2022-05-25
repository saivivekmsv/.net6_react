import React from "react";
import { ListGroup, Tab } from "react-bootstrap";
import logo from "../../assets/netflix-logo-0.png";
import "../../styles/containers/SponsorPayrollLeftPanel.scss";
import { usDateFormat } from "../../utils";

const SponsorPayrollLeftbar = (props) => {
  return (
    <>
      <div className="left-panel-outline">
        <div className="left-panel">
          <img className="img" src={logo} />
          <div className="flex-row justify-content-between box1">
            <div className="ft-16">Active Files</div>
            <div className="ft-21 dark-text">{props.filecount}</div>
          </div>
          <div className="flex-col box2">
            <div className="ft-16">Upcoming Payroll</div>
            <div className="ft-14 gray-text marg-top-10">
              {usDateFormat(props.payrolldate).replaceAll("-", "/")}
            </div>
          </div>
          <div className="tab-container">
            <Tab.Container
              id="list-group-tabs-example"
              defaultActiveKey="#link1"
            >
              <div className="ft-16 fw-500 border-bottom">
                Frequently Occuring
              </div>
              <ListGroup horizontal className="tabs">
                <ListGroup.Item
                  action
                  href="#link1"
                  className="tabs-item1 ft-14"
                >
                  Errors
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  href="#link2"
                  className="tabs-item2 ft-14"
                >
                  Warnings
                </ListGroup.Item>
              </ListGroup>
              <div>
                <Tab.Content>
                  <Tab.Pane eventKey="#link1">
                    <div className="errors-box">
                      <div className="ft-12 dark-text">{props.EC001}</div>
                    </div>
                    <div className="errors-box marg-top-15">
                      <div className="ft-12 dark-text">
                        {props.EC002}
                        Date
                      </div>
                    </div>
                    <div className="errors-box marg-top-15">
                      <div className="ft-12 dark-text">{props.EC003}</div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="#link2">
                    <div className="warn-box">
                      <div className="ft-12 dark-text">{props.WC001}</div>
                    </div>
                    <div className="warn-box marg-top-15">
                      <div className="ft-12 dark-text">{props.WC002}</div>
                    </div>

                    <div className="warn-box marg-top-15">
                      <div className="ft-12 dark-text">{props.WC003}</div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default SponsorPayrollLeftbar;
