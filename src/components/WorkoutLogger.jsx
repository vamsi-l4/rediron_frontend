/**
 * ============================================
 * WORKOUT LOGGER COMPONENT
 * ============================================
 * Allows users to log their workout sessions
 * with multiple exercises
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PerformanceLabAPI from '../lib/performanceLabAPI';
import '../styles/PerformanceLab.css';

export const WorkoutLogger = ({ onSuccess = () => {} }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('60');
  const [exercises, setExercises] = useState([
    { exercise_name: '', sets: 3, reps: 10, weight: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === 'exercise_name' ? value : parseFloat(value) || value
    };
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { exercise_name: '', sets: 3, reps: 10, weight: 0 }
    ]);
  };

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate
    if (!date || !duration || !exercises.some(ex => ex.exercise_name)) {
      setError('Please fill in the required fields');
      return;
    }

    setLoading(true);
    try {
      await PerformanceLabAPI.logWorkout({
        date,
        duration: parseInt(duration),
        exercises: exercises.filter(ex => ex.exercise_name)
      });

      setSuccess(true);
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setDuration('60');
      setExercises([{ exercise_name: '', sets: 3, reps: 10, weight: 0 }]);
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="workout-logger-container"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="form-title">Log Workout</h3>

      <form onSubmit={handleSubmit} className="workout-form">
        <div className="form-grid-2">
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

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="exercises-section">
          <h4>Exercises</h4>
          <div className="exercises-list">
            {exercises.map((exercise, index) => (
              <motion.div
                key={index}
                className="exercise-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="form-grid-4">
                  <div className="form-group">
                    <label>Exercise Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Bench Press"
                      value={exercise.exercise_name}
                      onChange={(e) => handleExerciseChange(index, 'exercise_name', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Sets</label>
                    <input
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Reps</label>
                    <input
                      type="number"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={addExercise}
            className="btn-secondary"
          >
            + Add Exercise
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ Workout logged successfully!</div>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary btn-submit"
        >
          {loading ? 'Logging...' : 'Log Workout'}
        </button>
      </form>
    </motion.div>
  );
};

export default WorkoutLogger;
