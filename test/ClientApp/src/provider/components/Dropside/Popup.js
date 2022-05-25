import { get } from "lodash";
import React, { useRef, useState, useEffect } from "react";
import { useDeepEffect } from "../../abstracts";
import { getScrollParent } from "../../utils";

const scrollableParentSelectors = ".layout-content,.tab-content";

export default function PopUp(props) {
  const [popupStyle, setPopupStyle] = useState({
    visibility: "hidden",
  });
  const offset = 40;
  const { children, dropdownWrapperDom, setShowPopUp, direction } = props;
  const domRef = useRef(null);
  // const popupHeight = get(domRef, "current.clientHeight");

  const getRightStyle = ({
    scrollableElement,
    popupRectDetails,
    rectDetais,
  }) => {
    const { top, left, width } = rectDetais;
    const overlapStyle = {
      top: `${get(rectDetais, "top", 0) + 1}px`,
      left: `${get(rectDetais, "right", 0) - 3}px`,
    };
    if (
      scrollableElement &&
      scrollableElement.scrollHeight <
        popupRectDetails.top + popupRectDetails.height
    ) {
      return {
        bottom: `${offset}px`,
        left: `${left + width - 1}px`,
        rect: rectDetais,
        overlapStyle,
      };
    } else {
      return {
        top: `${top - offset}px`,
        left: `${left + width - 1}px`,
        rect: rectDetais,
        overlapStyle,
      };
    }
  };

  const getLeftStyle = ({
    scrollableElement,
    popupRectDetails,
    rectDetais,
  }) => {
    const { top, left, width, right, height } = rectDetais;
    const overlapStyle = {
      top: `${get(rectDetais, "top", 0) + 1}px`,
      left: `${get(rectDetais, "left", 0) - 3}px`,
    };
    if (
      scrollableElement &&
      scrollableElement.scrollHeight <
        popupRectDetails.top + popupRectDetails.height
    ) {
      return {
        bottom: `${height}px`,
        right: `${popupRectDetails.width - width + 60}px`,
        rect: rectDetais,
        overlapStyle,
      };
    } else {
      return {
        top: `${top - offset}px`,
        right: `${left + width - 1}px`,
        rect: rectDetais,
        overlapStyle,
      };
    }
  };

  const getBottomStyle = ({
    scrollableElement,
    popupRectDetails,
    rectDetais,
  }) => {
    const { top } = rectDetais;
    // const left = (popupRectDetails.width - width) / 2;
    const overlapStyle = {
      // top: `${rectDetais.top + rectDetais.height - 2}px`,
      // left: `${rectDetais.left + 1}px`,
      // width: `${width - 2}px`,
      // height: "3px",
      display: "none",
    };

    if (scrollableElement) {
      // console.log(
      //   "===scrollableElement.scrollHeight",
      //   scrollableElement.scrollHeight
      // );
      // console.log(
      //   "===popupRectDetails.top + popupRectDetails.height",
      //   popupRectDetails.top + popupRectDetails.height
      // );
    }

    if (
      scrollableElement &&
      scrollableElement.scrollHeight <
        popupRectDetails.top + popupRectDetails.height
    ) {
      return {
        top: `${rectDetais.top - popupRectDetails.height - 2}px`,
        left: `${rectDetais.left}px`,
        rect: rectDetais,
        overlapStyle,
      };
    }

    return {
      top: `${top + rectDetais.height + 2}px`,
      left: `${rectDetais.left}px`,
      rect: rectDetais,
      overlapStyle,
    };
  };

  const getPopupStyle = () => {
    const rectDetais = dropdownWrapperDom.getBoundingClientRect();
    const scrollableElement = getScrollParent(
      dropdownWrapperDom,
      scrollableParentSelectors // this is applicable only for this project
    );
    const popupUIDom = domRef.current;
    const popupRectDetails = popupUIDom.getBoundingClientRect();

    if (direction === "right") {
      return getRightStyle({
        scrollableElement,
        popupRectDetails,
        rectDetais,
      });
    }

    if (direction === "bottom") {
      return getBottomStyle({
        scrollableElement,
        popupRectDetails,
        rectDetais,
      });
    }
    if (direction === "leftSide") {
      return getLeftStyle({
        scrollableElement,
        popupRectDetails,
        rectDetais,
      });
    }
  };

  useEffect(() => {
    const scrollableElement = getScrollParent(
      dropdownWrapperDom,
      scrollableParentSelectors // this is applicable only for this project
    );
    if (scrollableElement) {
      const handleScroll = () => {
        setShowPopUp(false);
      };
      scrollableElement.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
      return () => {
        scrollableElement.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDeepEffect(() => {
    if (dropdownWrapperDom) {
      setPopupStyle({ ...getPopupStyle(), visibility: "visible" });
    }
  }, [dropdownWrapperDom]);

  const onPopupLayoutClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={domRef}
      className="dropSide-popup"
      style={popupStyle}
      onClick={onPopupLayoutClick}
    >
      {children}
      <div
        style={{
          ...get(popupStyle, "overlapStyle", {}),
        }}
        className="popup-overlap"
      >
        &nbsp;
      </div>
    </div>
  );
}
