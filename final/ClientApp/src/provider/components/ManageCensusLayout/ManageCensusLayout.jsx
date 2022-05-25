import React, { useContext, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Breadcrumb, Button, Toast } from "react-bootstrap";
import { get, find, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTimesCircle } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { InnerLayoutButtons } from "../";
import {
  manageCensusStore,
  setManageCensusFlow,
  setManageCensusToastInfo,
  getCensusDetailsAction,
} from "../../contexts";
import { useDeepEffect, useRouterParams } from "../../abstracts";
import {
  ALL_MANAGE_CENSUS_ROUTES,
  MANAGE_CENSUS_ROUTES,
  ROUTES,
  manageCensusFormNames,
  apiErrors,
  getPathWithParam,
} from "../../utils";
import { useFormikContext } from "formik";
import RouteLeavingGuard from "../RouteLeavingGuard";

const ManageCensusLayout = ({
  children,
  buttons = [],
  tabs,
  pageFlow,
  layoutHeader,
  customBreadCrumbs,
  history,
  blockNavigation,
}) => {
  const [showError, setShowError] = useState(false);
  const { state, dispatch } = useContext(manageCensusStore);
  const censusName = get(
    state,
    `${manageCensusFormNames.ELIGIBILITY_PROCESS}.censusName`
  );
  const { censusId, flow } = useRouterParams();
  const { showToast, toastMessage } = state;
  const {
    isSubmitting,
    dirty,
    resetForm,
    setSubmitting,
  } = useFormikContext() || { dirty: false };
  const apiError = get(state, "api.error", {});
  const apiData = get(state, "api.data", {});
  const menuDetails = find(ALL_MANAGE_CENSUS_ROUTES, (item) => {
    if (get(state, "selectedMenu", "").indexOf(get(item, "path")) !== -1) {
      return true;
    }
    return false;
  });

  useDeepEffect(() => {
    if (isEmpty(apiData) && censusId) {
      dispatch(getCensusDetailsAction(censusId, dispatch, state));
      dispatch(setManageCensusFlow({ flow, censusId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [censusId]);

  useDeepEffect(
    () => {
      if (!isEmpty(apiError)) {
        setShowError(true);
      }
    },
    [apiError],
    true
  );

  const breadCrumOptions = [
    {
      label: "Home",
      link: ROUTES.HOME,
    },
    {
      label: "Manage Employees",
      link: ROUTES.MANAGE_EMPLOYEE,
    },
  ];

  if (censusName) {
    breadCrumOptions.push({
      label: censusName,
      link: getPathWithParam({
        path: MANAGE_CENSUS_ROUTES.ELIGIBILITY,
        pathParam: [flow, censusId],
      }),
    });
  }

  const breadCrumbsFromMenuDetails = get(menuDetails, "breadCrumbs", []);
  if (!isEmpty(customBreadCrumbs)) {
    breadCrumOptions.push(...customBreadCrumbs);
  } else if (!isEmpty(breadCrumbsFromMenuDetails)) {
    breadCrumOptions.push(
      ...breadCrumbsFromMenuDetails.map((item) => ({
        ...item,
        link: getPathWithParam({
          path: item.link,
          pathParam: [flow, censusId],
        }),
      }))
    );
  }

  const onRefresh = () => {
    if (resetForm) {
      resetForm();
      setSubmitting(false);
    }
  };

  const errorStatus = get(apiError, "response.status", 500);
  const errorData = apiErrors[errorStatus];

  return (
    <div className="d-flex flex-column manage-company h-100">
      <div className="d-flex flex-column layout-header">
        <div className="d-flex align-items-center">
          <div>
            <Breadcrumb>
              {breadCrumOptions.slice(-4).map((item, index) => (
                <Breadcrumb.Item key={index}>
                  <Link to={item.link}>{item.label}</Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <h5>{layoutHeader || get(menuDetails, "contentHeader", "")}</h5>
          </div>
          <div className="d-flex align-items-center justify-content-center tab-wrapper">
            {tabs}
          </div>
          <div className="ml-auto">
            <InnerLayoutButtons buttonsList={buttons} flow={pageFlow} />
          </div>
          {showError && (
            <div
              className={`error-banner d-flex align-items-center ${
                (showError && "enable") || ""
              }`}
            >
              <div>
                <div className="error-heading">{errorData.heading}</div>
                <div className="error-reason">{errorData.reason}</div>
              </div>
              <div className="ml-auto">
                <Button variant="link" onClick={() => setShowError(false)}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    color="#212529"
                    style={{ fontSize: "1.5rem" }}
                  />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="layout-content h-100 overflow-auto">{children}</div>
      <Toast
        onClose={() =>
          dispatch(
            setManageCensusToastInfo({
              showToast: false,
              toastMessage: "",
            })
          )
        }
        show={showToast}
        style={{
          position: "fixed",
          top: "10rem",
          right: "2rem",
          zIndex: "100",
        }}
        delay={3000}
        autohide
      >
        <Toast.Body className="success-toast-align">
          <div className="mr-2">
            {showToast ? (
              <FontAwesomeIcon icon={faCheckCircle} color="#3BB54A" size="lg" />
            ) : (
              ""
            )}
          </div>
          <div>{toastMessage}</div>
          <div className="ml-2">
            {showToast ? (
              <FontAwesomeIcon
                icon={faTimesCircle}
                color="#000000"
                size="md"
                onClick={() =>
                  dispatch(
                    setManageCensusToastInfo({
                      showToast: false,
                      toastMessage: "",
                    })
                  )
                }
              />
            ) : (
              ""
            )}
          </div>
        </Toast.Body>
      </Toast>
      <RouteLeavingGuard
        when={!isSubmitting && (dirty || !!blockNavigation)}
        navigate={(path) => history.push(path)}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default withRouter(ManageCensusLayout);
