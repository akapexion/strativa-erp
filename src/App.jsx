import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingScreen from "./pages/LandingScreen";
import AboutUs from "./pages/AboutUs";
import Modules from "./pages/Modules";
import ContactUs from "./pages/ContactUs";
import OurTeam from "./pages/OurTeam";
import CorporateSolutions from "./pages/CorporateSolutions";
import UserGuide from "./pages/UserGuide";
import SupportCenter from "./pages/SupportCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ScrollToTop from "./components/ScrollToTop";
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
import UpdateEmployee from "./portal/admin/UpdateEmployee";
import RaiseAppraisal from "./portal/users/RaiseAppraisal";
import AppraisalSubmissions from "./portal/users/AppraisalSubmissions";
import RaiseDFI from "./portal/users/RaiseDFI";
import RaiseKPI from "./portal/users/RaiseKPI";
import DFISubmissions from "./portal/users/DFISubmissions";
import KPISubmissions from "./portal/users/KPISubmissions";
import Profile from "./portal/Profile";
import ProfileChangePassword from "./portal/ProfileChangePassword";
import EmployeeFormDetail from "./portal/users/EmployeeFormDetail";
import FormRequests from "./portal/manager/FormRequests";
import Leaves from "./portal/users/Leaves";
import LeaveRequests from "./portal/manager/LeaveRequests";
import RaiseCustomForm from "./portal/users/RaiseCustomForm";
import Forms from "./portal/admin/Forms";
import Attendance from "./portal/users/Attendance";
import SalaryPayslip from "./portal/users/SalaryPayslip";

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
    localStorage.removeItem("token");
    setUserLogged(null);
    gooeyToast.error("User Logged Out", {
      fillColor: "#FFF",
      bounce: 0.45,
      timing: { displayDuration: 2500 },
    });
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AppLayout userLogged={userLogged} />}>
          <Route index element={<LandingScreen />} />
          <Route path="about-us" element={<AboutUs userLogged={userLogged} />} />
          <Route path="about-the-platform" element={<Navigate to="/about-us" replace />} />
          <Route path="modules" element={<Modules userLogged={userLogged} />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="contact-hr" element={<Navigate to="/contact-us" replace />} />
          <Route path="our-team" element={<OurTeam userLogged={userLogged} />} />
          <Route path="corporate-solutions" element={<CorporateSolutions userLogged={userLogged} />} />
          <Route path="user-guide" element={<UserGuide userLogged={userLogged} />} />
          <Route path="support-center" element={<SupportCenter />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          {/* Module alias routes - redirect cleanly to /modules */}
          <Route path="employee-dashboard" element={<Navigate to="/modules" replace />} />
          <Route path="appraisal-management" element={<Navigate to="/modules" replace />} />
          <Route path="leave-management" element={<Navigate to="/modules" replace />} />
          <Route path="hr-analytics" element={<Navigate to="/modules" replace />} />
        </Route>

        {/* Redirect for /hr360 base */}
        <Route
          path="/hr360"
          element={
            <Navigate
              to={
                !userLogged
                  ? "/login"
                  : userLogged.user_role === 0
                  ? "/hr360/admin"
                  : "/hr360/user"
              }
              replace
            />
          }
        />

        {/* Login */}
        <Route path="/login" element={<Login userLoggedIn={userLoggedIn} />} />

        {/* Admin Routes */}
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
          <Route path="forms" element={<Forms />} />
          <Route path="add-form" element={<AddForm />} />
          <Route path="edit-form/:formId" element={<AddForm />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="update-employee/:id" element={<UpdateEmployee />} />
          <Route path="employees" element={<Employees />} />
          <Route path="leave-types" element={<LeaveTypes />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payslip" element={<SalaryPayslip />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile-changepassword" element={<ProfileChangePassword />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/hr360/user/*"
          element={
            <ProtectedRoute userLogged={userLogged} allowedRoles={["user", "manager", "ceo"]}>
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
          <Route path="leaves" element={<Leaves />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payslip" element={<SalaryPayslip />} />
          <Route path="form-submission/:id" element={<EmployeeFormDetail />} />
          <Route path="raise-custom-form/:formId" element={<RaiseCustomForm />} />
          <Route path="raise-appraisal" element={<RaiseAppraisal />} />
          <Route path="raise-dfi" element={<RaiseDFI />} />
          <Route path="raise-kpi" element={<RaiseKPI />} />
          <Route path="dfis" element={<DFISubmissions />} />
          <Route path="kpis" element={<KPISubmissions />} />
          <Route path="appraisals" element={<AppraisalSubmissions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile-changepassword" element={<ProfileChangePassword />} />
        </Route>

        {/* Manager Routes */}
        <Route
          path="/hr360/manager/*"
          element={
            <ProtectedRoute userLogged={userLogged} allowedRoles={["manager", "ceo"]}>
              <Layout userLogged={userLogged} userLoggedOut={userLoggedOut} />
            </ProtectedRoute>
          }
        >
          {/* Default user landing page */}
          <Route
            index
            element={<Navigate to="form-requests" replace />}
          />
          <Route path="form-requests" element={<FormRequests />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payslip" element={<SalaryPayslip />} />
          <Route path="form-requests/:id" element={<EmployeeFormDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile-changepassword" element={<ProfileChangePassword />} />
        </Route>

        {/* Catch-all: redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;