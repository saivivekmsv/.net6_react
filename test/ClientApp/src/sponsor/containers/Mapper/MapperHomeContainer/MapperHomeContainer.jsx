import React, { useState } from "react";
import FilterButtons from "./FilterButtons";
import ProfilesTile from "./ProfilesTile";
import { ManageMapperLayout } from "../../../../shared/components";
import { SearchDropdownWithAPI } from "../../../../shared/components";
import { Row, Col, Form } from "react-bootstrap";
import { postPlanGridDetails } from "../../../services";
import SampleData from "./SampleData";

const MapperHomeContainer = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setfilterValue] = useState("All");
  const handleSearchChange = (val) => {
    setSearchTerm(val);
  };
  const [Profiles, setProfiles] = useState(SampleData);

  const buttons = [
    {
      label: "Create Library",
      variant: "primary",
      type: "submit",
      link: "./manage-mapper-profile/basic-information",
    },
  ];

  return (
    <ManageMapperLayout
      buttons={buttons}
      donotShowBreadcrumbs={true}
      layoutHeader="Manage Data Library"
    >
      <div>
        <Row className="mr-1 mt-4">
          <Col>
            <Form>
              <SearchDropdownWithAPI
                searchPayloadKey="searchString"
                labelKey="planName"
                handleSelect={handleSearchChange}
                placeholder="Search input library, Plan name, ID here..."
                method={postPlanGridDetails}
              />
            </Form>
          </Col>
        </Row>

        <div className="d-flex">
          <FilterButtons
            setfilterValue={setfilterValue}
            filterValue={filterValue}
          />{" "}
          <div className="ml-auto mt-3 mr-3 font-weight-bold">
            {
              Profiles.filter((profile) => {
                if (filterValue == "All") {
                  return profile;
                } else if (filterValue == profile.filter_type) {
                  return profile;
                }
              }).filter((profile) => {
                if (searchTerm == "") {
                  return profile;
                } else if (
                  profile.mapperProfileName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return profile;
                }
              }).length
            }{" "}
            Files
          </div>
        </div>

        <div
          style={{
            overflow: "scroll",
            height: "27rem",
            marginTop: "35px",
            borderRadius: "5px",
          }}
        >
          {Profiles.filter((profile) => {
            if (filterValue == "All") {
              return profile;
            } else if (filterValue == profile.filter_type) {
              return profile;
            }
          })
            .filter((profile) => {
              if (profile == "") {
                return profile;
              } else if (
                profile.mapperProfileName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return profile;
              }
            })
            .map((profile) => {
              return (
                <ProfilesTile
                  profileType={profile.profileType}
                  mapperProfileName={profile.mapperProfileName}
                  description={profile.description}
                  targetType={profile.targetType}
                  sourceType={profile.sourceType}
                  category={profile.category}
                  level={profile.level}
                  associatedPlans={
                    profile.associatedPlans ? profile.associatedPlans : null
                  }
                  isActive={profile.isActive}
                />
              );
            })}
        </div>
      </div>
    </ManageMapperLayout>
  );
};

export default MapperHomeContainer;
