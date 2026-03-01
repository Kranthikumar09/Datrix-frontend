// src/components/SEO.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SEO = () => {
  const location = useLocation();
  const pageKey = location.pathname === "/" ? "home" : location.pathname.slice(1);

  const [seoData, setSeoData] = useState({
    title: "Study Traveler",
    description: "Study Traveler – Your gateway to study and work abroad.",
    keywords: "study abroad, work abroad, international education",
    image: "https://studytraveler.com/og-image.jpg",
    url: "https://studytraveler.com" + location.pathname
  });

  const baseUrl = process.env.REACT_APP_API_BASE_URL || "https://express.studytraveler.com/backend/api";

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        const response = await fetch(`${baseUrl}/site-content/page-seo-content/get`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ page_key: pageKey }),
        });

        const data = await response.json();

        if (data.success && data.data) {
          setSeoData((prev) => ({
            ...prev,
            title: `${data.data.title} | Study Traveler`,
            description: data.data.description,
            keywords: data.data.keywords,
          }));
        }
      } catch (error) {
        console.debug("SEO fetch failed:", error.message);
      }
    };

    fetchSEOData();
  }, [pageKey, baseUrl]);

  useEffect(() => {
    // Update Title
    document.title = seoData.title;

    const setMeta = (name, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setOG = (property, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Standard Meta
    setMeta("description", seoData.description);
    setMeta("keywords", seoData.keywords);

    // OPEN GRAPH META
    setOG("og:title", seoData.title);
    setOG("og:description", seoData.description);
    setOG("og:image", seoData.image);
    setOG("og:url", seoData.url);
    setOG("og:type", "website");

    // TWITTER META
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seoData.title);
    setMeta("twitter:description", seoData.description);
    setMeta("twitter:image", seoData.image);

  }, [seoData]);

  return null;
};

export default SEO;
