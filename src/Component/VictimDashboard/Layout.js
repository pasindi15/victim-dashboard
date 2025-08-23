// src/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Component/VictimDashboard/Footer/Footer";

export default function Layout() {
  return (
    <>
      <Outlet />   {/* Matched page (Dashboard / Aid / Report / Claim) renders here */}
      <Footer />
    </>
  );
}
