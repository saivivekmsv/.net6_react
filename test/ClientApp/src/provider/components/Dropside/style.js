/* Non - Overridable CSS values are given as style | styledComponents */

/* Relative Container to hold absolute children of items */
const dropSideContainerStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

/* hide default <select> element: */
const selectStyle = {
  display: "none",
};

const customSelectPopUpState = {
  borderTopRightRadius: "0px",
  borderBottomRightRadius: "0px",
  borderRight: "none",
  zIndex: 10,
};

const arrowButtonStyle = {};

const popUpWrapperStyle = {};

export {
  dropSideContainerStyle,
  selectStyle,
  customSelectPopUpState,
  arrowButtonStyle,
  popUpWrapperStyle,
};
