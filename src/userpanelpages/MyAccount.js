import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../context/AuthContext";
import config from "../config/config";
import profileimg from "../assets/images/user.png";
import ProtectedPageLayout from "../components/layout/ProtectedPageLayout";
import LoadingState from "../components/ui/LoadingState";
import AppTextField from "../components/ui/AppTextField";
import AppPhoneField from "../components/ui/AppPhoneField";
import FileUploadField from "../components/ui/FileUploadField";
import { useAppSnackbar } from "../components/ui/AppSnackbar";

const MyAccount = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const snackbar = useAppSnackbar();

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    highestEducation: "",
    preferredCountry: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState(profileimg);
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const phoneInputRef = useRef(null);

  const createAuthAxios = () => {
    const token = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !userData?.id || !isAuthenticated) {
      snackbar.error("Please log in to continue.");
      logout();
      navigate("/login");
      throw new Error("Authentication credentials not found");
    }

    return {
      instance: axios.create({
        baseURL: config.baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
      userId: userData.id,
    };
  };

  const fetchInitialData = async () => {
    if (!isAuthenticated) {
      snackbar.error("Please log in to access this page.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { instance, userId } = createAuthAxios();
      const userResponse = await instance.post("/user/details/get", { user_id: userId });
      const userDataFromApi = userResponse.data.data;

      setProfileData({
        fullName: userDataFromApi.name || "",
        email: userDataFromApi.email || "",
        phone: `${userDataFromApi.phone_code || ""}${userDataFromApi.phone_number || ""}`,
        highestEducation: userDataFromApi.education || "",
        preferredCountry: userDataFromApi.country || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsSocialLogin(
        userDataFromApi.auth_provider &&
          ["google", "facebook"].includes(userDataFromApi.auth_provider.toLowerCase())
      );

      if (userDataFromApi.image) {
        setProfileImage(config.assetUrl(`uploads/users/${userDataFromApi.image}`));
      } else {
        setProfileImage(profileimg);
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError(err.message || "Failed to load profile data");
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        snackbar.error(err.message || "Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      snackbar.error("Image must be less than 5MB");
      return;
    }

    try {
      const localImageUrl = URL.createObjectURL(file);
      setProfileImage(localImageUrl);

      const { instance, userId } = createAuthAxios();
      const formData = new FormData();
      formData.append("image", file);

      const uploadInstance = axios.create({
        baseURL: config.baseURL,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadResponse = await uploadInstance.post("/user/details/upload-image", formData);

      if (uploadResponse.data.success) {
        const updatedUserResponse = await instance.post("/user/details/get", { user_id: userId });

        if (updatedUserResponse.data.success && updatedUserResponse.data.data.image) {
          const newImageUrl = config.assetUrl(`uploads/users/${updatedUserResponse.data.data.image}`);
          setProfileImage(newImageUrl);
          URL.revokeObjectURL(localImageUrl);
          snackbar.success("Profile image uploaded successfully");
        } else {
          throw new Error("Failed to retrieve updated image data");
        }
      } else {
        setProfileImage(profileimg);
        throw new Error(uploadResponse.data.message || "Image upload failed");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setProfileImage(profileimg);
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        snackbar.error(err.response?.data?.message || "Failed to upload image");
      }
    }
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, logout]);

  useEffect(() => {
    if (!loading && phoneInputRef.current && profileData.phone) {
      phoneInputRef.current.setNumber(profileData.phone);
    }
  }, [loading, profileData.phone]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const errors = {};

    if (!profileData.fullName.trim()) {
      errors.fullName = "Please enter your full name";
    }
    if (!phoneInputRef.current || !phoneInputRef.current.isValidNumber()) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!isSocialLogin && (profileData.newPassword || profileData.confirmPassword || profileData.currentPassword)) {
      if (!profileData.currentPassword) {
        errors.currentPassword = "Please enter your current password";
      }
      if (!profileData.newPassword) {
        errors.newPassword = "Please enter a new password";
      } else if (profileData.newPassword.length < 8) {
        errors.newPassword = "Password must be at least 8 characters";
      }
      if (!profileData.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
      } else if (profileData.newPassword !== profileData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const inputElement = document.getElementById(firstErrorField);
      if (inputElement) inputElement.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      snackbar.error("Please log in to update your profile.");
      logout();
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setValidationErrors({});

    try {
      const { instance } = createAuthAxios();

      const selected = phoneInputRef.current.getSelectedCountryData();
      const phoneCode = selected?.dialCode ? `+${selected.dialCode}` : "";
      const fullNumber = phoneInputRef.current.getNumber();
      const phoneNumber = fullNumber.replace(phoneCode, "");

      const updatePayload = {
        name: profileData.fullName,
        email: profileData.email,
        phone_code: phoneCode,
        phone_number: phoneNumber,
        education: profileData.highestEducation,
        country: profileData.preferredCountry,
        password: "",
      };

      const isPasswordUpdate = !isSocialLogin && profileData.newPassword && profileData.confirmPassword;
      if (isPasswordUpdate) {
        updatePayload.current_password = profileData.currentPassword;
        updatePayload.new_password = profileData.newPassword;
        updatePayload.password = profileData.newPassword;
      }

      const response = await instance.post("/user/details/update", updatePayload);

      if (response.data.success) {
        const successMessage = isPasswordUpdate
          ? "Password updated successfully"
          : response.data.message || "Profile updated successfully";
        snackbar.success(successMessage);

        setProfileData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        await fetchInitialData();
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);

      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const newValidationErrors = {};

        apiErrors.forEach((apiError) => {
          let field = apiError.path;
          if (field === "name") field = "fullName";
          else if (field === "education") field = "highestEducation";
          else if (field === "country") field = "preferredCountry";
          else if (["phone_code", "phone_number"].includes(field)) field = "phone";
          else if (field === "email") return;
          else if (field === "current_password") field = "currentPassword";
          else if (["new_password", "password"].includes(field)) field = "newPassword";
          newValidationErrors[field] = apiError.msg;
        });

        setValidationErrors(newValidationErrors);

        const firstErrorField = Object.keys(newValidationErrors)[0];
        if (firstErrorField) {
          const inputElement = document.getElementById(firstErrorField);
          if (inputElement) inputElement.focus();
        }

        snackbar.error("Please correct the errors in the form.");
      } else {
        snackbar.error(err.response?.data?.message || err.message || "Failed to update profile");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const passwordAdornment = (field) => (
    <InputAdornment position="end">
      <IconButton
        aria-label={showPasswords[field] ? "Hide password" : "Show password"}
        onClick={() => togglePasswordVisibility(field)}
        edge="end"
        disabled={submitting}
      >
        {showPasswords[field] ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  if (loading) {
    return (
      <ProtectedPageLayout fullName={profileData.fullName} userId={userId}>
        <LoadingState label="Loading profile..." height={240} />
      </ProtectedPageLayout>
    );
  }

  if (error) {
    return (
      <ProtectedPageLayout fullName={profileData.fullName} userId={userId}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchInitialData}>
              Try Again
            </Button>
          }
        >
          <Typography fontWeight={700}>Error loading profile</Typography>
          {error}
        </Alert>
      </ProtectedPageLayout>
    );
  }

  return (
    <ProtectedPageLayout fullName={profileData.fullName} userId={userId} title="Profile Details">
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
          <Avatar
            src={profileImage}
            alt="Profile"
            onError={() => setProfileImage(profileimg)}
            sx={{ width: 96, height: 96 }}
          />
          <Box sx={{ flex: 1, maxWidth: 420 }}>
            <FileUploadField
              id="profile-image"
              label="Upload profile photo"
              accept="image/*"
              helperText="Choose a photo (JPG, PNG, max 5MB)"
              disabled={submitting}
              onChange={handleImageUpload}
            />
          </Box>
        </Stack>

        <Alert severity="info" icon={false}>
          {profileData.email} (Cannot be changed)
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Account Details
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <AppTextField
                id="fullName"
                name="fullName"
                label="Full Name *"
                value={profileData.fullName}
                onChange={handleInputChange}
                error={validationErrors.fullName}
                helperText={validationErrors.fullName || " "}
                inputProps={{ maxLength: 65 }}
                disabled={submitting}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <AppPhoneField
                id="phone"
                label="Phone Number *"
                ref={phoneInputRef}
                defaultCountry="us"
                error={Boolean(validationErrors.phone)}
                helperText={validationErrors.phone || " "}
                disabled={submitting}
              />
            </Grid>

            {isSocialLogin ? (
              <Grid size={12}>
                <Alert severity="info">
                  You registered with a social account (Google or Facebook). You can only sign in using your
                  social provider. Password management is not available.
                </Alert>
              </Grid>
            ) : (
              <>
                <Grid size={12}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Password Management (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Leave blank to keep your current password
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <AppTextField
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    type={showPasswords.currentPassword ? "text" : "password"}
                    value={profileData.currentPassword}
                    onChange={handleInputChange}
                    error={validationErrors.currentPassword}
                    helperText={validationErrors.currentPassword || " "}
                    disabled={submitting}
                    fullWidth
                    InputProps={{ endAdornment: passwordAdornment("currentPassword") }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <AppTextField
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    type={showPasswords.newPassword ? "text" : "password"}
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                    error={validationErrors.newPassword}
                    helperText={validationErrors.newPassword || " "}
                    disabled={submitting}
                    fullWidth
                    InputProps={{ endAdornment: passwordAdornment("newPassword") }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <AppTextField
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    error={validationErrors.confirmPassword}
                    helperText={validationErrors.confirmPassword || " "}
                    disabled={submitting}
                    fullWidth
                    InputProps={{ endAdornment: passwordAdornment("confirmPassword") }}
                  />
                </Grid>
              </>
            )}

            <Grid size={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600, px: 4, py: 1.25 }}
              >
                {submitting ? "Updating..." : "Update Account"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </ProtectedPageLayout>
  );
};

export default MyAccount;
