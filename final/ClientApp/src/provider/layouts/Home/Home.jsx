import React from "react";
import { HomeContainer } from "../../containers";
import { withAppLayout } from "../../hoc";

const Home = (props) => {
  return <HomeContainer {...props} />;
};

export default withAppLayout(Home);
