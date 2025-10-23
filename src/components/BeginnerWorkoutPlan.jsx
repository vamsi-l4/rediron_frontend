import React, { useState, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaYoutube, FaMagic } from 'react-icons/fa';
import './BeginnerWorkoutPlan.css';

// Dummy data for the workout plan
const workoutData = [
  // Week 1
  { day: 1, title: "Full Body A", week: 1, exercises: [
    { name: "Dumbbell Goblet Squat", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10" },
    { name: "Push-ups", sets: 3, reps: "8-10", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
    { name: "Dumbbell Rows", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=pYj-582319U" },
    { name: "Overhead Press (Dumbbell)", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0" },
    { name: "Plank", sets: 3, reps: "30-45 sec", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU" }
  ]},
  { day: 2, title: "Rest & Active Recovery", week: 1, exercises: [] },
  { day: 3, title: "Full Body B", week: 1, exercises: [
    { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", equipment: "Dumbbells, Bench", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", equipment: "Cable Machine", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k" },
    { name: "Crunches", sets: 3, reps: "15-20", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU" }
  ]},
  { day: 4, title: "Rest & Active Recovery", week: 1, exercises: [] },
  { day: 5, title: "Full Body A", week: 1, exercises: [
    { name: "Dumbbell Goblet Squat", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10" },
    { name: "Push-ups", sets: 3, reps: "8-10", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
    { name: "Dumbbell Rows", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=pYj-582319U" },
    { name: "Overhead Press (Dumbbell)", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0" },
    { name: "Plank", sets: 3, reps: "30-45 sec", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU" }
  ]},
  { day: 6, title: "Cardio & Stretching", week: 1, exercises: [{ name: "30-minute steady cardio", sets: 1, reps: "30 min", equipment: "Treadmill or Bike" }] },
  { day: 7, title: "Rest", week: 1, exercises: [] },
  // Week 2
  { day: 8, title: "Full Body B", week: 2, exercises: [
    { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", equipment: "Dumbbells, Bench", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", equipment: "Cable Machine", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k" },
    { name: "Crunches", sets: 3, reps: "15-20", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU" }
  ]},
  { day: 9, title: "Rest & Active Recovery", week: 2, exercises: [] },
  { day: 10, title: "Full Body A", week: 2, exercises: [
    { name: "Dumbbell Goblet Squat", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10" },
    { name: "Push-ups", sets: 3, reps: "8-10", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
    { name: "Dumbbell Rows", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=pYj-582319U" },
    { name: "Overhead Press (Dumbbell)", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0" },
    { name: "Plank", sets: 3, reps: "30-45 sec", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU" }
  ]},
  { day: 11, title: "Rest & Active Recovery", week: 2, exercises: [] },
  { day: 12, title: "Full Body B", week: 2, exercises: [
    { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", equipment: "Dumbbells, Bench", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", equipment: "Cable Machine", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k" },
    { name: "Crunches", sets: 3, reps: "15-20", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU" }
  ]},
  { day: 13, title: "Cardio & Stretching", week: 2, exercises: [{ name: "45-minute steady cardio", sets: 1, reps: "45 min", equipment: "Treadmill or Bike" }] },
  { day: 14, title: "Rest", week: 2, exercises: [] },
  // Week 3
  { day: 15, title: "Full Body A", week: 3, exercises: [
    { name: "Dumbbell Goblet Squat", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10" },
    { name: "Push-ups", sets: 3, reps: "8-10", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
    { name: "Dumbbell Rows", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=pYj-582319U" },
    { name: "Overhead Press (Dumbbell)", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0" },
    { name: "Plank", sets: 3, reps: "30-45 sec", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU" }
  ]},
  { day: 16, title: "Rest & Active Recovery", week: 3, exercises: [] },
  { day: 17, title: "Full Body B", week: 3, exercises: [
    { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", equipment: "Dumbbells, Bench", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", equipment: "Cable Machine", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k" },
    { name: "Crunches", sets: 3, reps: "15-20", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU" }
  ]},
  { day: 18, title: "Rest & Active Recovery", week: 3, exercises: [] },
  { day: 19, title: "Full Body A", week: 3, exercises: [
    { name: "Dumbbell Goblet Squat", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10" },
    { name: "Push-ups", sets: 3, reps: "8-10", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
    { name: "Dumbbell Rows", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=pYj-582319U" },
    { name: "Overhead Press (Dumbbell)", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0" },
    { name: "Plank", sets: 3, reps: "30-45 sec", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU" }
  ]},
  { day: 20, title: "Cardio & Stretching", week: 3, exercises: [{ name: "30-minute steady cardio", sets: 1, reps: "30 min", equipment: "Treadmill or Bike" }] },
  { day: 21, title: "Rest", week: 3, exercises: [] },
  // Week 4
  { day: 22, title: "Full Body B", week: 4, exercises: [
    { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", equipment: "Dumbbells, Bench", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", equipment: "Cable Machine", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k" },
    { name: "Crunches", sets: 3, reps: "15-20", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU" }
  ]},
  { day: 23, title: "Rest & Active Recovery", week: 4, exercises: [] },
  { day: 24, title: "Full Body A", week: 4, exercises: [
    { name: "Dumbbell Goblet Squat", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10" },
    { name: "Push-ups", sets: 3, reps: "8-10", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
    { name: "Dumbbell Rows", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=pYj-582319U" },
    { name: "Overhead Press (Dumbbell)", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0" },
    { name: "Plank", sets: 3, reps: "30-45 sec", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU" }
  ]},
  { day: 25, title: "Rest & Active Recovery", week: 4, exercises: [] },
  { day: 26, title: "Full Body B", week: 4, exercises: [
    { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", equipment: "Dumbbells, Bench", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", equipment: "Cable Machine", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=0G2fN7fH43o" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k" },
    { name: "Crunches", sets: 3, reps: "15-20", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU" }
  ]},
  { day: 27, title: "Cardio & Stretching", week: 4, exercises: [{ name: "60-minute steady cardio", sets: 1, reps: "60 min", equipment: "Treadmill or Bike" }] },
  { day: 28, title: "Rest", week: 4, exercises: [] },
  { day: 29, title: "Full Body A (Final)", week: 4, exercises: [
    { name: "Dumbbell Goblet Squat", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10" },
    { name: "Push-ups", sets: 3, reps: "8-10", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
    { name: "Dumbbell Rows", sets: 3, reps: "10-12", equipment: "Dumbbell", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=pYj-582319U" },
    { name: "Overhead Press (Dumbbell)", sets: 3, reps: "10-12", equipment: "Dumbbells", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0" },
    { name: "Plank", sets: 3, reps: "30-45 sec", equipment: "No Equipment", imageSrc: "/assets/placeholder.png", videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU" }
  ]},
  { day: 30, title: "Rest & Active Recovery (Final Day!)", week: 4, exercises: [] },
];

const BeginnerWorkoutPlan = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);
  
  const planForToday = workoutData.find(plan => plan.day === currentDay);
  const dayListRef = useRef(null);

  const handleDayChange = (day) => {
    setCurrentDay(day);
    if (dayListRef.current) {
      const dayElement = dayListRef.current.querySelector(`.day-item[data-day='${day}']`);
      if (dayElement) {
        dayListRef.current.scrollTo({
          left: dayElement.offsetLeft - (dayListRef.current.offsetWidth / 2) + (dayElement.offsetWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  };

  const handleDayScroll = (direction) => {
    if (dayListRef.current) {
      const scrollAmount = dayListRef.current.offsetWidth * 0.4;
      const newScroll = dayListRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      dayListRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };
  
  // This is the function that will make the API call to your backend
  const getChatGptExplanation = async (exerciseName) => {
    setExplanationLoading(true);
    setExplanationError(null);
    setCurrentExplanation(null);
    setShowExplanationModal(true);
    
    // In a real application, you'd replace this with a fetch call to your own backend API.
    // The backend would then call the ChatGPT API.
    // Example:
    // const response = await fetch('/api/chatgpt-explain', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ exerciseName })
    // });
    
    // For now, we'll use a dummy response to simulate the behavior.
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dummyResponse = {
        explanation: `ChatGPT explanation for ${exerciseName}: This is a dummy text to show how the feature works. In a real scenario, this text would be a detailed explanation of the exercise, its benefits, and proper form from ChatGPT.`
      };
      
      setCurrentExplanation(dummyResponse.explanation);
    } catch (error) {
      setExplanationError("Failed to fetch explanation. Please try again.");
      console.error("API call failed:", error);
    } finally {
      setExplanationLoading(false);
    }
  };

  return (
    <div className="workout-plan-page">
        <div className="workout-plan-header">
          <div className="workout-overlay">
            <div className="workout-plan-header-content">
              <h1>The Complete 4-Week Beginner's Workout Program</h1>
              <p>
                This plan is designed to help you build muscle and strength with a variety of fundamental exercises.
              </p>
            </div>
          </div>
        </div>

        <div className="workout-plan-container">
          <div className="day-navigation-container">
            <button
              onClick={() => handleDayScroll('left')}
              className="nav-arrow"
            >
              <FaArrowLeft />
            </button>
            <div className="day-list" ref={dayListRef}>
              {workoutData.map((plan) => (
                <button
                  key={plan.day}
                  data-day={plan.day}
                  onClick={() => handleDayChange(plan.day)}
                  className={`day-item ${plan.day === currentDay ? 'active' : ''}`}
                >
                  Day {plan.day}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleDayScroll('right')}
              className="nav-arrow"
            >
              <FaArrowRight />
            </button>
          </div>

          <div className="workout-details-section">
            <div className="workout-summary-card">
              <h2>Day {planForToday.day}: {planForToday.title}</h2>
            </div>

            <div className="exercise-list">
              {planForToday.exercises.length > 0 ? (
                planForToday.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-card">
                    <img src={exercise.imageSrc} alt={exercise.name} className="exercise-image" />
                    <div className="exercise-info">
                      <h3 className="exercise-title">{exercise.name}</h3>
                      <p>
                        <strong>Sets:</strong> {exercise.sets} | <strong>Reps:</strong> {exercise.reps}
                      </p>
                      <p className="exercise-equipment">
                        <strong>Equipment:</strong> {exercise.equipment}
                      </p>
                      <a href={exercise.videoLink} target="_blank" rel="noopener noreferrer" className="video-link">
                        <FaYoutube /> Watch Video
                      </a>
                      <button 
                        className="chatgpt-explain-button" 
                        onClick={() => getChatGptExplanation(exercise.name)}
                      >
                        <FaMagic /> Explain Exercise
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rest-day-card">
                    <p>It's a rest day! Focus on stretching, light cardio, or just recovering. Listen to your body and prepare for your next workout.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Explanation Modal */}
        {showExplanationModal && (
          <div className="explanation-modal-overlay" onClick={() => setShowExplanationModal(false)}>
            <div className="explanation-modal-content" onClick={e => e.stopPropagation()}>
              <h3>ChatGPT Explanation</h3>
              {explanationLoading ? (
                <p>Loading explanation...</p>
              ) : explanationError ? (
                <p className="error-message">{explanationError}</p>
              ) : (
                <p className="explanation-text">{currentExplanation}</p>
              )}
              <button className="modal-close-button" onClick={() => setShowExplanationModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
  );
};

export default BeginnerWorkoutPlan;
