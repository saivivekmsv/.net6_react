import React from "react";
import { HomeContainer } from "../../containers";
import { AppLayoutProvider } from "../../../shared/contexts";
import { withAppLayout } from "../../hoc";

const Home = (props) => {
  return <AppLayoutProvider><HomeContainer {...props} /></AppLayoutProvider>;
};

export default withAppLayout(Home);
