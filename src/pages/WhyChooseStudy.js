import React from "react";
import { BRAND } from "../config/brand";
import WhyChooseLayout from "../components/browse/WhyChooseLayout";
import ChooseLeft from "../assets/images/why-choose-stydy-top.jpg";
import TF1 from "../assets/images/tf1.svg";
import TF2 from "../assets/images/tf2.svg";
import TF3 from "../assets/images/tf3.svg";
import TF4 from "../assets/images/tf4.svg";

const FEATURES = [
  { icon: TF1, title: "Access to world-class education" },
  { icon: TF2, title: "Broaden your global perspective" },
  { icon: TF3, title: "Build international connections" },
  { icon: TF4, title: "Unlock career opportunities" },
];

const WhyChooseStudy = () => (
  <WhyChooseLayout
    bannerTitle={`Why Choose Study Abroad with ${BRAND.name}?`}
    bannerSubtitle="Experience transformative global education with trusted mentors, personalized programs, and end-to-end support."
    heroImage={ChooseLeft}
    heroImageAlt="Study abroad"
    introTitle="Discover, Learn & Grow with the Leaders in Global Education"
    introBody="Expand your horizons, gain international exposure, and access top universities worldwide with our expert-led support system."
    ctaTo="/study"
    featuresTitle="How Studying Abroad Can Shape Your Future"
    featuresSubtitle="Gain global skills, competitive career advantages, and life-changing experiences that accelerate your personal and professional growth."
    features={FEATURES}
    statsTitle={`Find study programs abroad with ${BRAND.name} Study Hub`}
    stats={[
      { value: "50,000+", label: "Courses available" },
      { value: "10,000+", label: "Partner institutions" },
    ]}
  />
);

export default WhyChooseStudy;
