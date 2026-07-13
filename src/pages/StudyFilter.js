import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import debounce from "lodash/debounce";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Pagination from "@mui/material/Pagination";
import config from "../config/config";
import BrowseBreadcrumbs from "../components/ui/BrowseBreadcrumbs";
import FilterSidebar from "../components/ui/FilterSidebar";
import AppTextField from "../components/ui/AppTextField";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { parseEligibilities } from "../utils/parseEligibilities";
import LeftImage from "../assets/images/un.png";

const StudyFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const initialFilters = {
    specializations: queryParams.get("specialization") ? [queryParams.get("specialization")] : [],
    locations: queryParams.get("location") ? [queryParams.get("location")] : [],
    eligibilities: queryParams.get("eligibility") ? [queryParams.get("eligibility")] : [],
    course_name: queryParams.get("course_name") || "",
    country: queryParams.get("country") || "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [eligibilities, setEligibilities] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
    next_page: null,
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const [specializationsRes, locationsRes, eligibilitiesRes] = await Promise.all([
          axios.get(`${config.baseURL}/courses/specializations/get`),
          axios.get(`${config.baseURL}/courses/locations/get`),
          axios.get(`${config.baseURL}/courses/eligiblities/get`),
        ]);

        setSpecializations(
          Array.isArray(specializationsRes.data.data)
            ? specializationsRes.data.data.map((item) => item?.specialization).filter(Boolean)
            : []
        );
        setLocations(
          Array.isArray(locationsRes.data.data)
            ? locationsRes.data.data.map((item) => item?.location).filter(Boolean)
            : []
        );
        setEligibilities(
          Array.isArray(eligibilitiesRes.data.data)
            ? eligibilitiesRes.data.data.map((item) => item?.eligiblity).filter(Boolean)
            : []
        );
      } catch (fetchError) {
        console.error("Error fetching filter options:", fetchError);
        setError("Failed to load filter options. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const fetchCourses = useCallback(
    debounce(async (page = 1, appliedFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        const requestBody = {
          specializations: appliedFilters.specializations.length > 0 ? appliedFilters.specializations : [],
          locations: appliedFilters.locations.length > 0 ? appliedFilters.locations : [],
          eligibilities: appliedFilters.eligibilities.length > 0 ? appliedFilters.eligibilities : [],
          course_name: appliedFilters.course_name.trim() || "",
          country: appliedFilters.country.trim() || "",
          page: page.toString(),
          per_page: pagination.per_page.toString(),
        };

        const response = await axios.post(`${config.baseURL}/courses/get`, requestBody, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
          setPagination({
            current_page: parseInt(response.data.pagination?.current_page, 10) || page,
            per_page: parseInt(response.data.pagination?.per_page, 10) || pagination.per_page,
            total_items: parseInt(response.data.pagination?.total_items, 10) || response.data.data.length,
            total_pages: parseInt(response.data.pagination?.total_pages, 10) || 1,
            next_page: response.data.pagination?.next_page || null,
          });
        } else {
          setCourses([]);
          setPagination((prev) => ({ ...prev, current_page: page, total_items: 0, total_pages: 0, next_page: null }));
        }
      } catch (fetchError) {
        console.error("Error fetching courses:", fetchError);
        setError("Failed to load courses. Please try again.");
        setCourses([]);
        setPagination((prev) => ({ ...prev, current_page: page, total_items: 0, total_pages: 0, next_page: null }));
      } finally {
        setLoading(false);
      }
    }, 300),
    [pagination.per_page]
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.specializations.length > 0) params.set("specialization", filters.specializations[0]);
    if (filters.locations.length > 0) params.set("location", filters.locations[0]);
    if (filters.eligibilities.length > 0) params.set("eligibility", filters.eligibilities[0]);
    if (filters.course_name) params.set("course_name", filters.course_name);
    if (filters.country) params.set("country", filters.country);

    const queryString = params.toString();
    if (queryString !== location.search.slice(1)) {
      navigate({ search: queryString }, { replace: true });
    }

    fetchCourses(1, filters);
  }, [filters, fetchCourses, navigate, location.search]);

  const handleFilterInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => {
      if (type === "checkbox") {
        const updatedArray = checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value);
        return { ...prev, [name]: updatedArray };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchCourses(1, filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      specializations: [],
      locations: [],
      eligibilities: [],
      course_name: "",
      country: "",
    };
    setFilters(resetFilters);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    navigate("/study-filter", { replace: true });
  };

  const handlePageChange = (_event, page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchCourses(page, filters);
    }
  };

  const filterGroups = [
    { key: "specializations", title: "All Specializations", options: specializations },
    { key: "eligibilities", title: "Eligibility", options: eligibilities },
    { key: "locations", title: "Locations", options: locations },
  ];

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <BrowseBreadcrumbs
          items={[
            { label: "Study", to: "/study" },
            { label: "Courses" },
          ]}
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <FilterSidebar
              groups={filterGroups}
              filters={filters}
              onFilterChange={handleFilterInputChange}
              onApply={handleSearch}
              onReset={handleResetFilters}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 9 }}>
            <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Box component="form" onSubmit={handleSearch}>
                  <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <AppTextField
                        label="Search Course"
                        name="course_name"
                        value={filters.course_name}
                        onChange={handleFilterInputChange}
                        placeholder="Course name"
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <AppTextField
                        label="Search Country"
                        name="country"
                        value={filters.country}
                        onChange={handleFilterInputChange}
                        placeholder="Country"
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ minHeight: 48 }}>
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {pagination.total_items} study opportunities found
            </Typography>

            {loading ? (
              <LoadingState label="Loading courses..." />
            ) : error ? (
              <ErrorState title="Unable to load courses" message={error} onRetry={() => fetchCourses(1, filters)} />
            ) : courses.length === 0 ? (
              <EmptyState
                title="No courses found"
                message="No study opportunities match your current filters."
                actionLabel="Clear all filters"
                onAction={handleResetFilters}
              />
            ) : (
              <Stack spacing={2}>
                {courses.map((course) => {
                  const eligibilityItems = parseEligibilities(course.eligibilities);
                  const imageSrc = course.university?.image
                    ? config.assetUrl(`uploads/universities/${course.university.image}`)
                    : LeftImage;

                  return (
                    <Card key={course.id} variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardActionArea component={RouterLink} to={`/study-details/${course.id || ""}`}>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 3 }}>
                              <Box
                                component="img"
                                src={imageSrc}
                                alt={course.university?.name || "Course"}
                                onError={(e) => { e.currentTarget.src = LeftImage; }}
                                sx={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 2 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 9 }}>
                              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                                {course.name || "Untitled Course"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {course.university?.name || "Unknown University"} — {course.university?.location || "Unknown Location"}
                                {course.university?.country ? `, ${course.university.country}` : ""}
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                                <Chip size="small" label={course.specialization || "N/A"} />
                                <Chip size="small" color="primary" variant="outlined" label={course.fees ? `${course.fees} INR/yr` : "Fees N/A"} />
                              </Stack>
                              {eligibilityItems.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                  {eligibilityItems.map((eligibility, index) => (
                                    <Chip
                                      key={`${eligibility.name}-${index}`}
                                      size="small"
                                      variant="outlined"
                                      label={`${eligibility.name || "Eligibility"}: ${eligibility.score || "N/A"}`}
                                    />
                                  ))}
                                </Stack>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  No specific eligibility criteria
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  );
                })}
              </Stack>
            )}

            {pagination.total_pages > 1 && !loading && courses.length > 0 ? (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Pagination
                  count={pagination.total_pages}
                  page={pagination.current_page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudyFilter;
