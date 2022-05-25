import React, { Component, Fragment } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import authService from "./AuthorizeService";
import { ApplicationPaths } from "./ApiAuthorizationConstants";
import { ROUTES } from "../../utils";

export class LoginMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null,
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([
      authService.isAuthenticated(),
      authService.getUser(),
    ]);
    this.setState({
      isAuthenticated,
      userName: user && user.given_name,
    });
  }

  render() {
    const { isAuthenticated, userName } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath = {
        pathname: `${ApplicationPaths.LogOut}`,
        state: { local: true },
      };
      return this.authenticatedView(userName, profilePath, logoutPath);
    }
  }

  authenticatedView(userName, profilePath, logoutPath) {
    return (
      <Fragment>
        <Dropdown.ItemText>
          <div className="user-item">
            <label>User</label>
            <span>{userName}</span>
          </div>
        </Dropdown.ItemText>
        <Dropdown.ItemText>
          <div className="user-item">
            <label>Role</label>
            <span>Admin</span>
          </div>
        </Dropdown.ItemText>
        <Link to={ROUTES.HOME}>
          <Dropdown.Item as="button">Change Password</Dropdown.Item>
        </Link>
        <Link to={ROUTES.HOME}>
          <Dropdown.Item as="button">Logout</Dropdown.Item>
        </Link>
      </Fragment>
    );
  }

  anonymousView(registerPath, loginPath) {
    return (
      <Fragment>
        <h5>TODO will comeback and revisit this</h5>
      </Fragment>
    );
  }
}
