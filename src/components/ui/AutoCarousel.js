import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { prefersReducedMotion } from "../../utils/prefersReducedMotion";

/**
 * Lightweight MUI carousel (no react-slick).
 * Supports autoplay, responsive slidesToShow, and optional arrows.
 */
const AutoCarousel = ({
  items = [],
  getKey,
  renderItem,
  slidesToShow = 1,
  autoplay = false,
  autoplaySpeed = 3000,
  arrows = false,
  infinite = true,
  onIndexChange,
  ariaLabel = "Carousel",
  sx,
}) => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const [index, setIndex] = useState(0);

  const visibleCount = useMemo(() => {
    if (typeof slidesToShow === "number") {
      if (isSmDown) return Math.min(slidesToShow, 2, items.length || 1);
      if (isMdDown) return Math.min(slidesToShow, 3, items.length || 1);
      return Math.min(slidesToShow, items.length || 1);
    }
    return 1;
  }, [slidesToShow, isMdDown, isSmDown, items.length]);

  const maxIndex = Math.max(0, items.length - visibleCount);
  const canLoop = infinite && items.length > visibleCount;

  const goTo = (next) => {
    if (!items.length) return;
    let resolved = next;
    if (canLoop) {
      if (next < 0) resolved = maxIndex;
      else if (next > maxIndex) resolved = 0;
    } else {
      resolved = Math.min(Math.max(next, 0), maxIndex);
    }
    setIndex(resolved);
    onIndexChange?.(resolved);
  };

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (!autoplay || items.length <= visibleCount || prefersReducedMotion()) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => {
        const next = current >= maxIndex ? 0 : current + 1;
        onIndexChange?.(next);
        return next;
      });
    }, autoplaySpeed);
    return () => window.clearInterval(timer);
  }, [autoplay, autoplaySpeed, items.length, visibleCount, maxIndex, onIndexChange]);

  if (!items.length) return null;

  const itemWidth = `${100 / visibleCount}%`;

  return (
    <Box sx={{ position: "relative", ...sx }} role="region" aria-label={ariaLabel}>
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            transform: `translateX(-${index * (100 / visibleCount)}%)`,
            transition: prefersReducedMotion() ? "none" : "transform 0.45s ease",
          }}
        >
          {items.map((item, itemIndex) => (
            <Box
              key={getKey ? getKey(item, itemIndex) : itemIndex}
              sx={{
                flex: `0 0 ${itemWidth}`,
                maxWidth: itemWidth,
                boxSizing: "border-box",
                px: 1,
              }}
            >
              {renderItem(item, itemIndex)}
            </Box>
          ))}
        </Box>
      </Box>

      {arrows && items.length > visibleCount ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "flex-end", mt: 2 }}
        >
          <IconButton
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
            size="small"
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      ) : null}
    </Box>
  );
};

export default AutoCarousel;
