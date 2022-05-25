import React, { useContext, useState, useEffect } from "react";
import { get, isEmpty, merge, isUndefined } from "lodash";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import {
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { Formik } from "formik";
import { Tabs, Tab } from "react-bootstrap";
import { AutoEnrollment } from "./AutoEnrollment";
import { ManagePlanLayout, TabLeavingGuard } from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  getAdvancedPathWithParam,
  ROUTES,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  savePlanDetailsAction,
  setManagePlanFlow,
} from "../../../contexts";
import { useRouterParams, useDeepEffect, useRequest } from "../../../abstracts";
import ADIApplicableFields from "./ADIApplicable";
import { DefaultElectionContainer } from "./DefaultElectionContainer";
import {
  postDefaultElectionSetting,
  getDefaultElectionSetting,
  getPlanSourceInformation,
  postADIApplicableConfiguration,
  getADIApplicableConfiguration,
  saveAutoEnrollment,
  saveAdditionalAutoEnrollment,
  getEmployeeClassification,
  getAutoEnrollment,
} from "../../../services";

const EnrollmentContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow, setNewFlow] = useState("");
  const { planId, flow } = useRouterParams();
  const [sourceEnrollmentError, setSourceEnrollmentError] = useState(false);
  const formName = managePlanFormNames.ADD_ENROLLMENT;
  const fields = formFields[formName];
  const [keyValue, setkeyValue] = useState(1);
  const [nextkeyValue, setNextkeyValue] = useState(keyValue);
  const [isInnerFormDirty, setIsInnerFormDirty] = useState(false);
  const [tabState, setTabState] = useState("visited");
  const initialValues = {};

  console.log(state, "state from plan");

  const apiData = get(state, "api.data", {});

  console.log(state, "state values");
  const ADI = get(apiData, "enrollment.autoDeferralncreaseApplicable", {});
  const [toggle, setToggle] = useState(false);
  const [icon, setIcon] = useState(faCheckCircle);
  const [iTabcolor, setITabcolor] = useState("#2F80ED");
  const [icolor, setIcolor] = useState("#2F80ED");
  const [i1, setI1] = useState(faCheckCircle);
  const [i1Tabcolor, setI1Tabcolor] = useState("#2F80ED");
  const [i1color, setI1color] = useState("#2F80ED");
  const [i2, setI2] = useState(faCheckCircle);
  const [i2Tabcolor, setI2Tabcolor] = useState("#2F80ED");
  const [i2color, setI2color] = useState("#2F80ED");

  //const [ADI, setADI] = useState({});
  const [commonError, setCommonError] = useState("");
  const [Avalues, setAvalues] = useState({});
  const [AdditionalAutoEnrollment, setAdditionalAutoEnrollment] = useState({});
  const [isSaved1, setIsSaved1] = useState(false);
  const [isSaved2, setIsSaved2] = useState(null);
  const [isSaved3, setIsSaved3] = useState(null);
  const enrollment = get(apiData, "enrollment", {});
  const getDefaultElection = !isEmpty(enrollment)
    ? get(enrollment, "defaultElectionSetting", {})
    : Object.create(null);
  const planInvestment = get(getDefaultElection, "planInvestment", []);
  const [saveInvestments, setSaveInvestments] = useState(
    planInvestment ? planInvestment : []
  );

  const sourcesList = get(apiData, "sources", []).filter(
    (source) => source.sourceType === 1 && source.sourceCategory === 2
  );
  const investmentsList = get(apiData, "investments", []);

  //console.log(enrollment, "enrollment");

  //console.log(getDefaultElection, "default");
  //adi
  const adiSources = isEmpty(
    get(enrollment, "autoDeferralncreaseApplicable.adi", [])
  )
    ? sourcesList
        .filter((_) => _.sourceType === 1)
        .map((e) => ({
          id: 0,
          autoDeferralIncreaseApplicableId: 0,
          sourceName: e.sourceName,
          autoDeferralIncrease: null,
          maximumADI: null,
          minimumADI: null,
        }))
    : get(enrollment, "autoDeferralncreaseApplicable.adi", []);

  const autoDeferralncreaseApplicable = !isEmpty(enrollment)
    ? get(enrollment, "autoDeferralncreaseApplicable", [])
    : {
        enrollmentId: 0,
        id: 0,
        autoDeferralIncreaseProgram: false,
        periodOfIncrease: 0,
        autoDeferralIncrease: get(
          enrollment,
          "autoDeferralncreaseApplicable.autoDeferralIncrease",
          3
        ),
        allocationPercentageforRehire: 0,
        rehireOtherPercentage: 0,
        applyADITo: 0,
      };

  console.log(getDefaultElection, "default");
  console.log(autoDeferralncreaseApplicable, "adi");

  //default election
  const sourceList = !isEmpty(sourcesList)
    ? sourcesList.map((e) => ({
        sourceId: e.id,
        sourceName: e.sourceName,
        contributionType: e.employeeDeferralSource.contributionType,
        maximumRate: e.employeeDeferralSource.limitMaximum,
        minimumRate: e.employeeDeferralSource.limitMinimum,
        contributionRate: null,
      }))
    : [];

  const investmentList = !isEmpty(investmentsList)
    ? investmentsList.map((e) => ({
        investmentId: e.id,
        investmentName: e.name,
        investmentPercentage: null,
      }))
    : [];
  //let formValues = {};
  const menuChange = (key) => {
    setNextkeyValue(key);

    setITabcolor("#bdbdbd");
    setI1Tabcolor("#bdbdbd");
    setI2Tabcolor("#bdbdbd");

    if (key == 1) {
      setITabcolor("#007bff");
    } else if (key == 2) {
      setI1Tabcolor("#007bff");
    } else {
      setI2Tabcolor("#007bff");
    }
  };
  //formValues = ADI;
  // if (getDefaultElection !== null && !isEmpty(getDefaultElection)) {
  //   var o1 = getDefaultElection.sourceList.reduce(
  //     (obj, item, i) =>
  //       Object.assign(obj, {
  //         ["SC" + item.sourceName]: item.contributionRate,
  //       }),
  //     {}
  //   );
  //   var o2 = getDefaultElection.investmentDetails.reduce(
  //     (obj, item, i) =>
  //       Object.assign(obj, {
  //         ["ID" + item.investmentName]: item.investmentPercentage,
  //       }),
  //     {}
  //   );
  //   formValues = merge({}, o1, o2, ADI);
  //   //formValues=getDefaultElection.sourceList.map((x,i)=>`sourceList[${i}].${x.sourceName}`:x.contributionRate)
  // }

  useDeepEffect(() => {
    if (!isEmpty(getDefaultElection)) {
      setIcolor("#219653");
    }

    if (!isEmpty(ADI) && get(ADI, "autoDeferralIncreaseProgram", false)) {
      setI1color("#219653");
    }

    if (
      !isEmpty(get(enrollment, "autoEnrollment", {})) &&
      get(enrollment, "autoEnrollment.subjecttoAutoEnrollment", false)
    ) {
      setI2color("#219653");
    }

    // getADIApplicableConfiguration(planId).then((response) => {
    //   if (!isEmpty(response)) {
    //     setI1color("#219653");
    //     setADI(response);
    //   }
    // });
    // getAutoEnrollment(planId).then((response) => {
    //   if (!isEmpty(response)) {
    //     setI2color("#219653");
    //     // setADI(response);
    //   }
    // });
  }, [toggle]);
  // useDeepEffect(()=>{
  //   if(!isEmpty(apiData.enrollment))
  //   setADI(apiData.enrollment.autoDeferralncreaseApplicable)
  // },[apiData]);
  const buttons = [
    {
      link: getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.ENROLLMENT,
        pathParam: [FLOW_TYPES.EDIT, planId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: ROUTES.PLAN,
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.ENROLLMENT,
            pathParam: [FLOW_TYPES.SAVE, planId],
          })
        ),
    },
  ];

  const { response: employeeClassification } = useRequest({
    method: getEmployeeClassification,
    payload: planId,
  });

  console.log(employeeClassification, "employees");

  const prepDataDefaultElectionSetting = (values) => {
    console.log();
    const defaultElectionSetting = {
      id: get(getDefaultElection, "id", 0),
      //enrollmentId: get(enrollment, "id", 0),
      deferralSourceContribution: get(
        values,
        "deferralSourceContributions",
        []
      ).map((e) => ({
        defaultElectionSettingsId: get(getDefaultElection, "id", 0),
        id: e.id,
        sourceName: e.sourceName,
        sourceType: e.sourceType,
        sourceCategory: e.sourceCategory,
        sourceSubCategory: e.sourceSubCategory,
        contributionRate: e.contributionRate, //typeof(e.contributionRate) === "string" ? parseInt(e.contributionType) : e.contributionType,
        contributionType: e.contributionType,
        minimumRate: e.minimumRate,
        maximumRate: e.maximumRate,
      })),
      planInvestment: get(values, "planInvestment", []).map((e) => ({
        defaultElectionSettingsId: get(getDefaultElection, "id", 0),
        id: e.id,
        investmentName: e.investmentName,
        description: e.description,
        investmentPercentage: e.investmentPercentage,
      })),
    };
    console.log(defaultElectionSetting, "default object");
    return defaultElectionSetting;
  };
  const preDataAdi = (values) => {
    const autoDeferralncreaseApplicable = {
      enrollmentId: get(
        values,
        "autoDeferralncreaseApplicable.enrollmentId",
        0
      ),
      id: get(values, "autoDeferralncreaseApplicable.id", 0),
      autoDeferralIncreaseProgram: get(
        values,
        "autoDeferralncreaseApplicable.autoDeferralIncreaseProgram"
      ),
      periodOfIncrease: get(
        values,
        "autoDeferralncreaseApplicable.periodOfIncrease"
      ),
      autoDeferralIncrease: get(
        values,
        "autoDeferralncreaseApplicable.autoDeferralIncrease",
        3
      ),
      allocationPercentageforRehire: get(
        values,
        "autoDeferralncreaseApplicable.allocationPercentageforRehire"
      ),
      rehireOtherPercentage: get(
        values,
        "autoDeferralncreaseApplicable.rehireOtherPercentage"
      ),
      applyADITo: get(values, "autoDeferralncreaseApplicable.applyADITo"),
      adi: isEmpty(get(values, "autoDeferralncreaseApplicable.adi", []))
        ? get(values, "adi")
        : get(values, "autoDeferralncreaseApplicable.adi", []),
    };
    return autoDeferralncreaseApplicable;
  };

  console.log(Avalues, "auto");
  const saveTab1 = () => {
    setToggle(!toggle);
    setIsSaved1(false);
    setIsSaved1(true);
    setIcon(faCheckCircle);
    setIcolor("#219653");
    setTabState("saved");
  };
  const saveTab2 = () => {
    setToggle(!toggle);
    setIsSaved2(false);
    setIsSaved2(true);
    setI1(faCheckCircle);
    setI1color("#219653");
    setTabState("saved");
  };
  const saveTab3 = () => {
    setToggle(!toggle);
    setIsSaved3(false);
    setIsSaved3(true);
    setI2(faCheckCircle);
    setI2color("#219653");
    setTabState("saved");
  };
  const commonSave = () => {
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ENROLLMENT,
        pathParam: [FLOW_TYPES.EDIT, planId],
      })
    );
    dispatch(
      setManagePlanToastInfo({
        showToast: true,
        toastMessage: "Data saved successfully",
      })
    );
  };
  const onFormSubmit = (values, { setFieldError }) => {
    setToggle(!toggle);
    console.log(Avalues);
    savePlanDetailsAction(
      {
        enrollment: {
          id: get(enrollment, "id", 0),
          planId: get(apiData, "id", planId),
          defaultElectionSetting: prepDataDefaultElectionSetting(values),
          autoDeferralncreaseApplicable: preDataAdi(values),

          autoEnrollment: !isEmpty(Avalues)
            ? {
                ...Avalues,
                excludedEmployeeClassifications: isEmpty(
                  get(Avalues, "excludedEmployeeClassifications", null)
                )
                  ? null
                  : Avalues.excludedEmployeeClassifications.map((source) => {
                      const match = employeeClassification.employeeClassifications.filter(
                        (x) => x.code === source
                      )[0];
                      console.log(match);
                      return {
                        codeName: match.codeName,
                        code: match.code,
                        id: isUndefined(match.id) ? 0 : match.id,
                      };
                    }),
                excludedEmploymentStatuses: isEmpty(
                  Avalues.excludedEmploymentStatuses
                )
                  ? null
                  : Avalues.excludedEmploymentStatuses.map((source) => {
                      const match = employeeClassification.employmentStatuses.filter(
                        (x) => x.employmentStatusCode === source
                      )[0];

                      return {
                        employmentStatusName: match.employmentStatusName,
                        employmentStatusCode: match.employmentStatusCode,
                        id: isUndefined(match.id) ? 0 : match.id,
                      };
                    }),
                autoEnrollmentDeferralSources: isEmpty(
                  Avalues.autoEnrollmentDeferralSources
                )
                  ? null
                  : Avalues.autoEnrollmentDeferralSources.map((source, i) => {
                      if (isEmpty(source)) {
                        return {
                          id: 0,
                          deferralSourceName: sourceList[i].sourceName,
                          limitMinimum: sourceList[i].limitMinimum,
                          limitMaximum: sourceList[i].limitMaximum,
                          deferralSourcePercentage: null,
                        };
                      }
                      console.log("y", source);
                      return source;
                    }),
                autoEnrollmentSouceInvestmentElections: isEmpty(
                  Avalues.autoEnrollmentSouceInvestmentElections
                )
                  ? null
                  : Avalues.autoEnrollmentSouceInvestmentElections.map(
                      (source, i) => {
                        if (isEmpty(source)) {
                          return [
                            {
                              id: 0,
                              investmentName: null,
                              sourceName: sourceList[i].sourceName,
                              investmentPercentage: 0,
                            },
                          ];
                        }
                        console.log("y", source);
                        return source;
                      }
                    ),
                differentInvestmentElection: isEmpty(
                  Avalues.differentInvestmentElection
                )
                  ? null
                  : Avalues.differentInvestmentElection.map((source, i) => {
                      if (isEmpty(source)) {
                        return [
                          [
                            {
                              id: 0,
                              investmentName: null,
                              sourceName: sourceList[i].sourceName,
                              investmentPercentage: 0,
                            },
                          ],
                        ];
                      }
                      console.log("y", source);
                      return source;
                    }),
                additionalAutoEnrollment: AdditionalAutoEnrollment.map(
                  (value) => {
                    const addAdditionalAutoEnrollment = {
                      ...value,
                      excludedEmployeeClassifications: isEmpty(
                        value.excludedEmployeeClassifications
                      )
                        ? null
                        : value.excludedEmployeeClassifications.map(
                            (source) => {
                              const match = employeeClassification.employeeClassifications.filter(
                                (x) => x.code === source.code
                              )[0];
                              console.log(match);
                              return {
                                codeName: match.codeName,
                                code: match.code,
                                id: isUndefined(match.id) ? 0 : match.id,
                              };
                            }
                          ),
                      excludedEmploymentStatuses: isEmpty(
                        value.excludedEmploymentStatuses
                      )
                        ? null
                        : value.excludedEmploymentStatuses.map((source) => {
                            const match = employeeClassification.employmentStatuses.filter(
                              (x) =>
                                x.employmentStatusCode ===
                                source.employmentStatusCode
                            )[0];

                            return {
                              employmentStatusName: match.employmentStatusName,
                              employmentStatusCode: match.employmentStatusCode,
                              id: isUndefined(match.id) ? 0 : match.id,
                            };
                          }),
                      additionalAutoEnrollmentDeferralSources: isEmpty(
                        value.additionalAutoEnrollmentDeferralSources
                      )
                        ? null
                        : value.additionalAutoEnrollmentDeferralSources.map(
                            (source, i) => {
                              if (isEmpty(source)) {
                                return {
                                  id: 0,
                                  deferralSourceName: sourceList[i].sourceName,
                                  limitMinimum: sourceList[i].limitMinimum,
                                  limitMaximum: sourceList[i].limitMaximum,
                                  deferralSourcePercentage: null,
                                };
                              }
                              console.log("y", source);
                              return source;
                            }
                          ),
                      additionalAutoEnrollmentSourceInvestmentElections: isEmpty(
                        value.additionalAutoEnrollmentSouceInvestmentElections
                      )
                        ? null
                        : value.additionalAutoEnrollmentSouceInvestmentElections.map(
                            (source, i) => {
                              if (isEmpty(source)) {
                                return [
                                  {
                                    id: 0,
                                    investmentName: null,
                                    sourceName: sourceList[i].sourceName,
                                    investmentPercentage: 0,
                                  },
                                ];
                              }
                              console.log("y", source);
                              return source;
                            }
                          ),
                      additionalAutoEnrollmentDifferentInvestmentElection: isEmpty(
                        value.additionalAutoEnrollmentDifferentInvestmentElection
                      )
                        ? null
                        : value.additionalAutoEnrollmentDifferentInvestmentElection.map(
                            (source, i) => {
                              if (isEmpty(source)) {
                                return [
                                  [
                                    {
                                      id: 0,
                                      investmentName: null,
                                      sourceName: sourceList[i].sourceName,
                                      investmentPercentage: 0,
                                    },
                                  ],
                                ];
                              }
                              console.log("y", source);
                              return source;
                            }
                          ),
                    };
                    return addAdditionalAutoEnrollment;
                  }
                ),
              }
            : {
                enrollmentId: get(enrollment, "id", 0),
                id: get(enrollment, "autoEnrollment.id", 0),
                planId: get(apiData, "id", planId),
                subjecttoAutoEnrollment: false,
              },
        },
      },
      dispatch,
      state
    ).then((response) => {
      //setCommonError('')
      console.log("y");
      if (response.isSuccessful) {
        setCommonError("");
        // commonSave();
        saveTab1();
        const newPlanId = get(response, "plan.id");
        const newCompanyId = get(response, "plan.companyId");
        console.log(newPlanId);
        console.log(newCompanyId);
        console.log(response, "response");
        dispatch(
          setManagePlanFlow({
            planId: newPlanId,
            companyId: newCompanyId,
          })
        );
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.ENROLLMENT,
            pathParam: [FLOW_TYPES.EDIT, newPlanId],
          })
        );
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: "Data saved successfully",
          })
        );
      } else {
        //var index = 0;
        setTabState("error");
        setIsSaved1(false);
        setIcon(faExclamationTriangle);
        setIcolor("#EB5757");
        // for (var i = 0; i < response.errorMessages.length; i++) {
        //   var _ = response.errorMessages[i];
        //   sourceList.forEach((x, ind) => {
        //     if (x.sourceName === _.controlName) index = ind;
        //   });
        //   if (_.index === 1) {
        //     if (_.controlName === "totalBox") setCommonError(_.errorMessage);
        //     else {
        //       setFieldError("SC" + _.controlName, _.errorMessage);
        //       setCommonError("");
        //     }
        //     //setFieldError( 'commonError', _.errorMessage)
        //   } else setFieldError("totalBox", _.errorMessage);
        // }
      }
    });

    // saveAutoEnrollment({
    //   planId: parseInt(planId),
    //   ...value,
    //   excludedEmployeeClassifications: isEmpty(
    //     Avalues.excludedEmployeeClassifications
    //   )
    //     ? null
    //     : Avalues.excludedEmployeeClassifications.map((source) => {
    //         const match = employeeClassification.employeeClassifications.filter(
    //           (x) => x.code === source
    //         )[0];
    //         return {
    //           codeName: match.codeName,
    //           code: match.code,
    //         };
    //       }),
    //   excludedEmployeeStatus: isEmpty(Avalues.excludedEmploymentStatuses)
    //     ? null
    //     : Avalues.excludedEmploymentStatuses.map((source) => {
    //         const match = employeeClassification.employmentStatuses.filter(
    //           (x) => x.employmentStatusCode === source
    //         )[0];

    //         return {
    //           employmentStatusName: match.employmentStatusName,
    //           employmentStatusCode: match.employmentStatusCode,
    //         };
    //       }),
    //   autoEnrollmentDeferralSources: isEmpty(Avalues.autoEnrollmentDeferralSources)?null:Avalues.autoEnrollmentDeferralSources.map(
    //     (source, i) => {

    //       if (isEmpty(source)) {

    //         return {
    //           id: 0,
    //           deferralSourceName: sourceList[i].sourceName,
    //           limitMinimum: sourceList[i].limitMinimum,
    //           limitMaximum: sourceList[i].limitMaximum,
    //           deferralSourcePercentage: null,
    //         };
    //       }
    //       console.log('y',source)
    //       return source;
    //     }
    //   ),
    //   autoEnrollmentSouceInvestmentElections:isEmpty(Avalues.autoEnrollmentSouceInvestmentElections)?null:Avalues.autoEnrollmentSouceInvestmentElections.map(
    //     (source, i) => {

    //       if (isEmpty(source)) {

    //         return [{
    //           id: 0,
    //           investmentName: null,
    //           sourceName: sourceList[i].sourceName,
    //           investmentPercentage: 0,
    //         }]
    //       }
    //       console.log('y',source)
    //       return source;
    //     }
    //   ),
    //   differentInvestmentElection:isEmpty(Avalues.differentInvestmentElection)?null:Avalues.differentInvestmentElection.map(
    //     (source, i) => {

    //       if (isEmpty(source)) {
    //         return(
    //         [

    //             [
    //               {
    //                 id: 0,
    //           investmentName: null,
    //           sourceName: sourceList[i].sourceName,
    //           investmentPercentage: 0,
    //               },
    //             ],
    //           ]

    //         )}
    //       console.log('y',source)
    //       return source;
    //     }
    //   ),
    // }).then((response) => {
    //   if (response) {
    //     saveTab3();
    //   }
    // AdditionalAutoEnrollment.map((value) =>
    //   saveAdditionalAutoEnrollment({
    //     planId: parseInt(planId),
    //     ...value,
    //     excludedEmployeeClassifications: isEmpty(
    //       value.excludedEmployeeClassifications
    //     )
    //       ? null
    //       : value.excludedEmployeeClassifications.map((source) => {
    //           const match = employeeClassification.employeeClassifications.filter(
    //             (x) => x.code === "" + source
    //           )[0];
    //           return {
    //             codeName: match.codeName,
    //             code: match.code,
    //           };
    //         }),
    //     excludedEmploymentStatuses: isEmpty(value.excludedEmploymentStatuses)
    //       ? null
    //       : value.excludedEmploymentStatuses.map((source) => {
    //           const match = employeeClassification.employmentStatuses.filter(
    //             (x) => x.employmentStatusCode === "" + source
    //           )[0];
    //           return {
    //             employmentStatusName: match.employmentStatusName,
    //             employmentStatusCode: match.employmentStatusCode,
    //           };
    //         }),
    //     additionalAutoEnrollmentDeferralSources: isEmpty(
    //       value.autoEnrollmentDeferralSources
    //     )
    //       ? null
    //       : value.autoEnrollmentDeferralSources.map((source, i) => {
    //           if (isEmpty(source)) {
    //             return {
    //               id: 0,
    //               deferralSourceName: sourceList[i].sourceName,
    //               limitMinimum: sourceList[i].limitMinimum,
    //               limitMaximum: sourceList[i].limitMaximum,
    //               deferralSourcePercentage: null,
    //             };
    //           }
    //           return source;
    //         }),
    //   }).then((response) => {
    //     if (response) {
    //     }
    //   })
    // );
    //});
  };

  useDeepEffect(() => {
    setITabcolor("#bdbdbd");
    setI1Tabcolor("#bdbdbd");
    setI2Tabcolor("#bdbdbd");

    if (keyValue === 1) {
      setITabcolor("#007bff");
    } else if (keyValue === 2) {
      setI1Tabcolor("#007bff");
    } else {
      setI2Tabcolor("#007bff");
    }

    if (
      isSaved1 &&
      (isSaved2 === true || isSaved2 === null) &&
      (isSaved3 === true || isSaved3 === null)
    ) {
      commonSave();
    }
  }, [isSaved1, isSaved2, isSaved3]);

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        sourceList: sourceList,
        investmentList: investmentList,
        deferralSourceContributions: !isEmpty(getDefaultElection)
          ? get(getDefaultElection, "deferralSourceContribution", [])
          : sourceList,
        planInvestment: saveInvestments,
        defaultElectionSetting: getDefaultElection,
        adi: adiSources,
        autoDeferralncreaseApplicable: autoDeferralncreaseApplicable,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formProps) => {
        const {
          handleChange,
          setFieldValue,
          handleSubmit,
          setValues,
          setTouched,
          values,
          setSubmitting,
          ...rest
        } = formProps;

        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <div className="mt-3">
                <Tabs
                  defaultActiveKey={1}
                  transition={false}
                  activeKey={keyValue}
                  onSelect={menuChange}
                  className="top-level-tab-enrollment"
                  //id={tabState}
                  mountOnEnter
                  unmountOnExit
                >
                  <Tab
                    eventKey={1}
                    npm
                    className="EnrollmentTabs"
                    title={
                      <span
                        style={{
                          padding: "10px 0px 0px 0px",
                          borderTop: "3px solid " + iTabcolor,
                        }}
                      >
                        <FontAwesomeIcon icon={icon} size="sm" color={icolor} />{" "}
                        Default Election{" "}
                        {/* {keyValue===1?<b>Default Election</b>:"Default Election"} */}
                      </span>
                    }
                  >
                    <DefaultElectionContainer
                      {...formProps}
                      fields={fields}
                      isEdit={isEdit}
                      isSave={isSave}
                      planId={planId}
                      setToggle={setToggle}
                      toggle={toggle}
                      saveInvestments={saveInvestments}
                      setSaveInvestments={setSaveInvestments}
                      commonError={commonError}
                    />
                  </Tab>
                  <Tab
                    eventKey={2}
                    title={
                      <span
                        style={{
                          padding: "10px 0px 0px 0px",
                          borderTop: "3px solid " + i1Tabcolor,
                        }}
                      >
                        <FontAwesomeIcon icon={i1} size="sm" color={i1color} />{" "}
                        ADI Applicable
                      </span>
                    }
                  >
                    <ADIApplicableFields
                      {...formProps}
                      fields={fields}
                      isEdit={isEdit}
                      isSave={isSave}
                      planId={planId}
                    />
                  </Tab>
                  <Tab
                    eventKey={3}
                    title={
                      <span
                        style={{
                          padding: "10px 0px 0px 0px",
                          borderTop: "3px solid " + i2Tabcolor,
                        }}
                      >
                        <FontAwesomeIcon icon={i2} size="sm" color={i2color} />{" "}
                        Auto Enrollment
                      </span>
                    }
                  >
                    <AutoEnrollment
                      {...formProps}
                      {...props}
                      fields={fields}
                      isEdit={isEdit}
                      isSave={isSave}
                      planId={planId}
                      history={history}
                      getDefaultElection={getDefaultElection}
                      setAvalues={setAvalues}
                      setAdditionalAutoEnrollment={setAdditionalAutoEnrollment}
                      setToggle={setToggle}
                      toggle={toggle}
                    />
                  </Tab>
                </Tabs>
              </div>
            </ManagePlanLayout>
            <TabLeavingGuard
              {...{
                isInnerFormDirty,
                setIsInnerFormDirty,
                setkeyValue,
                nextkeyValue,
                setNextkeyValue,
                keyValue,
              }}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default EnrollmentContainer;
