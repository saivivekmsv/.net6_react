import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Container } from "react-bootstrap";
import { get } from "lodash";
import { Header, Sidebar, Footer } from "../components";
import { appLayoutStore, setSelectedMenu } from "../contexts";

const withAppLayout = (Component) => {
  const ComposedComponent = (props) => {
    const { location } = props;
    const { state, dispatch } = useContext(appLayoutStore);

    // enven to handle location change
    useEffect(() => {
      dispatch(setSelectedMenu(location.pathname));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
      <>
        <Sidebar></Sidebar>
        <main>
          <Header />
          <Container fluid className="content-container">
            <Component {...props} />
          </Container>         
        </main>

      </>
    );
  };
  return withRouter(ComposedComponent);
};

export default withAppLayout;
