import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "./Api";
import WorkoutCard from "./WorkoutCard";
import "./WorkoutCard.css";
import "./ArticleDetail.css";

export default function WorkoutDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErrorMsg(null);

    const fetchWorkout = async () => {
      try {
        const res = await API.get(`/api/workouts/${slug}/`);
        if (!mounted) return;
        setWorkout(res.data);

        // Related workouts: by difficulty & type
        try {
          const r = await API.get("/api/workouts/", {
            params: {
              difficulty: res.data?.difficulty,
              workout_type: res.data?.workout_type,
            },
          });
          const list = Array.isArray(r.data) ? r.data : r.data?.results || [];
          setRelated(list.filter((w) => w.slug !== res.data.slug));
        } catch {
          setRelated([]);
        }
      } catch {
        setWorkout(null);
        setErrorMsg("Workout not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const img = workout?.featured_image || workout?.image || "/img/default-workout.jpg";

  const scrollRelated = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <>
   
        <div className="article-page-container">Loading workout…</div>
   
      </>
    );
  }

  if (!workout) {
    return (
      <>
  
        <div className="article-page-container">{errorMsg || "Workout not found"}</div>
 
      </>
    );
  }

  return (
    <>

      <motion.div
        className="article-page-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="article-hero-container">
          <img src={img} alt={workout.title} className="article-hero-img" />
          <div className="article-hero-overlay">
            <h1 className="article-hero-title">{workout.title}</h1>
            <div className="article-meta">
              {workout.difficulty && <span>{workout.difficulty}</span>}
              <span>•</span>
              {workout.duration_minutes && <span>{workout.duration_minutes} min</span>}
            </div>
            <div className="article-hero-buttons">
              <button onClick={() => navigate(-1)} className="back-btn-hero">← Back</button>
            </div>
          </div>
        </div>

        {workout.description && <p className="article-excerpt-detail">{workout.description}</p>}

        {/* Exercises list */}
        <div className="article-content-detail">
          {workout.items?.length > 0 ? (
            <div className="exercise-list">
              <h2>Exercises</h2>
              <ul>
                {workout.items.map((item) => (
                  <li key={item.id}>
                    {item.order}. <strong>{item.exercise?.name}</strong> —{" "}
                    {item.sets} sets × {item.reps} reps (Rest {item.rest_seconds}s)
                    {item.notes && <div className="exercise-notes">Notes: {item.notes}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No exercises found for this workout.</p>
          )}
        </div>

        {related.length > 0 && (
          <div className="related-articles-section">
            <h2>Related Workouts</h2>
            <div className="related-articles-wrapper">
              <button className="scroll-btn left" onClick={() => scrollRelated(-1)}>‹</button>
              <div ref={scrollerRef} className="related-articles-scroller">
                {related.map((rw) => (
                  <div key={rw.slug} className="related-article-card">
                    <WorkoutCard workout={rw} />
                  </div>
                ))}
              </div>
              <button className="scroll-btn right" onClick={() => scrollRelated(1)}>›</button>
            </div>
          </div>
        )}

        <div className="back-to-all">
          <Link to="/workouts/routines">← Back to all workouts</Link>
        </div>
      </motion.div>
    </>
  );
}
