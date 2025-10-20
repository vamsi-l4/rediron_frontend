import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./WorkoutCard.css";

export default function WorkoutCard({ workout }) {
  const img = workout.featured_image || workout.image || "/img/default-workout.jpg";
  const groups = (workout.muscle_groups || []).map((m) => m.name).join(", ");
  const when = workout.created_at ? new Date(workout.created_at).toLocaleDateString() : "";

  return (
    <motion.div
      className="workout-card"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 150, damping: 14 }}
      layout
    >
      <Link to={`/workout/${workout.slug}`}>
        <div className="wc-media">
          <img src={img} alt={workout.title} />
          {workout.difficulty && <span className={`wc-diff ${workout.difficulty}`}>{workout.difficulty}</span>}
          {workout.duration_minutes && <span className="wc-duration">{workout.duration_minutes} min</span>}
        </div>
        <div className="wc-body">
          {when && <p className="wc-date">{when}</p>}
          <h3 className="wc-title">{workout.title}</h3>
          {groups && <p className="wc-groups">{groups}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
