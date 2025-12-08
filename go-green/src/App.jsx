import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Splash from "./pages/Splash";
import DailyWords from "./pages/DailyWords";
import MiniGame from "./pages/MiniGame";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/words"
          element={
            <ProtectedRoute>
              <DailyWords />
            </ProtectedRoute>
          }
        />

        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <MiniGame />
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
      </Routes>
    </div>
  );
}
