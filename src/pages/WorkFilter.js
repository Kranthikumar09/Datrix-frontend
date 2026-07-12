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

const parseSkills = (skills) => {
  if (!skills) return "N/A";
  try {
    let parsed = skills;
    while (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
  } catch (error) {
    console.error("Error parsing skills:", error);
    return skills || "N/A";
  }
};

const WorkFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const initialFilters = {
    titles: queryParams.get("title") ? [queryParams.get("title")] : [],
    skills: queryParams.get("skill") ? [queryParams.get("skill")] : [],
    locations: queryParams.get("location") ? [queryParams.get("location")] : [],
    company: queryParams.get("company") || "",
    country: queryParams.get("country") || "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [titles, setTitles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [locations, setLocations] = useState([]);
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
        const [titlesRes, skillsRes, locationsRes] = await Promise.all([
          axios.get(`${config.baseURL}/jobs/titles/get`),
          axios.get(`${config.baseURL}/jobs/skills/get`),
          axios.get(`${config.baseURL}/jobs/locations/get`),
        ]);

        setTitles(
          Array.isArray(titlesRes.data.data)
            ? titlesRes.data.data.map((item) => item?.title).filter(Boolean)
            : []
        );
        setSkills(
          Array.isArray(skillsRes.data.data)
            ? skillsRes.data.data.map((item) => item?.skill).filter(Boolean)
            : []
        );
        setLocations(
          Array.isArray(locationsRes.data.data)
            ? locationsRes.data.data.map((item) => item?.location).filter(Boolean)
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

  const fetchJobs = useCallback(
    debounce(async (page = 1, appliedFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        const requestBody = {
          titles: appliedFilters.titles.length > 0 ? appliedFilters.titles : [],
          skills: appliedFilters.skills.length > 0 ? appliedFilters.skills : [],
          locations: appliedFilters.locations.length > 0 ? appliedFilters.locations : [],
          company: appliedFilters.company.trim() || "",
          country: appliedFilters.country.trim() || "",
          page: page.toString(),
          per_page: pagination.per_page.toString(),
        };

        const response = await axios.post(`${config.baseURL}/jobs/get`, requestBody, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          setJobs(response.data.data);
          setPagination({
            current_page: parseInt(response.data.pagination?.current_page, 10) || page,
            per_page: parseInt(response.data.pagination?.per_page, 10) || pagination.per_page,
            total_items: parseInt(response.data.pagination?.total_items, 10) || response.data.data.length,
            total_pages: parseInt(response.data.pagination?.total_pages, 10) || 1,
            next_page: response.data.pagination?.next_page || null,
          });
        } else {
          setJobs([]);
          setPagination((prev) => ({ ...prev, current_page: page, total_items: 0, total_pages: 0, next_page: null }));
        }
      } catch (fetchError) {
        console.error("Error fetching jobs:", fetchError);
        setError("Failed to load jobs. Please try again.");
        setJobs([]);
        setPagination((prev) => ({ ...prev, current_page: page, total_items: 0, total_pages: 0, next_page: null }));
      } finally {
        setLoading(false);
      }
    }, 300),
    [pagination.per_page]
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.titles.length > 0) params.set("title", filters.titles[0]);
    if (filters.skills.length > 0) params.set("skill", filters.skills[0]);
    if (filters.locations.length > 0) params.set("location", filters.locations[0]);
    if (filters.company) params.set("company", filters.company);
    if (filters.country) params.set("country", filters.country);

    const queryString = params.toString();
    if (queryString !== location.search.slice(1)) {
      navigate({ search: queryString }, { replace: true });
    }

    fetchJobs(1, filters);
  }, [filters, fetchJobs, navigate, location.search]);

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
    fetchJobs(1, filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      titles: [],
      skills: [],
      locations: [],
      company: "",
      country: "",
    };
    setFilters(resetFilters);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    navigate("/work-filter", { replace: true });
  };

  const handlePageChange = (_event, page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchJobs(page, filters);
    }
  };

  const filterGroups = [
    { key: "titles", title: "Job Titles", options: titles },
    { key: "skills", title: "Skills", options: skills },
    { key: "locations", title: "Locations", options: locations },
  ];

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <BrowseBreadcrumbs
          items={[
            { label: "Work", to: "/work" },
            { label: "Jobs" },
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
                        label="Search by Company"
                        name="company"
                        value={filters.company}
                        onChange={handleFilterInputChange}
                        placeholder="Company name"
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
              {pagination.total_items} job opportunities found
            </Typography>

            {loading ? (
              <LoadingState label="Loading jobs..." />
            ) : error ? (
              <ErrorState title="Unable to load jobs" message={error} onRetry={() => fetchJobs(1, filters)} />
            ) : jobs.length === 0 ? (
              <EmptyState
                title="No jobs found"
                message="No job opportunities match your current filters."
                actionLabel="Clear all filters"
                onAction={handleResetFilters}
              />
            ) : (
              <Stack spacing={2}>
                {jobs.map((job) => (
                  <Card key={job.id} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardActionArea component={RouterLink} to={`/job-details/${job.id || ""}`}>
                      <CardContent>
                        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1, gap: 2 }}>
                          <Typography variant="h6" fontWeight={700}>
                            {job.title || "Untitled Job"} at {job.company_name || "Unknown Company"}
                          </Typography>
                          <Chip size="small" label={job.employment_type || "N/A"} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          {job.location || "N/A"}, {job.country || "N/A"}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip size="small" variant="outlined" label={`Skills: ${parseSkills(job.skills)}`} />
                          <Chip size="small" variant="outlined" label={`Experience: ${job.experience_string || "N/A"}`} />
                          <Chip size="small" variant="outlined" label={`Qualification: ${job.qualifications || "N/A"}`} />
                          <Chip size="small" variant="outlined" label={`Specialization: ${job.specialization || "N/A"}`} />
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            )}

            {pagination.total_pages > 1 && !loading && jobs.length > 0 ? (
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

export default WorkFilter;
