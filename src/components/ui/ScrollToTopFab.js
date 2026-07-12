import React, { useEffect, useState } from "react";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

/**
 * Floating scroll-to-top control for the application shell.
 */
const ScrollToTopFab = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <Fab
      color="primary"
      size="medium"
      aria-label="Scroll to top of page"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      sx={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 1000,
        boxShadow: "0 6px 12px rgba(0, 4, 24, 0.3)",
      }}
    >
      <KeyboardArrowUpIcon />
    </Fab>
  );
};

export default ScrollToTopFab;
