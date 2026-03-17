import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingScreen from "./pages/LandingScreen";
import AppLayout from "./AppLayout";
import Layout from "./portal/Layout";
import EmployeeForms from "./portal/users/EmployeeForms";
import AddForm from "./portal/admin/AddForm";
import AddEmployee from "./portal/admin/AddEmployee";
import Login from "./portal/Login";
import { gooeyToast } from "goey-toast";
import ProtectedRoute from "./portal/ProtectedRoute";
import Employees from "./portal/admin/Employees";
import LeaveTypes from "./portal/admin/LeaveTypes";
import Forms from "./portal/admin/Forms";
import UpdateEmployee from "./portal/admin/UpdateEmployee";
import RaiseAppraisal from "./portal/users/RaiseAppraisal";
import AppraisalSubmissions from "./portal/users/AppraisalSubmissions";

const App = () => {
  // Load user from localStorage to persist login on refresh
  const [userLogged, setUserLogged] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  // Handle login
  const userLoggedIn = (data) => {
    setUserLogged(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // Handle logout
  const userLoggedOut = () => {
    localStorage.removeItem("user");
    setUserLogged(null);
    gooeyToast.error("User Logged Out", {
      fillColor: "#FFF",
      bounce: 0.45,
      timing: { displayDuration: 2500 },
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AppLayout userLogged = {userLogged} />}>
          <Route path="/" element={<LandingScreen />} />
        </Route>

        {/* Login */}
        <Route path="/login" element={<Login userLoggedIn={userLoggedIn} />} />

        {/* Admin Routes (role 0) */}
        <Route
          path="/hr360/admin/*"
          element={
            <ProtectedRoute userLogged={userLogged} allowedRoles={["admin"]}>
              <Layout userLogged={userLogged} userLoggedOut={userLoggedOut} />
            </ProtectedRoute>
          }
        >
          {/* Default admin landing page */}
          <Route
            index
            element={<Navigate to="add-employee" replace />}
          />
          <Route path="add-form" element={<AddForm />} />
          <Route path="forms" element={<Forms />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="update-employee/:id" element={<UpdateEmployee />} />
          <Route path="employees" element={<Employees />} />
          <Route path="leave-types" element={<LeaveTypes />} />
        </Route>

        {/* User Routes (role 1) */}
        <Route
          path="/hr360/user/*"
          element={
            <ProtectedRoute userLogged={userLogged} allowedRoles={["user"]}>
              <Layout userLogged={userLogged} userLoggedOut={userLoggedOut} />
            </ProtectedRoute>
          }
        >
          {/* Default user landing page */}
          <Route
            index
            element={<Navigate to="employee-forms" replace />}
          />
          <Route path="employee-forms" element={<EmployeeForms />} />
          <Route path="raise-appraisal" element={<RaiseAppraisal />} />
          <Route path="appraisals" element={<AppraisalSubmissions />} />
        </Route>

        {/* Catch-all: redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;