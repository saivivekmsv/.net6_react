import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FormControlSearch, SliderPanel } from "../../components";
import SponsorCard from "../../components/SponsorCards/SponsorCard";
import SponsorFieldview from "../../components/SponsorClassificationCard/SponsorFieldview";
import SponsorClassificationCard from "../../components/SponsorClassificationCard/SponsorClassificationCard";
import SponsorListingSearch from "../../components/SponsorListingSearch/SponsorListingSearch";

const SponsorSliderPanelContainer = ({ data, isSliderOpen, setSliderOpen }) => {
  const [classificationCodes, setClassificationCodes] = useState();

  return (
    <SliderPanel isOpen={isSliderOpen} size="60" showCancel={false}>
      <div className="pad-bottom-20">
        <div className="flex-row space-between border-bottom marg-bottom-10">
          <div className="ft-18 fw-500">Employee Classification Type</div>
          <div>
            <Button className="edit-button">Edit</Button>
            <Button
              className="close-button"
              onClick={() => setSliderOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
        <div>
          <SponsorFieldview title1="Classification Name" value1="New york" />
          <SponsorFieldview title1="Classification Code" value1="NY" />
          <SponsorFieldview
            title1="Effective start date "
            value1="12/22/2018"
          />
          <SponsorFieldview title1="Effective end date" value1="12/22/2021" />
        </div>
        <div className="disp-flex-col marg-top-20 border-bottom pad-bottom-20">
          <div className="ft-18 fw-500 marg-bottom-6">Attributes</div>
          <div className="title">02 Records </div>
        </div>
        <SponsorListingSearch
          list={[]}
          setResult={setClassificationCodes}
          className="w-50 marg-top-20"
        />
        <div className="marg-top-60">
          <SponsorClassificationCard
            data={[
              {
                label: "Attribute name ",
                value: "Percentage value mixed type",
              },
              {
                label: "Value",
                value: "122",
              },
            ]}
          />
          <SponsorClassificationCard
            data={[
              {
                label: "Attribute name ",
                value: "Value fixed match",
              },
              {
                label: "Value",
                value: "12",
              },
            ]}
          />
        </div>
      </div>
    </SliderPanel>
  );
};

export default SponsorSliderPanelContainer;
