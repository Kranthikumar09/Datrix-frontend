import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

// Import Auth components
import { AuthProvider, useAuth } from "./context/AuthContext";

// Import theme and shared UI
import theme from "./theme/theme";
import { AppSnackbarProvider } from "./components/ui/AppSnackbar";

// Import components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import SEO from "./components/SEO";

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Study from "./pages/Study";
import StudyDetails from "./pages/StudyDetails";
import StudyFilter from "./pages/StudyFilter";
import WhyChooseStudy from "./pages/WhyChooseStudy";
import Work from "./pages/Work";
import WorkDetails from "./pages/WorkDetails";
import WorkFilter from "./pages/WorkFilter";
import WhyChooseWork from "./pages/WhyChooseWork";
import TermsCondition from "./pages/TermsCondition";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import TravelForm from "./pages/TravelForm";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import VerifyEmail from "./auth/VerifyEmail";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import ApplicationForm from "./userpanelpages/ApplicationForm";
import MyAccount from "./userpanelpages/MyAccount";
import StudyApplications from "./userpanelpages/StudyApplications";
import StudyApplicationsDetails from "./userpanelpages/StudyApplicationsDetails";
import EditStudyApplication from "./userpanelpages/EditStudyApplication";
import WorkApplications from "./userpanelpages/WorkApplications";
import WorkApplicationsDetails from "./userpanelpages/WorkApplicationsDetails";
import EditWorkApplication from "./userpanelpages/EditWorkApplication";
import AppliedJobs from "./userpanelpages/AppliedJobs";
import JobApplyForm from "./userpanelpages/JobApplyForm";
import UploadDocuments from "./userpanelpages/UploadDocuments";
import ScrollToTopFab from "./components/ui/ScrollToTopFab";
import { prefersReducedMotion } from "./utils/prefersReducedMotion";

// Import styles
import "./assets/css/style.css";
import "./assets/css/responsive.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/application-form" state={{ from: location }} replace />;
  }
  return children;
};

// ScrollToTop Component
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [location]);

  return null;
};

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/signup", "/verify", "/forgot-password", "/reset-password"].includes(
    location.pathname
  );

  return (
    <>
      <SEO />
      <ScrollToTop />
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          left: -9999,
          top: 0,
          zIndex: 2000,
          bgcolor: "common.white",
          color: "text.primary",
          px: 2,
          py: 1,
          borderRadius: 1,
          boxShadow: 2,
          textDecoration: "none",
          fontWeight: 600,
          "&:focus": {
            left: 16,
            top: 16,
          },
        }}
      >
        Skip to main content
      </Box>
      {!hideHeaderFooter && <Header />}
      <Box component="div" id="main-content" className="main-content" tabIndex={-1} sx={{ outline: "none" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/verify" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/application-form" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
          <Route path="/study-applications" element={<ProtectedRoute><StudyApplications /></ProtectedRoute>} />
          <Route
            path="/study-application-details/:id"
            element={<ProtectedRoute><StudyApplicationsDetails /></ProtectedRoute>}
          />
          <Route
            path="/edit-study-application/:id"
            element={<ProtectedRoute><EditStudyApplication /></ProtectedRoute>}
          />
          <Route path="/work-applications" element={<ProtectedRoute><WorkApplications /></ProtectedRoute>} />
          <Route
            path="/work-application-details/:id"
            element={<ProtectedRoute><WorkApplicationsDetails /></ProtectedRoute>}
          />
          <Route
            path="/edit-work-application/:id"
            element={<ProtectedRoute><EditWorkApplication /></ProtectedRoute>}
          />
          <Route path="/applied-jobs" element={<ProtectedRoute><AppliedJobs /></ProtectedRoute>} />
          <Route path="/job-apply-form/:jobId" element={<ProtectedRoute><JobApplyForm /></ProtectedRoute>} />
          <Route path="/upload-documents" element={<ProtectedRoute><UploadDocuments /></ProtectedRoute>} />

          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-details/:slug" element={<BlogDetails />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study-details/:courseId" element={<StudyDetails />} />
          <Route path="/study-filter" element={<StudyFilter />} />
          <Route path="/why-choose-study" element={<WhyChooseStudy />} />
          <Route path="/work" element={<Work />} />
          <Route path="/job-details/:id" element={<WorkDetails />} />
          <Route path="/work-filter" element={<WorkFilter />} />
          <Route path="/why-choose-work" element={<WhyChooseWork />} />
          <Route path="/terms-conditions" element={<TermsCondition />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/travel" element={<TravelForm />} />
          {/* Catch-All Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Box>
      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <ScrollToTopFab />}
    </>
  );
}

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <AppSnackbarProvider>
              <Layout />
            </AppSnackbarProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;