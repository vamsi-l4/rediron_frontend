import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import "./WorkoutsHub.css";

export default function WorkoutsHub() {
  const navigate = useNavigate();
  return (
    <div className="hub-container" style={{ position: "relative" }}>
      <style>{`
        .shared-back-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08);
          color: #FFFFFF; cursor: pointer; position: absolute; top: 20px; left: 20px; z-index: 100;
          transition: all 0.3s ease;
        }
        .shared-back-btn:hover {
          background: #b20d23; border-color: #b20d23; transform: translateX(-4px);
        }
        @media (max-width: 768px) {
          .shared-back-btn { display: none; }
        }
      `}</style>
      <button className="shared-back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
        <ArrowLeft size={24} />
      </button>
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
