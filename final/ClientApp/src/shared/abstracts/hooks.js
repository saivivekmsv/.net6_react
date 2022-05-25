import { useRef, useEffect, useState } from "react";
import { filter, isEqual } from "lodash";
import { useParams } from "react-router-dom";
import { FLOW_TYPES } from "../utils";

export const useComponentDidUpdate = (callback, props) => {
  const didMountRef = useRef(null);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...props]);
};

export const useDidClickedOutside = (ref) => {
  const [clickedOutside, setClickedOutside] = useState(false);
  useEffect(() => {
    function handleClickOutside(event) {
      setClickedOutside(ref.current && !ref.current.contains(event.target));
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keyup", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keyup", handleClickOutside);
    };
  }, [ref]);

  return clickedOutside;
};

export const useNoRerenderDidClickedOutside = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      callback(ref.current && !ref.current.contains(event.target));
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
};

export const useDetectScrollEnd = (ref) => {
  const [triggerScrollEnd, setTriggerScrollEnd] = useState(false);

  const handleScroll = (event) => {
    let elem = null;

    if (ref.current) {
      elem = ref.current;
    }
    const clientHeight = elem.clientHeight;
    const scrollHeight = elem.scrollHeight;
    const scrollTop = ref.current.scrollTop;

    if (
      elem &&
      Math.ceil(clientHeight) + Math.ceil(scrollTop) >= Math.ceil(scrollHeight)
    ) {
      setTriggerScrollEnd(true);
      setTriggerScrollEnd(false);
    }
  };

  useDeepEffect(() => {
    const elem = ref.current;
    elem.removeEventListener("scroll", handleScroll);
    elem.addEventListener("scroll", handleScroll);
    return () => {
      elem.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { triggerScrollEnd };
};

export const useLazyLoadForTable = (data = [], refreshObject) => {
  const [tableData, setTableData] = useState(data);
  const [shouldRefreshData, setShouldRefreshData] = useState(false);
  useDeepEffect(() => {
    if (shouldRefreshData) {
      setTableData(data);
      setShouldRefreshData(false);
    } else {
      setTableData([...tableData, ...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useDeepEffect(() => {
    setShouldRefreshData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshObject]);

  return { tableData };
};

// https://stackoverflow.com/questions/55326406/react-hooks-value-is-not-accessible-in-event-listener-function
// https://dmitripavlutin.com/react-hooks-stale-closures/
export const useWillComponentBeVisible = (
  domRef,
  initialValue = true,
  onUnMount
) => {
  const [spaceAvailable, setSpaceAvailable] = useState(initialValue);

  const spaceAvailableRef = useRef(spaceAvailable);

  useEffect(() => {
    window.addEventListener("resize", renderUpIfNoSpace);
    window.addEventListener("scroll", renderUpIfNoSpace);
    renderUpIfNoSpace();
    return () => {
      window.removeEventListener("resize", renderUpIfNoSpace);
      window.removeEventListener("scroll", renderUpIfNoSpace);
      onUnMount && onUnMount(spaceAvailableRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderUpIfNoSpace() {
    setSpaceAvailable((prevValue) => {
      const domElement = domRef.current;
      const domRect = domElement.getBoundingClientRect();
      const possibleDomBottomPosition = prevValue
        ? domRect.bottom
        : domRect.bottom + domRect.height;
      const windowInnerHeight = window.innerHeight;

      const newValue = windowInnerHeight >= possibleDomBottomPosition;
      spaceAvailableRef.current = newValue;

      return newValue;
    });
  }

  return spaceAvailable;
};

export const useMockLoading = () => {
  const [isMockLoading, setIsLoading] = useState(false);

  const mockLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return {
    isMockLoading,
    triggerMockLoading: mockLoading,
  };
};

export const useDeepEffect = (fn, deps, triggerOnlyOnUpdate) => {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isSame = prevDeps.current.every((obj, index) =>
      isEqual(obj, deps[index])
    );

    if ((!triggerOnlyOnUpdate && isFirst.current) || !isSame) {
      fn();
    }

    isFirst.current = false;
    prevDeps.current = deps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps, fn]);
};

export const useRouterParams = () => {
  const { flow = FLOW_TYPES.ADD, ...rest } = useParams();
  return { flow, ...rest };
};

export const useHasNewRecordsCheck = (data) => {
  const [hasNewRecord, setHasNewRecords] = useState(false);

  useDeepEffect(() => {
    const newRecords = filter(data, {
      isNew: true,
    });
    setHasNewRecords(newRecords.length > 0);
  }, [data]);

  return hasNewRecord;
};
