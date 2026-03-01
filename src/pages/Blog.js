import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config/config';

const IMAGE_BASE_URL = 'https://express.studytraveler.com/uploads/blogs';

const Blog = () => {
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
        per_page: '20',
      });

      if (response.data.success) {
        setBlogs(response.data.data);
        setTotalPages(response.data.pagination.total_pages || 1);
      } else {
        setError('No blogs found.');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
      toast.error('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPagination = () => {
    const pageItems = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Previous button
    pageItems.push(
      <li key="prev" className={`page-item ${page === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(page - 1)} aria-label="Previous">
          &laquo;
        </button>
      </li>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Next button
    pageItems.push(
      <li key="next" className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(page + 1)} aria-label="Next">
          &raquo;
        </button>
      </li>
    );

    return (
      <nav aria-label="Blog pagination">
        <ul className="pagination justify-content-center mt-4">
          {pageItems}
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="main-section">
        <div className="container mt-5" role="status">
          <div className="spinner" aria-label="Loading blogs"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-section">
        <div className="container mt-5" role="alert">
          <p>{error}</p>
          <button className="color-btn btn" onClick={fetchBlogs}>
            Retry
          </button>
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
                <h1>Blogs</h1>
                <p>
                Explore expert insights, tips, and guides on studying, working, and immigrating abroad to achieve your international dreams in 2025 and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*---------------home-blog-section--------------*/}
      <section className="blog-section p-50 bg-white pt-0">
        <div className="container">
          <div className="row blog-row">
            {blogs.map((blog) => (
              <div className="col-md-4" key={blog.id}>
                <div className="blog-inner">
                  <div className="blod-image">
                    <figure>
                      <img
                        src={`${IMAGE_BASE_URL}/${blog.image}`}
                        alt={blog.title}
                        loading="lazy"
                      />
                    </figure>
                  </div>
                  <div className="blog-data">
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <h3>
                      <Link to={`/blog-details/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h3>
                    <p>{blog.short_description.substring(0, 100)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && renderPagination()}
        </div>
      </section>
    </div>
  );
};

export default Blog;