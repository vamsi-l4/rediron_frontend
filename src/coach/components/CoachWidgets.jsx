import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bell, Droplets, Flame, Gauge, Sparkles } from "lucide-react";

export function CoachHeader({ title, kicker, actions }) {
  return (
    <div className="coach-header">
      <div>
        <p>{kicker}</p>
        <h1>{title}</h1>
      </div>
      {actions && <div className="coach-header-actions">{actions}</div>}
    </div>
  );
}

export function MetricCard({ icon: Icon = Gauge, label, value, detail }) {
  return (
    <motion.div className="coach-card metric-card" whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </motion.div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="coach-empty">
      <Sparkles size={26} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className="coach-grid">
      {Array.from({ length: 8 }).map((_, index) => <div className="coach-skeleton" key={index} />)}
    </div>
  );
}

export function PlanResult({ plan, onDuplicate }) {
  if (!plan?.response_json) return null;
  const data = plan.response_json;
  return (
    <div className="coach-card plan-result">
      <div className="result-top">
        <div>
          <span className="coach-pill">{plan.plan_type}</span>
          <h2>{plan.title}</h2>
        </div>
        <div className="result-actions">
          <button type="button" onClick={onDuplicate}>Duplicate</button>
          <button type="button" onClick={() => window.print()}>Export PDF</button>
        </div>
      </div>
      {data.summary && <p className="result-summary">{data.summary}</p>}
      {data.answer && <p className="result-summary">{data.answer}</p>}
      {Array.isArray(data.daily_workouts) && (
        <div className="workout-days">
          {data.daily_workouts.map((day) => (
            <article key={day.day} className="mini-panel">
              <h3>{day.day}</h3>
              <p>{day.focus}</p>
              {(day.exercises || []).map((exercise) => (
                <Link key={`${day.day}-${exercise.name}`} to={exercise.exercise_url || "#"} className="exercise-row">
                  <span>{exercise.name}</span>
                  <small>{exercise.sets} sets · {exercise.reps} · {exercise.rest}</small>
                </Link>
              ))}
            </article>
          ))}
        </div>
      )}
      {Array.isArray(data.meals) && (
        <div className="workout-days">
          {data.meals.map((meal) => (
            <article key={meal.name} className="mini-panel">
              <h3>{meal.name}</h3>
              <p>{meal.time} · {meal.calories} kcal · {meal.protein}g protein</p>
              {(meal.items || []).map((item) => <small key={item}>{item}</small>)}
            </article>
          ))}
        </div>
      )}
      {Array.isArray(data.products) && data.products.length > 0 && (
        <div className="recommendation-list">
          {data.products.map((item) => (
            <Link key={item.id || item.name} to={item.url || item.product_url || "#"} className="recommendation-item">
              <span>{item.name}</span>
              <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      )}
      {Array.isArray(data.equipment) && data.equipment.length > 0 && (
        <div className="recommendation-list">
          {data.equipment.map((item) => (
            <Link key={item.id || item.name} to={item.url || "#"} className="recommendation-item">
              <span>{item.name}</span>
              <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function TodayStrip({ dashboard }) {
  const today = dashboard?.today || {};
  return (
    <div className="today-strip">
      <MetricCard icon={Flame} label="Calories" value={today.calories || "--"} detail="daily target" />
      <MetricCard icon={Gauge} label="Protein" value={`${today.protein || "--"}g`} detail="planned intake" />
      <MetricCard icon={Droplets} label="Water" value={today.water || "--"} detail="hydration" />
      <MetricCard icon={Bell} label="Workout" value={today.workout || "Plan now"} detail="today" />
    </div>
  );
}

