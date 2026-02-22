/**
 * ============================================
 * NUTRITION LOGGER COMPONENT
 * ============================================
 * Allows users to log their daily nutrition intake
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PerformanceLabAPI from '../lib/performanceLabAPI';
import '../styles/PerformanceLab.css';

export const NutritionLogger = ({ onSuccess = () => {} }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Quick presets for common goals
  const presets = {
    muscleGain: { calories: 2500, protein: 200, carbs: 300, fat: 84, water: 3.5 },
    fatLoss: { calories: 1800, protein: 165, carbs: 180, fat: 60, water: 3.5 },
    maintenance: { calories: 2000, protein: 160, carbs: 200, fat: 67, water: 3.0 },
  };

  const applyPreset = (preset) => {
    setNutrition({ ...nutrition, ...presets[preset] });
  };

  const handleChange = (field, value) => {
    setNutrition({ ...nutrition, [field]: parseFloat(value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    setLoading(true);
    try {
      await PerformanceLabAPI.logNutrition({
        date,
        ...nutrition
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log nutrition');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Calculate macro percentages
  const totalCalories = nutrition.calories || 1;
  const proteinCal = nutrition.protein * 4;
  const carbsCal = nutrition.carbs * 4;
  const fatCal = nutrition.fat * 9;

  const proteinPercent = ((proteinCal / totalCalories) * 100).toFixed(1);
  const carbsPercent = ((carbsCal / totalCalories) * 100).toFixed(1);
  const fatPercent = ((fatCal / totalCalories) * 100).toFixed(1);

  return (
    <motion.div
      className="nutrition-logger-container"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="form-title">Log Nutrition</h3>

      <form onSubmit={handleSubmit} className="nutrition-form">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Presets */}
        <div className="presets-section">
          <label>Quick Presets</label>
          <div className="presets-grid">
            <button
              type="button"
              onClick={() => applyPreset('muscleGain')}
              className="preset-btn"
            >
              💪 Muscle Gain
            </button>
            <button
              type="button"
              onClick={() => applyPreset('fatLoss')}
              className="preset-btn"
            >
              🔥 Fat Loss
            </button>
            <button
              type="button"
              onClick={() => applyPreset('maintenance')}
              className="preset-btn"
            >
              ⚖️ Maintenance
            </button>
          </div>
        </div>

        {/* Nutrition Inputs */}
        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="calories">Calories</label>
            <input
              id="calories"
              type="number"
              min="0"
              value={nutrition.calories}
              onChange={(e) => handleChange('calories', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="protein">Protein (g)</label>
            <input
              id="protein"
              type="number"
              min="0"
              step="0.5"
              value={nutrition.protein}
              onChange={(e) => handleChange('protein', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="carbs">Carbs (g)</label>
            <input
              id="carbs"
              type="number"
              min="0"
              step="0.5"
              value={nutrition.carbs}
              onChange={(e) => handleChange('carbs', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fat">Fat (g)</label>
            <input
              id="fat"
              type="number"
              min="0"
              step="0.5"
              value={nutrition.fat}
              onChange={(e) => handleChange('fat', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="water">Water (L)</label>
            <input
              id="water"
              type="number"
              min="0"
              step="0.1"
              value={nutrition.water}
              onChange={(e) => handleChange('water', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Macro Breakdown */}
        {nutrition.calories > 0 && (
          <div className="macro-breakdown">
            <h4>Macro Breakdown</h4>
            <div className="macro-bars">
              <div className="macro-bar">
                <div className="macro-label">Protein</div>
                <div className="macro-progress">
                  <div
                    className="macro-fill macro-protein"
                    style={{ width: `${Math.min(proteinPercent, 100)}%` }}
                  ></div>
                </div>
                <div className="macro-value">{proteinPercent}%</div>
              </div>

              <div className="macro-bar">
                <div className="macro-label">Carbs</div>
                <div className="macro-progress">
                  <div
                    className="macro-fill macro-carbs"
                    style={{ width: `${Math.min(carbsPercent, 100)}%` }}
                  ></div>
                </div>
                <div className="macro-value">{carbsPercent}%</div>
              </div>

              <div className="macro-bar">
                <div className="macro-label">Fat</div>
                <div className="macro-progress">
                  <div
                    className="macro-fill macro-fat"
                    style={{ width: `${Math.min(fatPercent, 100)}%` }}
                  ></div>
                </div>
                <div className="macro-value">{fatPercent}%</div>
              </div>
            </div>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ Nutrition logged successfully!</div>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary btn-submit"
        >
          {loading ? 'Logging...' : 'Log Nutrition'}
        </button>
      </form>
    </motion.div>
  );
};

export default NutritionLogger;
