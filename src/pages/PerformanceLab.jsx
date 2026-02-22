/**
 * ============================================
 * PERFORMANCE LAB - MAIN PAGE
 * ============================================
 * RedIron Performance Lab Dashboard
 * 
 * Features:
 * - Comprehensive fitness analytics
 * - Workout logging
 * - Nutrition tracking
 * - Performance recommendations
 * - AI-powered workout optimization (optional)
 */

import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { motion } from 'framer-motion';
import 'react-tabs/style/react-tabs.css';

import PerformanceLabAPI from '../lib/performanceLabAPI';
import StatsCard from '../components/StatsCard';
import ProgressChart from '../components/ProgressChart';
import WorkoutLogger from '../components/WorkoutLogger';
import NutritionLogger from '../components/NutritionLogger';
import RecommendationPanel from '../components/RecommendationPanel';

import '../styles/PerformanceLab.css';

export const PerformanceLabPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboard();
  }, [refreshTrigger]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PerformanceLabAPI.getDashboard();
      setDashboard(data);
      
      // Extract recommendations
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogSuccess = () => {
    // Trigger data refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  if (error && !dashboard) {
    return (
      <motion.div
        className="performance-lab-page"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button onClick={fetchDashboard} className="btn-primary">
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="performance-lab-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="performance-lab-header">
        <h1 className="page-title">🏋️ RedIron Performance Lab</h1>
        <p className="page-subtitle">
          Track your fitness progress, analyze performance, and optimize your training
        </p>
      </div>

      {/* Dashboard Section */}
      {!loading && dashboard && (
        <motion.div
          className="dashboard-section"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="section-title">Performance Overview</h2>

          {/* Stats Grid */}
          <div className="stats-grid">
            {/* Strength Score */}
            <StatsCard
              title="Strength Score"
              value={dashboard.strength_score?.overall_score?.toFixed(1) || 0}
              unit="/100"
              level={dashboard.strength_score?.level || 'N/A'}
              icon="💪"
              color="primary"
            />

            {/* Weekly Volume */}
            <StatsCard
              title="Weekly Volume"
              value={dashboard.weekly_volume?.total_volume?.toFixed(0) || 0}
              unit="kg"
              trend={dashboard.weekly_volume?.session_count || 0}
              icon="📊"
              color="secondary"
            />

            {/* Body Weight Trend */}
            <StatsCard
              title="Body Weight"
              value={dashboard.body_metrics_trend?.current_weight?.toFixed(1) || 0}
              unit="kg"
              trend={dashboard.body_metrics_trend?.weekly_change || 0}
              icon="⚖️"
              color="accent"
            />

            {/* Calorie Balance */}
            <StatsCard
              title="Calorie Balance"
              value={dashboard.calorie_balance?.balance?.toFixed(0) || 0}
              unit="kcal"
              level={dashboard.calorie_balance?.goal_status || 'N/A'}
              icon="🍽️"
              color="tertiary"
            />

            {/* Training Streak */}
            <StatsCard
              title="Training Streak"
              value={dashboard.training_streak?.current_streak || 0}
              unit="days"
              trend={dashboard.training_streak?.longest_streak || 0}
              icon="🔥"
              color="primary"
            />
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <div className="chart-item">
              <ProgressChart
                title="Weekly Volume Trend"
                data={[
                  { date: 'Mon', value: 1000 },
                  { date: 'Tue', value: 1200 },
                  { date: 'Wed', value: 1500 },
                  { date: 'Thu', value: 1300 },
                  { date: 'Fri', value: 1100 },
                ]}
                type="area"
                dataKey="value"
                xAxisKey="date"
                color="#dc2626"
              />
            </div>

            <div className="chart-item">
              <ProgressChart
                title="Bodyweight Progress"
                data={[
                  { date: 'Week 1', value: dashboard.body_metrics_trend?.current_weight || 80 },
                  { date: 'Week 2', value: (dashboard.body_metrics_trend?.current_weight || 80) - 0.5 },
                  { date: 'Week 3', value: (dashboard.body_metrics_trend?.current_weight || 80) - 1 },
                  { date: 'Week 4', value: (dashboard.body_metrics_trend?.current_weight || 80) - 0.8 },
                ]}
                type="line"
                dataKey="value"
                xAxisKey="date"
                color="#10b981"
              />
            </div>
          </div>

          {/* Recommendations Panel */}
          <RecommendationPanel
            recommendations={recommendations}
            loading={loading}
          />
        </motion.div>
      )}

      {/* Tabs Section */}
      <motion.div
        className="tabs-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList className="tabs-list">
            <Tab className="tab-button">📝 Log Workout</Tab>
            <Tab className="tab-button">🍽️ Log Nutrition</Tab>
            <Tab className="tab-button">⚙️ Settings</Tab>
          </TabList>

          {/* Workout Logging Tab */}
          <TabPanel>
            <div className="tab-content">
              <WorkoutLogger onSuccess={handleLogSuccess} />
            </div>
          </TabPanel>

          {/* Nutrition Logging Tab */}
          <TabPanel>
            <div className="tab-content">
              <NutritionLogger onSuccess={handleLogSuccess} />
            </div>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel>
            <div className="tab-content settings-tab">
              <h3>Settings & Goals</h3>
              <div className="settings-card">
                <h4>Fitness Goal</h4>
                <p>Set your primary fitness goal to get personalized recommendations</p>
                {/* Goal selection would go here */}
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your performance data...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PerformanceLabPage;
