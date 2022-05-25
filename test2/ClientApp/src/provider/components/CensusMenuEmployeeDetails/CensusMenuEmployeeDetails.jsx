import React, { useState } from "react";
import { useDeepEffect, useRequest } from "../../abstracts";
import { getEmployeeCensusInformation, getEmployeeImage } from "../../services";
// import employeeImage from "../../assets/sample_image.png";
import GetInitials from "../GetInitials";
import { Link } from "react-router-dom";
import { Form, Button, Tabs, Tab, Modal } from "react-bootstrap";
import ImageUpload from "../ImageUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { uploadEmployeeLogo } from "../../services";
import { isEmpty } from "lodash";
import LoaderWrapper from "../LoaderWrapper";

const CensusMenuEmployeeDetails = (props) => {
  const [isPopupOpen, setisPopupOpen] = useState(0);
  const [imageFile, setImageFile] = useState([]);
  const [employeeImage, setEmployeeImage] = useState("");
  const [validationCount, setValidationCount] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  const { response: filteredValues, loading: load } = useRequest({
    method: getEmployeeCensusInformation,
    payload: props.censusId,
    defaultResponse: [],
  });

  useDeepEffect(() => {
    setEmployeeImage(filteredValues.imageURL);
  }, [filteredValues]);

  const handleClose = () => {
    setisPopupOpen(false);
  };

  const saveImage = () => {
    if (validationCount === 0) {
      setImageLoading(true);
      setisPopupOpen(false);
      var formData = new FormData();
      formData.append("file", imageFile);
      formData.append("employeeId", props.censusId);
      uploadEmployeeLogo(formData)
        .then((response) => {
          if (response) {
            setEmployeeImage(imageFile.preview);
            setImageLoading(false);
          }
        })
        .catch((error) => {
          setImageLoading(false);
        });
    }
  };

  const exit = () => {
    setisPopupOpen(false);
  };

  return (
    <LoaderWrapper isLoading={load || imageLoading}>
      <div>
        <div
          className="d-flex flex-column employee-details"
          style={{ textAlign: "center" }}
        >
          <div>
            {!isEmpty(employeeImage) ? (
              <div>
                <img
                  alt=""
                  src={employeeImage}
                  style={{ width: "78px", height: "78px", borderRadius: "50%" }}
                  className="img-fluid"
                />
                <div
                  style={{
                    position: "relative",
                    left: "15%",
                    bottom: "22px",
                  }}
                >
                  {props.flow === "save" && (
                    <Link onClick={() => setisPopupOpen(true)}>
                      <FontAwesomeIcon icon={faPencilAlt} size="2x" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginLeft: "35%", marginTop: "15%" }}>
                  <GetInitials name={filteredValues.firstName} />
                </div>
                <div
                  style={{
                    position: "relative",
                    left: "10%",
                    bottom: "17px",
                  }}
                >
                  {props.flow === "save" && (
                    <Link onClick={() => setisPopupOpen(true)}>
                      <FontAwesomeIcon icon={faPencilAlt} size="2x" />
                    </Link>
                  )}
                </div>
              </div>

              // <div>
              //   <div style={{ marginLeft: "35%" }}>
              //     <GetInitials name={filteredValues.firstName} />
              //   </div>
              //   <div style={{ marginLeft: "55%" }}>
              //     <Link onClick={() => setisPopupOpen(true)}>
              //       {/* <GetInitials name={companyName} /> */}
              //       <FontAwesomeIcon icon={faPencilAlt} size="1x" />
              //     </Link>
              //   </div>
              // </div>
            )}{" "}
          </div>
          <div className="employee-name">
            {filteredValues.firstName} {filteredValues.middleName}{" "}
            {filteredValues.lastName}{" "}
          </div>

          <div className="employee-id">
            Employee ID : {filteredValues.employeeNumber ?? "-"}
          </div>
          <div className="employee-status">
            Status : {filteredValues.employmentStatus}
          </div>
        </div>

        <Modal show={isPopupOpen} onHide={handleClose}>
          <Modal.Body className="image-upload-tab-294">
            <div className="image-upload-body">
              <div className="text-right">
                <Link>
                  <FontAwesomeIcon icon={faTimes} color="#000" onClick={exit} />
                </Link>
              </div>
              <div>
                <ImageUpload
                  // setFieldValue={setFieldValue}
                  label="Edit profile image"
                  name="employeeImage"
                  blockDrag={false}
                  id={filteredValues.id}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  validationCount={validationCount}
                  setValidationCount={setValidationCount}
                  // flow="edit"
                />

                {isEmpty(imageFile) ? (
                  <div>
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

export default CensusMenuEmployeeDetails;
