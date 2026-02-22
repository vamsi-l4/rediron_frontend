/**
 * ============================================
 * RECOMMENDATION PANEL COMPONENT
 * ============================================
 * Displays AI-generated recommendations based on performance
 */

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/PerformanceLab.css';

const recommendationIcons = {
  'Strength': '💪',
  'Frequency': '📅',
  'Nutrition': '🍽️',
  'Recovery': '😴',
  'Body Composition': '📏',
};

const priorityColors = {
  'high': '#ef4444',
  'medium': '#f97316',
  'low': '#10b981',
};

export const RecommendationPanel = ({ 
  recommendations = [],
  loading = false,
  error = null 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div className="recommendation-panel recommendation-loading">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-panel recommendation-error">
        <p>Failed to load recommendations</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendation-panel recommendation-empty">
        <p>No recommendations yet. Continue logging workouts!</p>
      </div>
    );
  }

  return (
    <motion.div
      className="recommendation-panel"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="panel-title">💡 Recommendations</h3>

      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            className="recommendation-item"
            variants={itemVariants}
            style={{
              borderLeft: `4px solid ${priorityColors[rec.priority] || '#6b7280'}`
            }}
          >
            <div className="rec-header">
              <span className="rec-icon">
                {recommendationIcons[rec.type] || '📌'}
              </span>
              <h4 className="rec-type">{rec.type}</h4>
              <span 
                className="rec-priority"
                style={{ 
                  backgroundColor: priorityColors[rec.priority] || '#6b7280',
                  opacity: 0.2 
                }}
              >
                {rec.priority}
              </span>
            </div>

            <p className="rec-message">{rec.message}</p>

            {rec.article_category && (
              <div className="rec-action">
                <button className="btn-recommendation">
                  Learn More →
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendationPanel;
