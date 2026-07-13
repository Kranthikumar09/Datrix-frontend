import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import config from "../config/config";
import BrowseBreadcrumbs from "../components/ui/BrowseBreadcrumbs";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { parseEligibilities } from "../utils/parseEligibilities";
import LeftImage from "../assets/images/un.png";

const DetailField = ({ label, value, children }) => (
  <Paper variant="outlined" sx={{ p: 2, height: "100%", borderRadius: 2 }}>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
      {label}
    </Typography>
    {children || (
      <Typography variant="body1" fontWeight={500}>
        {value || "Not specified"}
      </Typography>
    )}
  </Paper>
);

const StudyDetails = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${config.baseURL}/courses/details/get`, {
          params: { course_id: courseId },
        });

        if (response.data.success) {
          setCourseData(response.data.data);
        } else {
          setError("Failed to fetch course details.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <LoadingState label="Loading course details..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <ErrorState title="Unable to load course" message={error} />
      </Container>
    );
  }

  if (!courseData) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <EmptyState title="Course not found" message="The requested course could not be found." />
      </Container>
    );
  }

  const {
    name,
    specialization,
    level,
    credit_hours,
    duration,
    description,
    fees,
    eligibilities,
    university,
  } = courseData;

  const eligibilityData = parseEligibilities(eligibilities);
  const imageSrc = university?.image
    ? config.assetUrl(`uploads/universities/${university.image}`)
    : LeftImage;

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <BrowseBreadcrumbs
          items={[
            { label: "Study", to: "/study" },
            { label: "Courses", to: "/study-filter" },
            { label: name },
          ]}
        />

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                component="img"
                src={imageSrc}
                alt={university?.name || "Course"}
                onError={(e) => { e.currentTarget.src = LeftImage; }}
                sx={{ width: "100%", borderRadius: 2, display: "block" }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 1 }}>
                {name}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {university?.name} — {university?.location}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Established</Typography>
                  <Typography fontWeight={600}>{university?.established || "N/A"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Type of Institute</Typography>
                  <Typography fontWeight={600}>{university?.type || "N/A"}</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Institute Details
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailField label="Acceptance Rate" value={`${university?.acceptance_rate || "N/A"}%`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailField label="Number of Students" value={university?.number_of_students} />
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Course Overview
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Course" value={name} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Specialization" value={specialization} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Level" value={level} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Duration" value={duration} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Credit Hours" value={credit_hours} /></Grid>
          <Grid size={{ xs: 12 }}>
            <DetailField label="Eligibility Criteria">
              {eligibilityData.length > 0 ? (
                <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2 }}>
                  {eligibilityData.map((eligibility, index) => (
                    <Typography component="li" key={index} variant="body2">
                      {eligibility.name}: {eligibility.score}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2">No eligibility criteria available.</Typography>
              )}
            </DetailField>
          </Grid>
          <Grid size={12}>
            <DetailField label="Course Description" value={description || "No description available."} />
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          Tuition And Payments
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          1st Year Tuition Fees
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fees Components</TableCell>
                <TableCell>Amount in USD ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Tuition & Fees</TableCell>
                <TableCell>{fees}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="subtitle1" fontWeight={600}>
          Other Expenses in 1st year
        </Typography>
      </Container>
    </Box>
  );
};

export default StudyDetails;
