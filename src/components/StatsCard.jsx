/**
 * ============================================
 * STATS CARD COMPONENT
 * ============================================
 * Reusable card component for displaying performance metrics
 * with animations and responsive design
 */

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/PerformanceLab.css';

export const StatsCard = ({ 
  title, 
  value, 
  unit = '', 
  icon = null,
  level = null,
  trend = null,
  color = 'primary',
  size = 'medium'
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    hover: {
      y: -5,
      boxShadow: '0 20px 40px rgba(220, 38, 38, 0.15)',
      transition: { duration: 0.2 }
    }
  };

  const getLevelColor = (level) => {
    const levelColors = {
      'Beginner': '#f97316',
      'Intermediate': '#3b82f6',
      'Advanced': '#8b5cf6',
      'Elite': '#ec4899',
    };
    return levelColors[level] || '#6b7280';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return '#10b981';
    if (trend < 0) return '#ef4444';
    return '#6b7280';
  };

  return (
    <motion.div
      className={`stats-card stats-card-${size} stats-card-${color}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="stats-card-content">
        <div className="stats-card-header">
          {icon && <div className="stats-card-icon">{icon}</div>}
          <h3 className="stats-card-title">{title}</h3>
        </div>

        <div className="stats-card-main">
          <div className="stats-card-value">
            <span className="value">{value}</span>
            {unit && <span className="unit">{unit}</span>}
          </div>

          {level && (
            <div 
              className="stats-card-level"
              style={{ color: getLevelColor(level) }}
            >
              {level}
            </div>
          )}
        </div>

        {trend !== null && (
          <div className="stats-card-trend" style={{ color: getTrendColor(trend) }}>
            <span className="trend-icon">{getTrendIcon(trend)}</span>
            <span className="trend-value">{Math.abs(trend).toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="stats-card-gradient"></div>
    </motion.div>
  );
};

export default StatsCard;
