import React, { useContext, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Breadcrumb, Image, Toast } from "react-bootstrap";
import { get, find, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { InnerLayoutButtons } from "..";
import {
  manageMaintenanceStore,
  setManageMaintenanceFlow,
  setManageMaintenanceToastInfo,
  getMaintenanceDetailsAction,
} from "../../contexts";
import { useDeepEffect, useRouterParams } from "../../abstracts";
import {
  ALL_MANAGE_MAINTENANCE_ROUTES,
  MANAGE_MAINTENANCE_ROUTES,
  ROUTES,
  manageMaintenanceFormNames,
  apiErrors,
  getPathWithParam,
} from "../../utils";
import { useFormikContext } from "formik";
import Cancel from "../../styles/cancel.png";
import RouteLeavingGuard from "../RouteLeavingGuard";

const ManageMaintenanceLayout = ({
  children,
  buttons = [],
  tabs,
  pageFlow,
  layoutHeader,
  customBreadCrumbs,
  history,
}) => {
  const [showError, setShowError] = useState(false);
  const { state, dispatch } = useContext(manageMaintenanceStore);
  const maintenanceName = get(
    state,
    `${manageMaintenanceFormNames.HOLIDAY_CALENDAR}.maintenanceName`
  );
  const { maintenanceId, flow } = useRouterParams();
  const { showToast, toastMessage } = state;
  const { isSubmitting, dirty } = useFormikContext() || { dirty: false };

  const apiError = get(state, "api.error", {});
  const apiData = get(state, "api.data", {});
  const menuDetails = find(ALL_MANAGE_MAINTENANCE_ROUTES, (item) => {
    if (get(state, "selectedMenu", "").indexOf(get(item, "path")) !== -1) {
      return true;
    }
    return false;
  });

  useDeepEffect(() => {
    if (isEmpty(apiData) && maintenanceId) {
      dispatch(getMaintenanceDetailsAction(maintenanceId, dispatch, state));
      dispatch(setManageMaintenanceFlow({ flow, maintenanceId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenanceId]);

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
    // {
    //   label: "Home",
    //   link: ROUTES.HOME,
    // },
    // {
    //   label: "Maintenance",
    //   link: ROUTES.MANAGE_REPORT,
    // },
  ];

  // if (maintenanceName) {
  //   breadCrumOptions.push({
  //     label: maintenanceName,
  //     link: getPathWithParam({
  //       path: MANAGE_MAINTENANCE_ROUTES.REPORTS,
  //       pathParam: [flow, maintenanceId],
  //     }),
  //   });
  // }

  const breadCrumbsFromMenuDetails = get(menuDetails, "breadCrumbs", []);
  if (!isEmpty(customBreadCrumbs)) {
    breadCrumOptions.push(...customBreadCrumbs);
  } else if (!isEmpty(breadCrumbsFromMenuDetails)) {
    breadCrumOptions.push(
      ...breadCrumbsFromMenuDetails.map((item) => ({
        ...item,
        link: getPathWithParam({
          path: item.link,
          pathParam: [flow, maintenanceId],
        }),
      }))
    );
  }

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
              className={`error-banner justify-content-between d-flex align-items-center ${
                (showError && "enable") || ""
              }`}
            >
              <div>
                <Image src={Cancel} width="30px" />
              </div>
              <div>
                <div className="error-heading">{errorData.heading}</div>
                <div className="error-reason">{errorData.reason}</div>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  color="#000"
                  style={{ fontSize: "14px" }}
                  onClick={() => setShowError(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-100 overflow-auto" style={{ padding: "35px 35px" }}>
        {children}
      </div>
      <Toast
        onClose={() =>
          dispatch(
            setManageMaintenanceToastInfo({
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
                    setManageMaintenanceToastInfo({
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
        when={!isSubmitting && dirty}
        navigate={(path) => history.push(path)}
      />
    </div>
  );
};

export default withRouter(ManageMaintenanceLayout);
