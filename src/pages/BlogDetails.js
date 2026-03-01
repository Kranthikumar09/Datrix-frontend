import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config/config';

const IMAGE_BASE_URL = 'https://express.studytraveler.com/uploads/blogs';

const BlogDetails = () => {
  const [blogDetails, setBlogDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${config.baseURL}/blogs/details/get`, {
        params: { blog_slug: slug },
      });

      if (response.data.success) {
        setBlogDetails(response.data.data);
      } else {
        setError('Blog not found.');
      }
    } catch (err) {
      console.error('Error fetching blog details:', err);
      setError('Failed to load blog details. Please try again later.');
      toast.error('Failed to load blog details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [slug]);

  // Update document title and meta tags dynamically
  useEffect(() => {
    if (blogDetails) {
      document.title = blogDetails.meta_title;
      const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = blogDetails.meta_description;
      if (!metaDescription.parentNode) document.head.appendChild(metaDescription);

      const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
      metaKeywords.name = 'keywords';
      metaKeywords.content = blogDetails.meta_keywords;
      if (!metaKeywords.parentNode) document.head.appendChild(metaKeywords);
    }
  }, [blogDetails]);

  if (loading) {
    return (
      <div className="main-section">
        <div className="container mt-5" role="status">
          <div className="spinner" aria-label="Loading blog details"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-section">
        <div className="container mt-5" role="alert">
          <p>{error}</p>
          <button className="color-btn btn" onClick={fetchBlogDetails}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!blogDetails) {
    return (
      <div className="main-section">
        <div className="container mt-5" role="alert">
          <p>Blog not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-section">
      {/*-------------banner-section-----------------*/}
      <section className="page-banner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="pagebanner-text">
                <h2>{blogDetails.title}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="blog-details-section">
        <div className="container">
          <div className="row main-row">
            <div className="col-12">
              <div className="single-details">
                <img
                  src={`${IMAGE_BASE_URL}/${blogDetails.image}`}
                  alt={blogDetails.title}
                  loading="lazy"
                />
                <p>{blogDetails.short_description}</p>
              </div>
            </div>
          </div>
          <div className="row inner-row">
            <div className="col-12">
              <div className="blog-content">
                <div dangerouslySetInnerHTML={{ __html: blogDetails.content }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;