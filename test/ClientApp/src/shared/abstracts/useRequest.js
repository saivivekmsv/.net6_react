import { useState } from "react";
import { isEmpty } from "lodash";
import { useDeepEffect } from "./";

export default function useRequest(request = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(request.defaultResponse || null);
  useDeepEffect(
    () => {
      if (!isEmpty(request) && !request.stopTrigger) {
        loadData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [request],
    request.triggerOnlyOnUpdate
  );

  const loadData = () => {
    const { method, payload } = request;
    if (isEmpty(request)) {
      return;
    }
    setLoading(true);

    method(payload)
      .then((response) => {
        setResponse(response);
        setError(null);
      })
      .catch((err) => {
        setResponse(request.defaultResponse);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { response, loading, error };
}
