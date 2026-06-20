import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import "./ArticlesLanding.css";

export default function ArticlesLanding() {
  const navigate = useNavigate();

  return (
    <>
      <div className="articles-landing" style={{ backgroundColor: "#000000", minHeight: "100vh", position: "relative" }}>
        <button className="al-back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
          <ArrowLeft size={24} />
        </button>
        <motion.section
          className="al-hero"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="al-title">Articles</h1>
          <p className="al-subtitle">
            Dive into expert-written content—from smart nutrition to powerful workouts.
          </p>
        </motion.section>

        <div className="al-cards">
          <motion.button
            className="al-card nutrition"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/articles/nutrition")}
          >
            <div className="al-card-glow" />
            <div className="al-card-inner">
              <h2>Nutrition</h2>
              <p>Guides, recipes, supplements & fueling strategies.</p>
              <span className="al-enter">Enter →</span>
            </div>
          </motion.button>

          <motion.button
            className="al-card workouts"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/articles/workouts")}
          >
            <div className="al-card-glow" />
            <div className="al-card-inner">
              <h2>Workouts</h2>
              <p>Programs, exercises, and training blueprints.</p>
              <span className="al-enter">Enter →</span>
            </div>
          </motion.button>
        </div>
      </div>
    </>
  );
}
