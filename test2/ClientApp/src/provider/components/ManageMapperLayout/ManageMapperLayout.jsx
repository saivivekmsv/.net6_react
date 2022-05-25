import React, { useContext, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Breadcrumb, Image, Toast } from "react-bootstrap";
import { get, find, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { InnerLayoutButtons } from "..";
import {
  manageMapperStore,
  setManageMapperFlow,
  getProfileDetailsAction,
  setManageMapperToastInfo,
} from "../../contexts";
import { LoaderWrapper } from "../../components";
import { useDeepEffect, useRouterParams } from "../../abstracts";
import {
  MANAGE_MAPPER_ROUTES,
  ROUTES,
  manageMapperFormNames,
  apiErrors,
  getPathWithParam,
  ALL_MANAGE_MAPPER_ROUTES,
} from "../../utils";
import { useFormikContext } from "formik";
import Cancel from "../../styles/cancel.png";
import RouteLeavingGuard from "../RouteLeavingGuard";

const ManageMapperLayout = ({
  rptName,
  children,
  buttons = [],
  tabs,
  pageFlow,
  layoutHeader,
  customBreadCrumbs,
  history,
  donotShowBreadcrumbs,
}) => {
  const [showError, setShowError] = useState(false);
  const { state, dispatch } = useContext(manageMapperStore);
  const reportName = get(
    state,
    `${manageMapperFormNames.ELIGIBILITY_FILTER}.reportName`
  );
  const { flow, profileId } = useRouterParams();
  const { showToast, toastMessage } = state;

  const apiError = get(state, "api.error", {});
  const apiData = get(state, "api.data", {});
  const {
    isSubmitting,
    dirty,
    resetForm,
    setSubmitting,
  } = useFormikContext() || { dirty: false };

  const onRefresh = () => {
    if (resetForm) {
      resetForm();
      setSubmitting(false);
    }
  };

  const menuDetails = find(ALL_MANAGE_MAPPER_ROUTES, (item) => {
    if (get(state, "selectedMenu", "").indexOf(get(item, "path")) !== -1) {
      return true;
    }
    return false;
  });

  useDeepEffect(() => {
    if (isEmpty(apiData) && profileId) {
      dispatch(getProfileDetailsAction(profileId, dispatch, state));
      dispatch(setManageMapperFlow({ flow, profileId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

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
      label: "Mapper",
      link: ROUTES.MAPPER,
    },
  ];

  if (reportName) {
    breadCrumOptions.push({
      label: reportName,
      link: getPathWithParam({
        path: MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM,
        pathParam: [flow],
      }),
    });
  }

  if (!isEmpty(customBreadCrumbs)) {
    breadCrumOptions.push(...customBreadCrumbs);
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
          pathParam: [flow],
        }),
      }))
    );
  }

  const errorStatus = get(apiError, "response.status", 500);
  const errorData = apiErrors[errorStatus];

  return (
    <div className="d-flex flex-column manage-report h-100">
      <div className="d-flex flex-column layout-header">
        <div className="d-flex align-items-center">
          <div>
            {donotShowBreadcrumbs ? (
              <></>
            ) : (
              <Breadcrumb>
                {breadCrumOptions.slice(-4).map((item, index) => (
                  <Breadcrumb.Item key={index}>
                    <Link to={item.link}>{item.label}</Link>
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            )}
            <div className="title-case">{rptName}</div>
            <h5>{layoutHeader || get(menuDetails, "contentHeader", "")}</h5>
          </div>
          {/* <div className="d-flex align-items-center justify-content-center tab-wrapper">
            {tabs}
          </div> */}
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
      <div className="layout-content h-100 overflow-auto">{children}</div>
      <Toast
        onClose={() =>
          dispatch(
            setManageMapperToastInfo({
              showToast: false,
              toastMessage: "",
            })
          )
        }
        show={showToast}
        style={{
          position: "fixed",
          bottom: "4rem",
          left: "6rem",
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
                    setManageMapperToastInfo({
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
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default withRouter(ManageMapperLayout);
