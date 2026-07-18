import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import PageBanner from "../components/ui/PageBanner";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import config from "../config/config";

const Blog = () => {
  const snackbar = useAppSnackbar();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${config.baseURL}/blogs/get`, {
        page: page.toString(),
        per_page: "20",
      });

      if (response.data.success) {
        setBlogs(response.data.data || []);
        setTotalPages(response.data.pagination?.total_pages || 1);
      } else {
        setError("No blogs found.");
        setBlogs([]);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
      snackbar.error("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when page changes
  }, [page]);

  const handlePageChange = (_event, newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Box component="main">
      <PageBanner
        title="Blogs"
        subtitle="Explore expert insights, tips, and guides on studying, working, and immigrating abroad to achieve your international dreams in 2025 and beyond."
      />

      <Box component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor: "background.soft" }}>
        <Container maxWidth="lg">
          {loading ? (
            <LoadingState label="Loading blogs..." height={200} />
          ) : error ? (
            <ErrorState title="Unable to load blogs" message={error} onRetry={fetchBlogs} />
          ) : !blogs.length ? (
            <EmptyState title="No blogs found" message="Check back soon for new articles." />
          ) : (
            <>
              <Grid container spacing={3}>
                {blogs.map((blog) => (
                  <Grid key={blog.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardActionArea
                        component={RouterLink}
                        to={`/blog-details/${blog.slug}`}
                        sx={{ flexGrow: 1, alignItems: "stretch", display: "flex", flexDirection: "column" }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={`${config.assetUrl("uploads/blogs")}/${blog.image}`}
                          alt={blog.title}
                          loading="lazy"
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              color: "secondary.main",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            <Link component="span" underline="hover" color="inherit">
                              {blog.title}
                            </Link>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {(blog.short_description || "").substring(0, 100)}
                            {(blog.short_description || "").length > 100 ? "..." : ""}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    aria-label="Blog pagination"
                  />
                </Box>
              ) : null}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Blog;
