import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App";

import Dashboard from "./pages/Dashboard";

import Workspace from "./pages/Workspace";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>

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
  path="/login"
  element={<Login />}
/>

<Route
  path="/signup"
  element={<Signup />}
/>
    </Routes>

  </BrowserRouter>

);