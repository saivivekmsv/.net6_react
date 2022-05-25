import {
  faArrowUp,
  faShieldAlt,
  faUserShield,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SponsorFieldview from "../SponsorClassificationCard/SponsorFieldview";
import {
  Chart,
  ChartTitle,
  ChartTooltip,
  ChartLegend,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";

const SponsorPerformanceIndicesCard = (props) => {
  const baseYear = 2017;
  const generateData = (name) => {
    const data = {
      categories: [],
      series: {
        name: name,
        data: [],
      },
    };

    for (let i = 0; i < 5; i++) {
      data.categories.push(baseYear + i);
      data.series.data.push(Math.floor(Math.random() * 100));
    }

    return data;
  };

  const data1 = generateData("Overall plan");
  const data2 = generateData("S&P 500");
  const data3 = generateData("Default benchmark");

  return (
    <div
      className="d-flex flex-column justify-content-between "
      style={{
        borderRadius: "0.313rem",
        border:"1px solid #e0e0e0",
        backgroundColor:'white',
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="d-flex flex-row justify-content-between"style={{alignItems:'center'}}>
        <div className="heading " style={{ fontWeight: "500",margin:'20px 0px 0px 20px'}}>
          Performance Indices
        </div>
        <div className="d-flex flex-row" style={{margin:'20px 20px 0px 0px'}}>
          <div className="percentage-green">+21.4%</div>
          <FontAwesomeIcon icon={faArrowUp} className="percentage-green" />
        </div>
      </div>
      <div className="flex-row">
        <div>
          <div className="d-flex flex-column card" style={{width:'140px', height:'96px',alignItems:'center',margin:'15px 0px 0px 20px', padding:'15px 0px 15px 0px'}}>
            <div className="d-flex flex-row justify-content-between index-card marg-bot-15">
              <FontAwesomeIcon icon={faUserShield} className="icon" />
              <div className="percent">67 %</div>
            </div>
            <div className="label" style={{alignItems:'center'}}>Sponsor score</div>
          </div>
          <div className="d-flex flex-column card" style={{width:'140px', height:'96px',alignItems:'center' , margin:'15px 0px 0px 20px',padding:'15px 0px 15px 0px'}}>
            <div className="d-flex flex-row justify-content-between index-card marg-bot-15">
              <FontAwesomeIcon icon={faShieldAlt} className="icon" />
              <div className="percent">80 %</div>
            </div>
            <div className="label">Plan health</div>
          </div>
        </div>
        <div className="w-100" style={{height:'200px' , marginRight:'20px', marginLeft:'20px'}}>
          <Chart
            style={{
              height:'200px',
              
            }}
            pannable={{
              lock: "y",
            }}
            zoomable={{
              mousewheel: {
                lock: "y",
              },
            }}
          >
            <ChartTooltip format="{0}" />
            <ChartLegend position="top" orientation="horizontal" />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                categories={data1.categories}
                max={20}
                labels={{
                  rotation: "auto",
                }}
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem
                labels={{
                  format: "{0}%",
                }}
                min={0}
                max={100}
              />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem
                data={data1.series.data}
                type="line"
                style="smooth"
                name={data1.series.name}
                dashType="dash"
              />
              <ChartSeriesItem
                data={data2.series.data}
                type="line"
                style="smooth"
                name={data2.series.name}
                dashType="dash"
              />
              <ChartSeriesItem
                data={data3.series.data}
                type="line"
                style="smooth"
                name={data3.series.name}
                dashType="dash"
              />
            </ChartSeries>
          </Chart>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between p-3 card fee-disclosure" style={{margin:'15px 20px 20px 20px'}}>
        <div className="d-flex flex-row justify-content-between marg-bot-20 ">
          <div className="heading">Fee disclosure</div>
          <div className="year">1 year</div>
        </div>
        <div className="d-flex flex-row justify-content-between">
          <SponsorFieldview title1={"Collected fees"} value1={"$ 26,124.89"} />
          <SponsorFieldview title1={"Pending dues"} value1={"$ 6,124.78"} />
          <SponsorFieldview title1={"Upcoming fees"} value1={"$ 873.23"} />
          <div className="d-flex flex-column justify-content-between">
            <div className="d-flex flex-row justify-content-end">
              <div className="percentage-green">+21.4%</div>
              <FontAwesomeIcon icon={faArrowUp} className="percentage-green" />
            </div>
            <div className="title">Compared to $ 21,490.34 last year</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorPerformanceIndicesCard;
