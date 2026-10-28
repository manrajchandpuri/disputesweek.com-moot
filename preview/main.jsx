import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MootRoutes from "../src/moot/MootRoutes";

// Mirrors how the Emergent app mounts the module. Images load from the live site.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/moot/*" element={<MootRoutes assetBase="https://disputesweek.com" />} />
        <Route path="*" element={<Navigate to="/moot" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
