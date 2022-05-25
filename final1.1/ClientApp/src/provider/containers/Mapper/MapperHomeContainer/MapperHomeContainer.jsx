import React, { useEffect, useState } from "react";
import FilterButtons from "./FilterButtons";
import ProfilesTile from "./ProfilesTile";
import {
  SearchDropdownWithAPI,
  ManageMapperLayout,
  LoaderWrapper,
} from "../../../components";
import { Row, Col, Form } from "react-bootstrap";
import { postPlanGridDetails, searchProfiles } from "../../../services";
import SampleData from "./SampleData";
import { MANAGE_MAPPER_ROUTES, getPathWithParam } from "../../../utils";
import { useRequest } from "../../../abstracts";
import { getMappingProfiles } from "../../../services";

const MapperHomeContainer = (props) => {
  const [filterValue, setfilterValue] = useState("All");
  const handleSearchChange = (val) => {
    searchProfiles({ searchString: val }).then((response) =>
      setProfiles(response)
    );
  };
  const [Profiles, setProfiles] = useState([]);
  const { response, loading, error } = useRequest({
    method: getMappingProfiles,
  });
  useEffect(() => {
    setProfiles(response);
  }, [response]);

  const onClick = () => {
    const { history } = props;
    history.push(
      getPathWithParam({
        path: MANAGE_MAPPER_ROUTES.BASIC_INFORMATION,
      })
    );
  };

  const buttons = [
    {
      label: "Create Library",
      variant: "primary",
      type: "submit",
      onClick: onClick,
    },
  ];

  return (
    <ManageMapperLayout
      buttons={buttons}
      donotShowBreadcrumbs={true}
      layoutHeader="Manage Data Library"
    >
      <LoaderWrapper isLoading={loading}>
        <Row className="mr-1 mt-4">
          <Col>
            <Form>
              <SearchDropdownWithAPI
                searchPayloadKey="searchString"
                labelKey="name"
                handleSelect={handleSearchChange}
                placeholder="Search input library here..."
                method={searchProfiles}
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
            {(Profiles ? Profiles.length : "0") + " Files"}
          </div>
        </div>
        <div className="ml-auto mt-3 mr-3 ">
          <div
            style={{
              overflow: "scroll",
              height: "27rem",
              marginTop: "35px",
              borderRadius: "5px",
            }}
          >
            {Profiles &&
              Profiles.map((profile) => {
                return (
                  <ProfilesTile
                    profileType={profile.profileType}
                    mapperProfileName={profile.name}
                    description={profile.description}
                    targetType={profile.targetType}
                    sourceType={profile.sourceType}
                    category={profile.category}
                    level={profile.level}
                    associatedPlans={
                      profile.associatedPlans ? profile.associatedPlans : null
                    }
                    isActive={profile.isActive}
                    profileId={profile.id}
                  />
                );
              })}
          </div>
        </div>
      </LoaderWrapper>
    </ManageMapperLayout>
  );
};

export default MapperHomeContainer;
