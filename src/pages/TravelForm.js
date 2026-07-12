import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import RightArrow from "../assets/images/right-arrow.svg";
import travelBannerImage from "../assets/images/sdgf.jpg";
import config from "../config/config";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import PageBanner from "../components/ui/PageBanner";
import AppTextField from "../components/ui/AppTextField";

const phoneFieldSx = (hasError) => ({
  "& .iti": { width: "100%" },
  "& .iti__flag-container": { zIndex: 2 },
  "& input": {
    width: "100%",
    minHeight: 56,
    borderRadius: 1,
    border: "1px solid",
    borderColor: hasError ? "error.main" : "divider",
    px: 1.5,
    fontFamily: "inherit",
    fontSize: "1rem",
    bgcolor: "background.paper",
    outline: "none",
    boxSizing: "border-box",
    "&:focus": {
      borderColor: hasError ? "error.main" : "primary.main",
    },
  },
});

const TravelForm = () => {
  const snackbar = useAppSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    interestedCountry: [],
    passengers: "",
    dateRange: { from: null, to: null },
    phoneNumber: "",
    email: "",
    description: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    interestedCountry: "",
    passengers: "",
    dateRange: "",
    phoneNumber: "",
    email: "",
    description: "",
    honeypot: "",
  });

  const [countries, setCountries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState({ countries: false });
  const [selectedCountryCode, setSelectedCountryCode] = useState("in");
  const phoneInputRef = useRef(null);
  const itiRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, countries: true }));
      const response = await axios.get(`${config.baseURL}/countries/get`);
      if (response.data.success) setCountries(response.data.data);
    } catch (error) {
      snackbar.error(`Error fetching countries: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }));
    }
  }, [snackbar]);

  useEffect(() => {
    fetchData();

    const input = phoneInputRef.current;
    if (input) {
      const iti = intlTelInput(input, {
        initialCountry: selectedCountryCode,
        separateDialCode: true,
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
      itiRef.current = iti;
      input.addEventListener("countrychange", () => {
        setSelectedCountryCode(iti.getSelectedCountryData().iso2);
      });
      return () => iti.destroy();
    }
    // selectedCountryCode is only used for initialCountry on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const countryOptions = useMemo(
    () =>
      countries
        .map((country) => ({ value: country.nicename, label: country.nicename }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [countries]
  );

  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) error = "Please enter your name";
      else if (value.length < 2 || value.length > 50)
        error = "Name must be between 2 and 50 characters";
    } else if (name === "interestedCountry" && value.length === 0) {
      error = "Please select at least one country";
    } else if (name === "passengers") {
      if (!value || !/^\d+$/.test(value)) error = "Please enter a valid number";
      else if (+value < 1 || +value > 50) error = "Passengers must be between 1 and 50";
    } else if (name === "dateRange") {
      if (!value.from || !value.to) error = "Please select both start and end dates";
      else if (dayjs(value.to).isBefore(dayjs(value.from), "day"))
        error = "End date cannot be before start date";
    } else if (name === "phoneNumber") {
      if (!value || !/^\d{6,15}$/.test(value))
        error = "Please enter a valid phone number (6-15 digits)";
    } else if (name === "email") {
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Please enter a valid email address";
    } else if (name === "description" && value.length > 500) {
      error = "Description cannot exceed 500 characters";
    } else if (name === "honeypot" && value) {
      error = "Bot detected";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, []);

  const handleCountryChange = useCallback(
    (_event, selected) => {
      const selectedValues = selected ? selected.map((option) => option.value) : [];
      if (selectedValues.length > 3) {
        snackbar.error("You can select up to 3 countries only.");
        return;
      }
      setFormData((prev) => ({ ...prev, interestedCountry: selectedValues }));
      validateField("interestedCountry", selectedValues);
    },
    [snackbar]
  );

  const resetForm = () => {
    setFormData({
      name: "",
      interestedCountry: [],
      passengers: "",
      dateRange: { from: null, to: null },
      phoneNumber: "",
      email: "",
      description: "",
      honeypot: "",
    });
    setErrors({
      name: "",
      interestedCountry: "",
      passengers: "",
      dateRange: "",
      phoneNumber: "",
      email: "",
      description: "",
      honeypot: "",
    });
    setSelectedCountryCode("in");
    if (phoneInputRef.current && itiRef.current) {
      itiRef.current.setCountry("in");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      name: validateField("name", formData.name),
      interestedCountry: validateField("interestedCountry", formData.interestedCountry),
      passengers: validateField("passengers", formData.passengers),
      dateRange: validateField("dateRange", formData.dateRange),
      phoneNumber: validateField("phoneNumber", formData.phoneNumber),
      email: validateField("email", formData.email),
      description: validateField("description", formData.description),
      honeypot: validateField("honeypot", formData.honeypot),
    };

    if (formData.honeypot) {
      snackbar.error("Bot submission detected.");
      return;
    }

    const hasErrors = Object.values(nextErrors).some((error) => error);
    if (hasErrors || formData.interestedCountry.length === 0) {
      snackbar.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    const phoneData = itiRef.current?.getSelectedCountryData();
    const phoneCode = phoneData ? `+${phoneData.dialCode}` : "+91";

    const fromDate = formData.dateRange.from;
    const toDate = formData.dateRange.to;
    // Preserve API expectation: inclusive day count from native Date millisecond math
    const fromMs = fromDate ? dayjs(fromDate).toDate().getTime() : null;
    const toMs = toDate ? dayjs(toDate).toDate().getTime() : null;
    const numberOfDays =
      fromMs != null && toMs != null
        ? Math.ceil((toMs - fromMs) / (1000 * 60 * 60 * 24)) + 1
        : 0;

    const payload = {
      name: formData.name,
      phone_code: phoneCode,
      phone_number: formData.phoneNumber,
      interested_country: formData.interestedCountry.join(","),
      number_of_passengers: parseInt(formData.passengers, 10),
      number_of_days: numberOfDays,
      email: formData.email,
      description: formData.description,
    };

    try {
      const response = await axios.post(
        `${config.baseURL}/travel-requests/submit`,
        payload
      );
      if (response.data.success) {
        snackbar.success("Travel request submitted successfully! 🎉");
        resetForm();
      } else {
        snackbar.error(
          response.data.message || "Submission failed. Check your details."
        );
      }
    } catch (error) {
      snackbar.error(
        `Submission failed: ${error.response?.data?.message || "Try again later."}`
      );
      console.log("Error details:", error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCountryOptions = countryOptions.filter((option) =>
    formData.interestedCountry.includes(option.value)
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="main">
        <PageBanner
          title="Plan Your Trip"
          subtitle="Let us help you plan your perfect travel experience. Share your details below!"
        />

        <Box component="section" sx={{ pb: { xs: 6, md: 12.5 }, pt: 2 }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                bgcolor: "rgba(226, 64, 60, 0.05)",
                p: 1.25,
                borderRadius: 2.5,
                minHeight: 250,
              }}
            >
              <Grid container spacing={0}>
                <Grid size={{ xs: 12, lg: 5 }}>
                  <Box
                    component="img"
                    src={travelBannerImage}
                    alt="Travel Visual"
                    sx={{
                      width: "100%",
                      height: "100%",
                      minHeight: { xs: 220, lg: "100%" },
                      objectFit: "cover",
                      borderRadius: 2.5,
                      display: "block",
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, lg: 7 }}>
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ p: { xs: 2, md: 4 } }}
                  >
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                          id="name"
                          label="Name *"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., John Doe"
                          fullWidth
                          error={Boolean(errors.name)}
                          helperText={errors.name || " "}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Autocomplete
                          id="interestedCountries"
                          multiple
                          options={countryOptions}
                          value={selectedCountryOptions}
                          onChange={handleCountryChange}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                          loading={loading.countries}
                          disableCloseOnSelect
                          noOptionsText="No countries found"
                          ListboxProps={{ style: { maxHeight: 200 } }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Interested Countries *"
                              placeholder="Select up to 3 countries..."
                              error={Boolean(errors.interestedCountry)}
                              helperText={errors.interestedCountry || " "}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                          id="passengers"
                          label="No. of Passengers *"
                          name="passengers"
                          type="number"
                          value={formData.passengers}
                          onChange={handleChange}
                          placeholder="e.g., 2"
                          fullWidth
                          inputProps={{ min: 1, max: 50 }}
                          error={Boolean(errors.passengers)}
                          helperText={errors.passengers || " "}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={1.5}>
                          <Grid size={6}>
                            <DatePicker
                              label="Start date *"
                              value={formData.dateRange.from}
                              minDate={dayjs()}
                              onChange={(newValue) => {
                                const next = {
                                  from: newValue,
                                  to: formData.dateRange.to,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  dateRange: next,
                                }));
                                validateField("dateRange", next);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: Boolean(errors.dateRange),
                                  helperText: errors.dateRange ? " " : " ",
                                },
                                field: { clearable: true },
                              }}
                            />
                          </Grid>
                          <Grid size={6}>
                            <DatePicker
                              label="End date *"
                              value={formData.dateRange.to}
                              minDate={formData.dateRange.from || dayjs()}
                              onChange={(newValue) => {
                                const next = {
                                  from: formData.dateRange.from,
                                  to: newValue,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  dateRange: next,
                                }));
                                validateField("dateRange", next);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: Boolean(errors.dateRange),
                                  helperText: errors.dateRange || " ",
                                },
                                field: { clearable: true },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl
                          fullWidth
                          error={Boolean(errors.phoneNumber)}
                          className="phone-group"
                        >
                          <FormLabel
                            htmlFor="phoneNumber"
                            sx={{ mb: 1, fontWeight: 600 }}
                          >
                            Phone Number *
                          </FormLabel>
                          <Box sx={phoneFieldSx(Boolean(errors.phoneNumber))}>
                            <input
                              id="phoneNumber"
                              type="tel"
                              ref={phoneInputRef}
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={(e) => {
                                const rawNumber = e.target.value.replace(/\D/g, "");
                                setFormData((prev) => ({
                                  ...prev,
                                  phoneNumber: rawNumber,
                                }));
                                validateField("phoneNumber", rawNumber);
                              }}
                              placeholder="e.g., 1234567890"
                            />
                          </Box>
                          <FormHelperText>
                            {errors.phoneNumber || " "}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                          id="email"
                          label="Email *"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g., your.email@example.com"
                          fullWidth
                          error={Boolean(errors.email)}
                          helperText={errors.email || " "}
                        />
                      </Grid>

                      <Grid size={12}>
                        <AppTextField
                          id="description"
                          label="Description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Any special requests or description? (Optional, max 500 characters)"
                          fullWidth
                          multiline
                          rows={5}
                          inputProps={{ maxLength: 500 }}
                          error={Boolean(errors.description)}
                          helperText={
                            errors.description ||
                            `${formData.description.length}/500 characters`
                          }
                        />
                      </Grid>

                      {/* Honeypot */}
                      <Box sx={{ display: "none" }} aria-hidden="true">
                        <label htmlFor="honeypot">Website</label>
                        <input
                          id="honeypot"
                          type="text"
                          name="honeypot"
                          value={formData.honeypot}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </Box>

                      <Grid size={12}>
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting || loading.countries}
                            endIcon={
                              isSubmitting ? (
                                <CircularProgress size={18} color="inherit" />
                              ) : (
                                <Box
                                  component="img"
                                  src={RightArrow}
                                  alt=""
                                  sx={{ width: 16, height: 16 }}
                                />
                              )
                            }
                            sx={{
                              borderRadius: 50,
                              px: 4.5,
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: "none",
                            }}
                          >
                            {isSubmitting ? "Sending..." : "Submit Request"}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default TravelForm;
