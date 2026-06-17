import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import ReactGA from "react-ga4";

import "./index.css";

import App from "./App";

import Dashboard from "./pages/Dashboard";

import Workspace from "./pages/Workspace";

import Practice from "./pages/Practice";

import LiveCode from "./pages/LiveCode";

import Login from "./pages/Login";

import Signup from "./pages/Signup";

import DebugCode from "./pages/DebugCode";

import Tickets from "./pages/Tickets";

import Community from "./pages/Community";

import CookieBanner from "./components/CookieBanner";
import CompleteProfile from "./pages/CompleteProfile";
import MyProfile from "./pages/MyProfile";
import Leaderboard from "./pages/Leaderboard";
import PublicProfile from "./pages/PublicProfile";
// GOOGLE ANALYTICS INIT
// ReactGA.initialize("G-NE7QPM4WFR");
const analyticsConsent =
  localStorage.getItem("analyticsCookies");

if (analyticsConsent === "true") {
  ReactGA.initialize("G-NE7QPM4WFR");
}

// TRACK PAGE VIEWS
function AnalyticsTracker() {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
    });
  }, [location]);

  return null;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <AnalyticsTracker />
    <CookieBanner />
    <Routes>
      <Route
        path="/"
        element={<App />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/workspace/:batchId"
        element={<Workspace />}
      />

      <Route
        path="/practice"
        element={<Practice />}
      />

      {/* LIVE CODE SHARE */}
      <Route
        path="/live"
        element={<LiveCode />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />
      <Route path="/debug" element={<DebugCode />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route
         path="/community"
         element={<Community />}
      />
      <Route
         path="/complete-profile"
         element={<CompleteProfile />}
      />

      <Route
        path="/profile"
        element={<MyProfile />}
      />
      <Route
        path="/leaderboard"
        element={<Leaderboard />}
      />
      <Route
        path="/profile/:userId"
        element={<PublicProfile />}
      />
    </Routes>
  </BrowserRouter>
);