import React from "react";
import { BRAND } from "../config/brand";
import WhyChooseLayout from "../components/browse/WhyChooseLayout";
import ChooseLeftWork from "../assets/images/choose-left-work.png";
import CW1 from "../assets/images/choose-work1.svg";
import CW2 from "../assets/images/choose-work2.svg";
import CW3 from "../assets/images/choose-work3.svg";
import CW4 from "../assets/images/choose-work4.svg";

const FEATURES = [
  { icon: CW1, title: "High paying jobs" },
  { icon: CW2, title: "Quality of life" },
  { icon: CW3, title: "Migrate with family" },
  { icon: CW4, title: "Healthcare & Safety" },
];

const WhyChooseWork = () => (
  <WhyChooseLayout
    bannerTitle="Why Choose Work"
    bannerSubtitle="Unlock global career pathways with expert job search, visa assistance, and skill-mapping guidance."
    heroImage={ChooseLeftWork}
    heroImageAlt="Work abroad"
    introTitle="Find and get a job abroad with the world leaders in overseas careers"
    introBody="Dreaming of an international career? Get expert job-search support, resume optimization, visa guidance, and global placement assistance. We help you navigate the complex international job market to land high-paying roles that match your skills and aspirations."
    ctaTo="/work"
    featuresTitle="How can working abroad change your life?"
    featuresSubtitle="Gain international exposure, access higher earning potential, and experience a superior quality of life while building a global network."
    features={FEATURES}
    statsTitle={`Find a job abroad with ${BRAND.name} JobSite`}
    stats={[
      { value: "50,000+", label: "Jobs available" },
      { value: "10,000+", label: "Employers" },
    ]}
  />
);

export default WhyChooseWork;
