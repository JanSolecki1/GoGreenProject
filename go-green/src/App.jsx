import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import SwipeDaily from "./pages/SwipeDaily";
import GameFlow from "./pages/GameFlow";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div>

      <NavBar />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/words" element={
          <ProtectedRoute>
            <SwipeDaily />
          </ProtectedRoute>
        }/>

        <Route path="/game" element={
          <ProtectedRoute>
            <GameFlow />
          </ProtectedRoute>
        }/>

        <Route path="/progress" element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }/>

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }/>

        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}
