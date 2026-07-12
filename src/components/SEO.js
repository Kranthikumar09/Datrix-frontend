// src/components/SEO.js
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BRAND } from "../config/brand";
import config from "../config/config";

const SEO = () => {
  const location = useLocation();
  const pageKey = location.pathname === "/" ? "home" : location.pathname.slice(1);

  const [seoData, setSeoData] = useState({
    title: BRAND.defaultTitle,
    description: BRAND.defaultDescription,
    keywords: BRAND.keywords,
    image: config.siteUrl("/og-image.jpg"),
    url: config.siteUrl(location.pathname),
  });

  useEffect(() => {
    setSeoData((prev) => ({
      ...prev,
      image: config.siteUrl("/og-image.jpg"),
      url: config.siteUrl(location.pathname),
    }));
  }, [location.pathname]);

  useEffect(() => {
    const fetchSEOData = async () => {
      if (!config.baseURL) {
        return;
      }

      try {
        const response = await fetch(`${config.baseURL}/site-content/page-seo-content/get`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ page_key: pageKey }),
        });

        const data = await response.json();

        if (data.success && data.data) {
          setSeoData((prev) => ({
            ...prev,
            title: `${data.data.title} | ${BRAND.name}`,
            description: data.data.description,
            keywords: data.data.keywords,
          }));
        }
      } catch (error) {
        console.debug("SEO fetch failed:", error.message);
      }
    };

    fetchSEOData();
  }, [pageKey]);

  useEffect(() => {
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

    setMeta("description", seoData.description);
    setMeta("keywords", seoData.keywords);

    setOG("og:title", seoData.title);
    setOG("og:description", seoData.description);
    setOG("og:image", seoData.image);
    setOG("og:url", seoData.url);
    setOG("og:type", "website");
    setOG("og:site_name", BRAND.name);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seoData.title);
    setMeta("twitter:description", seoData.description);
    setMeta("twitter:image", seoData.image);
  }, [seoData]);

  return null;
};

export default SEO;
