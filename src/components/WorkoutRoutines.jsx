import React, { useEffect, useState, useCallback } from "react";
import API from "./Api";

import "./WorkoutRoutines.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ✅ import images from src/assets
import absIcon from "../assets/abs.png";
import armsIcon from "../assets/arms.png";
import legsIcon from "../assets/legs.png";
import backIcon from "../assets/back.png";
import shouldersIcon from "../assets/shoulders.png";
import chestIcon from "../assets/chest.png";
import fullbodyIcon from "../assets/fullbody.png";
import bodyweightIcon from "../assets/bodyweight.png";
import cardioIcon from "../assets/cardio.png";
import placeholderIcon from "../assets/placeholder.png";

const DEFAULT_ICONS = {
  all: placeholderIcon,
  abs: absIcon,
  arms: armsIcon,
  legs: legsIcon,
  back: backIcon,
  shoulders: shouldersIcon,
  chest: chestIcon,
  "full-body": fullbodyIcon,
  bodyweight: bodyweightIcon,
  cardio: cardioIcon,
  placeholder: placeholderIcon,
};

const PAGE_SIZE = 10;

export default function WorkoutRoutines() {
  const [muscles, setMuscles] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skill, setSkill] = useState("all");
  const [type, setType] = useState("all");
  const [muscleSlug, setMuscleSlug] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const DIFFS = ["all", "beginner", "intermediate", "advanced"];
  const TYPES = ["all", "strength", "hypertrophy", "cardio", "mobility", "other"];

  const fetchMuscles = useCallback(async () => {
    try {
      const res = await API.get("/api/muscle-groups/", { params: { ordering: "name" } });
      const list = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setMuscles(list);
    } catch (e) {
      console.error("fetchMuscles", e);
      setMuscles([]);
    }
  }, []);

  const fetchWorkouts = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const params = { page: p, page_size: PAGE_SIZE, ordering: "-created_at" };
        if (skill !== "all") params.difficulty = skill;
        if (type !== "all") params.workout_type = type;
        if (muscleSlug !== "all") params["muscle_groups__slug"] = muscleSlug;
        if (query?.trim()) params.search = query.trim();

        const res = await API.get("/api/workouts/", { params });
        if (Array.isArray(res.data)) {
          setWorkouts(res.data);
          setCount(res.data.length);
        } else {
          setWorkouts(res.data.results || []);
          setCount(res.data.count || 0);
        }
        setPage(p);
      } catch (e) {
        console.error("fetchWorkouts", e);
        setWorkouts([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    },
    [skill, type, muscleSlug, query]
  );

  useEffect(() => {
    fetchMuscles();
    fetchWorkouts(1);
  }, [fetchMuscles, fetchWorkouts]);

  useEffect(() => {
    fetchWorkouts(1);
  }, [skill, type, muscleSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const topSix = ["abs", "arms", "legs", "back", "shoulders", "chest"];

  return (
    <div className="wr-page">
      <motion.header className="wr-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="wr-hero-inner">
          <h1 className="wr-title">WORKOUT ROUTINES</h1>

          {/* circular icons row */}
          <div className="wr-icons-row" role="list">
            <MuscleIcon
              slug="all"
              label="All"
              src={DEFAULT_ICONS.all}
              active={muscleSlug === "all"}
              onClick={() => setMuscleSlug("all")}
            />

            {topSix.map((s) => (
              <MuscleIcon
                key={s}
                slug={s}
                label={s[0].toUpperCase() + s.slice(1)}
                src={DEFAULT_ICONS[s] || DEFAULT_ICONS.placeholder}
                active={muscleSlug === s}
                onClick={() => setMuscleSlug(s)}
              />
            ))}

            {muscles
              .filter((m) => !topSix.includes((m.slug || "").toLowerCase()))
              .slice(0, 6)
              .map((m) => (
                <MuscleIcon
                  key={m.id}
                  slug={m.slug || String(m.id)}
                  label={m.name}
                  src={DEFAULT_ICONS[m.slug] || DEFAULT_ICONS.placeholder}
                  active={muscleSlug === m.slug}
                  onClick={() => setMuscleSlug(m.slug)}
                />
              ))}
          </div>

          <hr className="wr-divider" />

          {/* Filters */}
          <div className="wr-filters">
            <div className="wr-filter">
              <label>Skill Level</label>
              <select value={skill} onChange={(e) => setSkill(e.target.value)}>
                {DIFFS.map((d) => (
                  <option key={d} value={d}>
                    {d === "all" ? "All" : d[0].toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="wr-filter">
              <label>Workout Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "all" ? "All" : t[0].toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="wr-filter wr-search">
              <label style={{ visibility: "hidden" }}>Search</label>
              <div className="wr-search-row">
                <input
                  placeholder="Search routines or exercises..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchWorkouts(1);
                  }}
                />
                <button className="btn-search" onClick={() => fetchWorkouts(1)}>
                  SEARCH
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="wr-main">
        <div className="wr-stats">
          {loading ? "Loading…" : `Showing ${workouts.length} of ${count} routines`}
        </div>

        <div className="wr-grid">
          {loading ? (
            <SkeletonGrid />
          ) : workouts.length === 0 ? (
            <div className="wr-empty">No routines found.</div>
          ) : (
            workouts.map((w) => <WorkoutCard key={w.id} workout={w} />)
          )}
        </div>

        <div className="wr-pagination">
          <button onClick={() => fetchWorkouts(Math.max(1, page - 1))} disabled={page <= 1}>
            Prev
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button onClick={() => fetchWorkouts(Math.min(pageCount, page + 1))} disabled={page >= pageCount}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

function MuscleIcon({ slug, label, src, active, onClick }) {
  return (
    <button className={`muscle-icon ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active}>
      <div className="muscle-icon-thumb">
        <img src={src} alt={label} onError={(e) => (e.currentTarget.src = DEFAULT_ICONS.placeholder)} />
      </div>
      <div className="muscle-icon-label">{label}</div>
    </button>
  );
}

function WorkoutCard({ workout }) {
  const title = workout.title || workout.name || "Untitled";
  const desc = workout.description || "";
  const img = workout.featured_image || workout.image || "/img/workout-default.jpg";
  return (
    <motion.article className="wr-article" whileHover={{ y: -4 }}>
      <img className="wr-article-img" src={img} alt={title} onError={(e) => (e.currentTarget.src = "/img/workout-default.jpg")} />
      <div className="wr-article-body">
        <div className="wr-article-meta">WORKOUT ROUTINE</div>
        <h3 className="wr-article-title">{title}</h3>
        {desc && <p className="wr-article-desc">{desc}</p>}
        <Link className="wr-read" to={`/workout/${workout.slug}`}>
          VIEW ROUTINE →
        </Link>
      </div>
    </motion.article>
  );
}

function SkeletonGrid() {
  return (
    <div className="wr-grid skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="wr-article skeleton-card" key={i}>
          <div className="skeleton-img" />
          <div className="skeleton-lines">
            <div className="s-line short" />
            <div className="s-line" />
            <div className="s-line" />
          </div>
        </div>
      ))}
    </div>
  );
}
