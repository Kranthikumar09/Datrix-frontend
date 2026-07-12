import React from "react";
import SignupForm from "./SignupForm";
import AuthLayout from "./AuthLayout";

const Signup = () => (
  <AuthLayout
    title="Create an Account"
    backTo="/"
    backLabel="Back to Home"
    showSideImages
    formColumns={{ xs: 12, lg: 6 }}
  >
    <SignupForm redirect="/application-form" />
  </AuthLayout>
);

export default Signup;
