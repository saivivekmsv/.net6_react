import React from "react";
import { Button, Carousel } from "react-bootstrap";

const SponsorCarouselCard = () => {
  return (
    <>
      <div
        style={{
          //marginLeft: "80px",
          //marginBottom: "100px",
          width: "345px",
          height: "110px",
          padding: "20px 16px 20px 20px",
          border: "0.063rem solid #e0e0e0",
          background: "#FFFFFF",
          boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "24px",
            color: "#4F4F4F",
          }}
        >
          How much do you need to save for retirement?
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Carousel
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Carousel.Item>
                
                <Carousel.Caption>xyz</Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Carousel.Caption>yuj</Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Carousel.Caption>mki</Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Carousel.Caption>xyz</Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Carousel.Caption>xyz</Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              style={{
                width: "100px",
                height: "32px",
                color: "#0AB89A",
                border: "0.063rem solid #0AB89A",
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "16px",
                padding: "5px 8px",
                marginleft: "110px",
                textAlign: "center",
              }}
              variant="secondary"
              type="submit"
            >
              Checknow
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SponsorCarouselCard;
