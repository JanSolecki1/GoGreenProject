import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import SwipeDaily from "./pages/SwipeDaily";
import GameFlow from "./pages/GameFlow";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import Practice from "./pages/Practise";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  const location = useLocation();
  const isLogged = !!localStorage.getItem("user_id");

  // Paths where navbar should NOT appear even if logged in
  const hideNavbarPaths = ["/onboarding", "/", "/login"];

  const hideNavbar =
    !isLogged || hideNavbarPaths.includes(location.pathname);

  return (
    <div>
      {/* Show NavBar only when allowed */}
      {!hideNavbar && <NavBar />}

      <Routes>
        <Route path="/" element={<Onboarding />} />

        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/words"
          element={
            <ProtectedRoute>
              <SwipeDaily />
            </ProtectedRoute>
          }
        />

        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GameFlow />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/practise"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}
