import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bell, Copy, Droplets, Flame, Gauge, Sparkles } from "lucide-react";

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

export function MarkdownLite({ text }) {
  if (!text) return null;
  const lines = String(text).split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return (
    <div className="markdown-lite">
      {lines.map((line, index) => {
        const clean = line
          .replace(/^#{1,6}\s*/, "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/^\*\s*/, "")
          .replace(/^\d+\.\s*/, "");
        if (/^[-•]/.test(line) || /^\*\s/.test(line) || /^\d+\./.test(line)) {
          return <p className="markdown-bullet" key={index}>{clean}</p>;
        }
        if (line.startsWith("###") || line.startsWith("##") || line.startsWith("#")) {
          return <h3 key={index}>{clean}</h3>;
        }
        return <p key={index}>{clean}</p>;
      })}
    </div>
  );
}

export function PlanResult({ plan, compact = false }) {
  if (!plan?.response_json) return null;
  const data = plan.response_json;
  return (
    <div className={`coach-card plan-result${compact ? " compact-result" : ""}`}>
      <div className="result-top">
        <div>
          <span className="coach-pill">{plan.plan_type}</span>
          <h2>{plan.title}</h2>
        </div>
        <div className="result-actions">
          <button
            type="button"
            onClick={(event) => {
              const button = event.currentTarget;
              navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
              if (button?.dataset) button.dataset.copied = "true";
              setTimeout(() => {
                if (button?.dataset) button.dataset.copied = "false";
              }, 1400);
            }}
          >
            <Copy size={15} />
            <span className="copy-label">Copy</span>
            <span className="copied-label">Copied</span>
          </button>
        </div>
      </div>
      {data.summary && <MarkdownLite text={data.summary} />}
      {data.answer && <MarkdownLite text={data.answer} />}
      {Array.isArray(data.daily_workouts) && (
        <div className="workout-days">
          {data.daily_workouts.map((day) => (
            <article key={day.day} className="mini-panel">
              <h3>{day.day}</h3>
              <p>{day.focus}</p>
              {(day.exercises || []).map((exercise) => {
                const content = (
                  <>
                    <span>{exercise.name}</span>
                    <small>{exercise.sets} sets · {exercise.reps} · {exercise.rest}</small>
                  </>
                );
                return exercise.exercise_url ? (
                  <Link key={`${day.day}-${exercise.name}`} to={exercise.exercise_url} className="exercise-row">
                    {content}
                  </Link>
                ) : (
                  <div key={`${day.day}-${exercise.name}`} className="exercise-row">
                    {content}
                  </div>
                );
              })}
            </article>
          ))}
        </div>
      )}
      {data.timeline && (
        <div className="recommendation-list">
          {(data.timeline || []).map((item, index) => <div key={index} className="recommendation-item"><span>{item}</span></div>)}
        </div>
      )}
      {data.weekly_goals && (
        <div className="recommendation-list">
          {(data.weekly_goals || []).map((item, index) => <div key={index} className="recommendation-item"><span>{item}</span></div>)}
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
  const progress = dashboard?.progress_summary || {};
  return (
    <div className="today-strip">
      <MetricCard icon={Flame} label="Calories" value={today.calories || "--"} detail={today.calories ? "daily target from profile" : "finish setup"} />
      <MetricCard icon={Gauge} label="Protein" value={today.protein ? `${today.protein}g` : "--"} detail={today.protein ? "daily target from weight" : "finish setup"} />
      <MetricCard icon={Droplets} label="Hydration" value={today.water || "--"} detail={today.water ? "minimum daily target" : "finish setup"} />
      <MetricCard icon={Bell} label="Today" value={today.workout || "Plan now"} detail={`${progress.completed_workouts || 0} workouts logged`} />
    </div>
  );
}
