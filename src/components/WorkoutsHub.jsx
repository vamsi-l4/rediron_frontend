import React from "react";
import { Link } from "react-router-dom";

import "./WorkoutsHub.css";

export default function WorkoutsHub() {
  return (
    <div className="hub-container">
      <header className="hub-hero">
        <h1>Workouts</h1>
        <p>Routines, tips, fitness articles and exercise videos — all in one place.</p>
      </header>

      <div className="hub-grid">
        <Link to="/workouts/routines" className="hub-card hub-card-routine">
          <div className="hub-card-inner">
            <h2>Workout Routines</h2>
            <p>Structured programs for every level — beginner to advanced.</p>
            <span className="hub-cta">Explore routines →</span>
          </div>
        </Link>

        <Link to="/workouts/tips" className="hub-card hub-card-tips">
          <div className="hub-card-inner">
            <h2>Workout Tips</h2>
            <p>Short, practical tips to improve form, recovery and progress.</p>
            <span className="hub-cta">Read tips →</span>
          </div>
        </Link>

        <Link to="/workouts/fitness" className="hub-card hub-card-fitness">
          <div className="hub-card-inner">
            <h2>Fitness</h2>
            <p>Fitness articles covering training, programming and general health.</p>
            <span className="hub-cta">See fitness articles →</span>
          </div>
        </Link>

        <Link to="/workouts/exercises" className="hub-card hub-card-exercises">
          <div className="hub-card-inner">
            <h2>Exercise Videos</h2>
            <p>Browse exercises with video demos, filters and quick previews.</p>
            <span className="hub-cta">Browse exercises →</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
