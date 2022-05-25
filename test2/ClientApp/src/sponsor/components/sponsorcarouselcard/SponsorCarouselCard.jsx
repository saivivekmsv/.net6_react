import React from "react";
import { Button, Carousel } from "react-bootstrap";

const SponsorCarouselCard = () => {
  return (

    <div className="w-100 tile-with-border d-flex flex-column">
      <div>
      Are your Employees saving enough for Retirement 

      </div>
      <div className="w-100 bt-4 p-2" >
        <Button className="float-md-right" variant="outline-success">Check now</Button>
      </div>
    </div>

  );
};

export default SponsorCarouselCard;
