/**
 * ============================================
 * PERFORMANCE LAB - API SERVICE LAYER
 * ============================================
 * 
 * Centralized API calls for RedIron Performance Lab
 * Handles authentication via Clerk JWT
 * Optimized for performance with proper error handling
 */

import API from '../components/Api';

const PERFORMANCE_ENDPOINTS = {
  LOG_WORKOUT: '/api/performance/log-workout/',
  LOG_NUTRITION: '/api/performance/log-nutrition/',
  DASHBOARD: '/api/performance/dashboard/',
  RECOMMENDATIONS: '/api/performance/recommendations/',
  OPTIMIZE_WORKOUT: '/api/performance/optimize-workout/',
  USER_GOAL: '/api/performance/user-goal/',
};

export class PerformanceLabAPI {
  /**
   * Log a new workout session with exercises
   */
  static async logWorkout(workoutData) {
    try {
      const response = await API.post(PERFORMANCE_ENDPOINTS.LOG_WORKOUT, {
        date: workoutData.date,
        duration: workoutData.duration,
        exercises: workoutData.exercises || [],
      });
      return response.data;
    } catch (error) {
      console.error('[PerformanceLab] Error logging workout:', error);
      throw error;
    }
  }

  /**
   * Log daily nutrition intake
   */
  static async logNutrition(nutritionData) {
    try {
      const response = await API.post(PERFORMANCE_ENDPOINTS.LOG_NUTRITION, {
        date: nutritionData.date,
        calories: nutritionData.calories || 0,
        protein: nutritionData.protein || 0,
        carbs: nutritionData.carbs || 0,
        fat: nutritionData.fat || 0,
        water: nutritionData.water || 0,
      });
      return response.data;
    } catch (error) {
      console.error('[PerformanceLab] Error logging nutrition:', error);
      throw error;
    }
  }

  /**
   * Fetch comprehensive performance dashboard
   */
  static async getDashboard() {
    try {
      const response = await API.get(PERFORMANCE_ENDPOINTS.DASHBOARD);
      return response.data;
    } catch (error) {
      console.error('[PerformanceLab] Error fetching dashboard:', error);
      throw error;
    }
  }

  /**
   * Get recommendations based on performance
   */
  static async getRecommendations(type = null) {
    try {
      const url = type 
        ? `${PERFORMANCE_ENDPOINTS.RECOMMENDATIONS}?type=${type}`
        : PERFORMANCE_ENDPOINTS.RECOMMENDATIONS;
      
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      console.error('[PerformanceLab] Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Get AI-optimized workout split (optional)
   */
  static async optimizeWorkout(params) {
    try {
      const response = await API.post(PERFORMANCE_ENDPOINTS.OPTIMIZE_WORKOUT, {
        current_strength_level: params.strengthLevel || 'intermediate',
        goal_type: params.goalType || 'muscle_gain',
        available_days: params.availableDays || 4,
        equipment: params.equipment || [],
      });
      return response.data;
    } catch (error) {
      console.error('[PerformanceLab] Error optimizing workout:', error);
      throw error;
    }
  }

  /**
   * Set or get user fitness goal
   */
  static async setUserGoal(goalData) {
    try {
      const response = await API.post(PERFORMANCE_ENDPOINTS.USER_GOAL, {
        goal_type: goalData.goalType,
        target_value: goalData.targetValue || null,
      });
      return response.data;
    } catch (error) {
      console.error('[PerformanceLab] Error setting goal:', error);
      throw error;
    }
  }

  /**
   * Get current user goal
   */
  static async getUserGoal() {
    try {
      const response = await API.get(PERFORMANCE_ENDPOINTS.USER_GOAL);
      return response.data;
    } catch (error) {
      console.error('[PerformanceLab] Error fetching goal:', error);
      return null; // Goal might not be set
    }
  }
}

export default PerformanceLabAPI;
