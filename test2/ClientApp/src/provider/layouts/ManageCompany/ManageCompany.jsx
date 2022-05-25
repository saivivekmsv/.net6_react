import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import {
  ManageCompanyMenu,
  LoaderWrapper,
  CompanyLogoUpload,
  GetInitials,
  ImageUpload,
} from "../../components";
import { withAppLayout } from "../../hoc";
import { useDeepEffect, useRequest } from "../../abstracts";
import {
  MANAGE_COMPANY_MENU,
  manageCompanyFormNames,
  tranformListToDropdownValues,
  screenContext,
  contextSharing,
  contextIds,
} from "../../utils";
import { ManageCompanyRoutes } from "../../routes";
import {
  manageCompanyStore,
  ManageCompanyProvider,
  setManageCompanySelectedMenu,
  setManageCompanyFullPageData,
} from "../../contexts";
import { getStates, uploadCompanyLogo, getCompanyLogo } from "../../services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTimes,
  faPencilAlt,
} from "@fortawesome/pro-light-svg-icons";
import AddToolTip from "../../components/AddToolTip";
import { Link } from "react-router-dom";

export const ManageCompany = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(manageCompanyStore);
  const isFromPlan =
    get(contextSharing.getContext(contextIds.planDetails), "from") ===
    screenContext.plan;

  const { response: statesResponse, loading: isStatesLoading } = useRequest({
    method: getStates,
  });
  const { isFetching } = get(state, "api", {});
  const flow = get(state, "flow");
  const { isPayrollCalenderRequire } = get(state, "settings_managecompany", {});
  const [isPopupOpen, setisPopupOpen] = useState(0);
  const companyImg = state.api.data.logo
    ? state.api.data.logo
    : get(state, "imageURL", "");
  const [companyImage, setCompanyImage] = useState(companyImg);
  const [imageFile, setImageFile] = useState([]);
  const [validationCount, setValidationCount] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  const companyId = state.api.data.id
    ? state.api.data.id
    : get(state, "companyId");

  useEffect(() => {
    dispatch(setManageCompanySelectedMenu(location.pathname));
  }, [location]);

  useDeepEffect(() => {
    setCompanyImage(
      state.api.data.logo ? state.api.data.logo : get(state, "imageURL", "")
    );
  }, [state]);

  useDeepEffect(
    () => {
      if (!isStatesLoading) {
        dispatch(
          setManageCompanyFullPageData({
            states: tranformListToDropdownValues(
              statesResponse,
              "stateDescription",
              "stateCode"
            ),
          })
        );
      }
    },
    [isStatesLoading],
    true
  );

  const companyName = get(
    state,
    `${manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY}.companyName`,
    ""
  );
  const isLoading = get(state, "isLoading");

  const handleClose = () => {
    setisPopupOpen(false);
  };

  const saveImage = () => {
    if (validationCount === 0) {
      setImageLoading(true);
      setisPopupOpen(false);
      var formData = new FormData();
      formData.append("file", imageFile[0]);
      formData.append("companyId", companyId);
      uploadCompanyLogo(formData)
        .then((response) => {
          if (response) {
            setCompanyImage(imageFile[0].preview);
            setImageLoading(false);
          }
        })
        .catch((error) => {
          setImageLoading(false);
        });
    }
  };

  useDeepEffect(() => {
    getCompanyLogo(companyId).then((response) => {
      setCompanyImage(response);
    });
  }, [companyId]);

  const exit = () => {
    setisPopupOpen(false);
  };
  return (
    <LoaderWrapper
      isLoading={isLoading || isFetching || isStatesLoading || imageLoading}
      className="row manage-company-wrapper"
    >
      <div className="w-100">
        <Col className="h-100">
          {isFromPlan && (
            <Row>
              <Col className="p-0">
                <div className="context-banner">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  &nbsp;&nbsp; You have been navigated to company module from
                  plan creation, please complete company setup and proceed to
                  plan.
                </div>
              </Col>
            </Row>
          )}
          <Row sm="12" className="h-100">
            <Col className="manage-company-column manage-menu-items">
              <div className="company-name-component">
                {companyName && (
                  <div>
                    <div>
                      {!isEmpty(companyImage) ? (
                        <div>
                          <img
                            alt=""
                            // src={imageUrl}
                            src={companyImage}
                            style={{
                              width: "78px",
                              height: "78px",
                              borderRadius: "50%",
                              marginLeft: "9%",
                            }}
                            className="img-fluid"
                          />
                          <div
                            style={{
                              position: "relative",
                              left: "38%",
                              bottom: "18px",
                            }}
                          >
                            {flow !== "edit" && (
                              <Link onClick={() => setisPopupOpen(true)}>
                                <FontAwesomeIcon icon={faPencilAlt} size="1x" />
                              </Link>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ marginLeft: "10%", marginTop: "15%" }}>
                            <GetInitials name={companyName} />
                          </div>
                          <div
                            style={{
                              position: "relative",
                              left: "32%",
                              bottom: "22px",
                            }}
                          >
                            {flow !== "edit" && (
                              <Link onClick={() => setisPopupOpen(true)}>
                                <FontAwesomeIcon icon={faPencilAlt} size="1x" />
                              </Link>
                            )}
                          </div>
                        </div>
                      )}{" "}
                    </div>
                    <div className="heading" style={{ marginLeft: "10%" }}>
                      Company
                    </div>
                    <div style={{ marginLeft: "10%" }}>
                      <h6>
                        <AddToolTip name={companyName} />
                      </h6>
                    </div>
                  </div>
                )}
              </div>
              <ManageCompanyMenu
                menuList={MANAGE_COMPANY_MENU}
                selectedMenu={get(state, "selectedMenu")}
                companyId={companyId}
                flow={flow}
                isPayrollCalenderRequire={isPayrollCalenderRequire}
              />
            </Col>
            <Col className="h-100 manage-menu-content">
              <ManageCompanyRoutes companyName={companyName} />
            </Col>
          </Row>
        </Col>

        <Modal show={isPopupOpen} onHide={handleClose}>
          <Modal.Body className="image-upload-tab-294">
            <div className="image-upload-body">
              <div className="text-right">
                <Link>
                  <FontAwesomeIcon icon={faTimes} color="#000" onClick={exit} />
                </Link>
              </div>
              <div>
                <CompanyLogoUpload
                  // setFieldValue={setFieldValue}
                  label="Edit company logo"
                  name="employeeImage"
                  blockDrag={false}
                  id={companyId}
                  companyImage={companyImage}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  validationCount={validationCount}
                  setValidationCount={setValidationCount}
                  // flow="edit"
                />
                {/* <ImageUpload
                  // setFieldValue={setFieldValue}
                  label="Edit company logo"
                  name="employeeImage"
                  blockDrag={false}
                  id={companyId}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  validationCount={validationCount}
                  setValidationCount={setValidationCount}
                // flow="edit"
                /> */}
                {isEmpty(imageFile) ? (
                  <div marginLeft="10px">
                    <div className="margin-left-40">or</div>
                    <div>
                      <Button
                        variant="secondary"
                        className="margin-left-30"
                        onClick={exit}
                      >
                        No thanks
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="secondary"
                      className="margin-left-bottom"
                      onClick={exit}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="margin-left-bottom"
                      onClick={() => saveImage()}
                    >
                      Save
                    </Button>
                  </div>
                )}

                <br />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </LoaderWrapper>
  );
};

const ManageCompanyWithProvider = (props) => {
  // enven to handle location change
  useEffect(() => {
    return () => {
      contextSharing.clearContext(contextIds.planDetails);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ManageCompanyProvider>
      <ManageCompany {...props} />
    </ManageCompanyProvider>
  );
};

export default withAppLayout(ManageCompanyWithProvider);
