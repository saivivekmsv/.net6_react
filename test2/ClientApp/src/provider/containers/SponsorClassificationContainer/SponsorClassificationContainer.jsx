import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FormControlSearch, SliderPanel } from "../../components";
import SponsorCard from "../../components/SponsorCards/SponsorCard";
import SponsorFieldview from "../../components/SponsorClassificationCard/SponsorFieldview";
import SponsorClassificationCard from "../../components/SponsorClassificationCard/SponsorClassificationCard";
import SponsorListingSearch from "../../components/SponsorListingSearch/SponsorListingSearch";
import SponsorSliderPanelContainer from "./SponsorSliderPanelContainer";

const SponsorClassificationContainer = (data) => {
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [classificationCodes, setClassificationCodes] = useState();
  const onCardClick = () => {
    setSliderOpen(true);
  };
  return (
    <>
      <div className="classification-container">
        <div className="flex-row space-between border-bottom marg-bottom-10">
          <div className="ft-18 fw-500">Employee Classification Type</div>
          <div>
            <Button className="delete-button">Delete</Button>
            <Button className="edit-button">Edit</Button>
          </div>
        </div>
        <div className="classification-inner-box">
          <div className="disp-flex-col">
            <SponsorFieldview title1="Classification Type" value1="Location" />
            <SponsorFieldview
              title1="Client eligibility classification"
              value1="No"
            />
            <SponsorFieldview
              title1="Classification type required?"
              value1="Yes"
            />
            <SponsorFieldview
              title1="Multiple selections allowed?"
              value1="Yes"
            />
          </div>
          <div className="pad-right-20">
            <div className="disp-flex-col marg-top-20 border-bottom pad-bottom-20">
              <div className="ft-18 fw-500 marg-bottom-6">
                Employee Classification
              </div>
              <div className="title">03 Records </div>
            </div>
            <SponsorListingSearch
              list={[]}
              setResult={setClassificationCodes}
            />
            <div className="disp-flex-col marg-top-60">
              <SponsorClassificationCard
                data={[
                  {
                    label: "Classification Name",
                    value: "California",
                  },
                  {
                    label: "Classification Code",
                    value: "CA",
                  },
                ]}
                onClick={onCardClick}
              />
              <a
                onClick={() => {
                  onCardClick();
                }}
              >
                <SponsorClassificationCard
                  data={[
                    {
                      label: "Classification Name",
                      value: "washington DC",
                    },
                    {
                      label: "Classification Code",
                      value: "WDC",
                    },
                  ]}
                />
              </a>
              <a
                onClick={() => {
                  onCardClick();
                }}
              >
                <SponsorClassificationCard
                  data={[
                    {
                      label: "Classification Name",
                      value: "New York",
                    },
                    {
                      label: "Classification Code",
                      value: "NY",
                    },
                  ]}
                />
              </a>
            </div>
          </div>
          <SponsorSliderPanelContainer
            isSliderOpen={isSliderOpen}
            setSliderOpen={setSliderOpen}
          />
        </div>
      </div>
    </>
  );
};

export default SponsorClassificationContainer;
