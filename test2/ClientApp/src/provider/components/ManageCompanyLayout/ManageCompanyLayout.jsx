import React, { useContext, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Breadcrumb, Toast } from "react-bootstrap";
import { get, find, isEmpty } from "lodash";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { InnerLayoutButtons } from "../";
import {
  manageCompanyStore,
  setManageCompanyFlow,
  setManageCompanyToastInfo,
  getCompanyDetailsAction,
} from "../../contexts";
import { useDeepEffect, useRouterParams } from "../../abstracts";
import {
  ALL_MANAGE_COMPANY_ROUTES,
  MANAGE_COMPANY_ROUTES,
  ROUTES,
  manageCompanyFormNames,
  apiErrors,
  getPathWithParam,
  screenContext,
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  contextSharing,
  contextIds,
} from "../../utils";
import { useFormikContext } from "formik";
import Cancel from "../../styles/cancel.png";
import RouteLeavingGuard from "../RouteLeavingGuard";

const ManageCompanyLayout = ({
  children,
  buttons = [],
  tabs,
  pageFlow,
  layoutHeader,
  customBreadCrumbs,
  blockNavigation,
  location,
  history,
}) => {
  const [showError, setShowError] = useState(false);
  const { state, dispatch } = useContext(manageCompanyStore);
  const companyName = get(
    state,
    `${manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY}.companyName`
  );
  let cmpy = companyName;
  if (cmpy != undefined) {
    cmpy = cmpy.length > 15 ? cmpy.slice(0, 15) + "..." : cmpy;
  }
  const apiError = get(state, "api.error", {});
  const { companyId, flow } = useRouterParams();
  const {
    dirty,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormikContext() || {
    dirty: false,
    setSubmitting: () => {},
  };
  const { showToast, toastMessage } = state;
  const apiData = get(state, "api.data", {});

  const menuDetails = find(ALL_MANAGE_COMPANY_ROUTES, (item) => {
    if (get(state, "selectedMenu", "").indexOf(get(item, "path")) !== -1) {
      return true;
    }
    return false;
  });

  useDeepEffect(() => {
    if (isEmpty(apiData) && companyId) {
      dispatch(getCompanyDetailsAction(companyId, dispatch, state));
      dispatch(setManageCompanyFlow({ flow, companyId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

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
      label: "Manage Company",
      link: ROUTES.COMPANY,
    },
  ];

  if (companyName) {
    breadCrumOptions.push({
      label: cmpy,
      link: getPathWithParam({
        path: MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS,
        pathParam: [FLOW_TYPES.EDIT, companyId],
      }),
    });
  }

  const breadCrumbsFromMenuDetails = get(menuDetails, "breadCrumbs", []);
  const isFromPlan =
    get(contextSharing.getContext(contextIds.planDetails), "from") ===
    screenContext.plan;

  const onProceedToPlanClick = () => {
    setSubmitting(true);
    window.setTimeout(() => {
      history.push({
        pathname: MANAGE_PLAN_ROUTES.CREATE_PLAN,
      });
      contextSharing.clearContext(contextIds.planDetails);
      contextSharing.setContext(contextIds.companyDetails, {
        from: screenContext.company,
        companyId: parseInt(companyId, 10),
      });
    }, 1);
  };

  if (!isEmpty(customBreadCrumbs)) {
    breadCrumOptions.push(...customBreadCrumbs);
  } else if (!isEmpty(breadCrumbsFromMenuDetails)) {
    breadCrumOptions.push(
      ...breadCrumbsFromMenuDetails.map((item) => ({
        ...item,
        link: getPathWithParam({
          path: item.link,
          pathParam: [FLOW_TYPES.EDIT, companyId],
        }),
      }))
    );
  }

  const errorStatus = get(apiError, "response.status", 500);
  const errorData = apiErrors[errorStatus];
  let buttonsList = buttons || [];

  if (isFromPlan) {
    buttonsList = buttons.map((item) => {
      let variant = "link";
      if (item.variant === "primary") {
        variant = "secondary";
      }
      if (item.variant === "secondary") {
        variant = "link";
      }
      return {
        ...item,
        variant,
      };
    });
    buttonsList.push({
      label: "Proceed to Plan",
      variant: "primary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE, FLOW_TYPES.EDIT, FLOW_TYPES.VIEW],
      onClick: onProceedToPlanClick,
    });
  }

  const onRefresh = () => {
    if (resetForm) {
      resetForm();
      setSubmitting(false);
    }
  };

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
            <InnerLayoutButtons buttonsList={buttonsList} flow={pageFlow} />
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
            setManageCompanyToastInfo({
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
                    setManageCompanyToastInfo({
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

export default withRouter(ManageCompanyLayout);
