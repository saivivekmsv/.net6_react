import React, { useEffect } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import Routes from "./routes";
// import { AppLayoutProvider } from "./contexts";
// import { contextIds, contextSharing } from "./utils";
// import { getAppInsights } from "./app-insights/TelemetryService";
// import TelemetryProvider from "./app-insights/telemetry-provider";

function App() {
  let appInsights = null;
  // useEffect(() => {
  //   window.addEventListener("beforeunload", () => {
  //     contextSharing.clearContext(contextIds.planDetails);
  //     contextSharing.clearContext(contextIds.companyDetails);
  //   });
  // }, []);
  return (
    // <AppLayoutProvider>
      <div className="App">
        Provider
      </div>
    // </AppLayoutProvider>
  );
}

export default App;
