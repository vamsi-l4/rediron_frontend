/**
 * ============================================
 * PROGRESS CHART COMPONENT
 * ============================================
 * Reusable chart component using Recharts
 * Displays trends and progress over time
 */

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import '../styles/PerformanceLab.css';

export const ProgressChart = ({
  title,
  data = [],
  type = 'line', // 'line', 'area', 'bar'
  dataKey = 'value',
  xAxisKey = 'date',
  color = '#dc2626',
  height = 300,
  showLegend = true,
  showGrid = true,
  smooth = true,
  loading = false,
}) => {
  const chartVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  if (loading) {
    return (
      <motion.div
        className="chart-container chart-loading"
        variants={chartVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="chart-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
      </motion.div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        className="chart-container chart-empty"
        variants={chartVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="chart-empty-state">
          <p>No data available yet</p>
        </div>
      </motion.div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="value" style={{ color }}>
            {`${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
            <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Area
              type={smooth ? 'monotone' : 'monotone'}
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.1}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
            <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
            <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Line
              type={smooth ? 'monotone' : 'linear'}
              dataKey={dataKey}
              stroke={color}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      className="chart-container"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
    >
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProgressChart;
