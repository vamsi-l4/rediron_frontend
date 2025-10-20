import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "./Api";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import "./ExerciseDetail.css";

/* Helpers */
const extractResults = (res) => {
  if (!res || !res.data) return [];
  if (Array.isArray(res.data)) return res.data;
  if (res.data.results && Array.isArray(res.data.results)) return res.data.results;
  return [];
};

const formatImage = (imgPath) => {
  if (!imgPath) return "/img/default-exercise.jpg";
  if (typeof imgPath !== "string") return "/img/default-exercise.jpg";
  if (imgPath.startsWith("http")) return imgPath;
  const cleaned = imgPath.replace(/^\/+/, "").replace(/^media\//, "");
  return `/media/${cleaned}`;
};

const getEmbedUrl = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  try {
    const maybeUrl = s.includes("://") ? new URL(s) : new URL(`https://${s}`);
    if (maybeUrl.hostname.includes("youtube") || maybeUrl.hostname.includes("youtu.be")) {
      const v = maybeUrl.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const parts = maybeUrl.pathname.split("/").filter(Boolean);
      if (parts.length) return `https://www.youtube.com/embed/${parts[parts.length - 1]}`;
    }
    if (maybeUrl.hostname.includes("vimeo")) {
      const idMatch = maybeUrl.pathname.match(/\/(\d+)/);
      if (idMatch) return `https://player.vimeo.com/video/${idMatch[1]}`;
    }
    return s;
  } catch {
    const yt = s.match(/(?:v=|\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = s.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return s;
  }
};

const parseContentObject = (exercise) => {
  if (!exercise) return {};
  const maybe = exercise.content ?? exercise.details ?? exercise.meta ?? null;
  if (!maybe) return {};
  if (typeof maybe === "object") return maybe;
  if (typeof maybe === "string") {
    try {
      const parsed = JSON.parse(maybe);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    } catch {}
  }
  return {};
};

const renderTag = (item, idx) => {
  if (!item && item !== 0) return null;
  if (typeof item === "object") {
    const key = item.id ?? item.pk ?? item.slug ?? item.name ?? idx;
    const name = item.name ?? item.title ?? item.slug ?? String(item);
    return <span key={key} className="ex-tag">{name}</span>;
  }
  return <span key={idx} className="ex-tag">{String(item)}</span>;
};

export default function ExerciseDetail() {
  const { slug } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const s = encodeURIComponent(slug);

    const load = async () => {
      setLoading(true);
      try {
        try {
          const detailRes = await API.get(`/api/exercises/${s}/`);
          if (!cancelled && detailRes?.data) {
            setExercise(detailRes.data);
            return;
          }
        } catch {}

        try {
          const searchRes = await API.get("/api/exercises/", { params: { search: slug, page_size: 50 } });
          const list = extractResults(searchRes) || [];
          const found =
            list.find((x) => String(x.slug) === String(slug)) ||
            list.find((x) => String(x.slug).toLowerCase() === String(slug).toLowerCase()) ||
            list.find((x) => String(x.name).toLowerCase() === String(slug).toLowerCase()) ||
            list.find((x) => String(x.id) === String(slug));
          if (!cancelled && found) {
            setExercise(found);
            return;
          }
        } catch {}

        try {
          const bySlug = await API.get("/api/exercises/", { params: { slug: slug, page_size: 10 } });
          const list2 = extractResults(bySlug) || [];
          if (!cancelled && list2.length > 0) {
            setExercise(list2[0]);
            return;
          }
        } catch {}
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <div className="ex-detail-loading">Loading...</div>;
  if (!exercise) return <div className="ex-detail-error">Exercise not found</div>;

  const contentObj = parseContentObject(exercise);

  const description =
    exercise.description?.trim() ||
    contentObj.description?.trim() ||
    exercise.long_description ||
    "";

  const benefits = Array.isArray(contentObj.benefits) ? contentObj.benefits : Array.isArray(exercise.benefits) ? exercise.benefits : [];
  const how_to = Array.isArray(contentObj.how_to) ? contentObj.how_to : Array.isArray(exercise.how_to) ? exercise.how_to : [];
  const variations = Array.isArray(contentObj.variations) ? contentObj.variations : Array.isArray(exercise.variations) ? exercise.variations : [];
  const common_mistakes = Array.isArray(contentObj.common_mistakes) ? contentObj.common_mistakes : Array.isArray(exercise.common_mistakes) ? exercise.common_mistakes : [];
  const sample_challenge = Array.isArray(contentObj.sample_challenge) ? contentObj.sample_challenge : Array.isArray(exercise.sample_challenge) ? exercise.sample_challenge : [];

  const videoEmbed = getEmbedUrl(exercise.video_url ?? exercise.video ?? "");

  return (
    <>
      <Navbar />
      <motion.main className="ex-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <section className="ex-hero">
          <img
            src={formatImage(exercise.image ?? exercise.photo ?? exercise.featured_image ?? "")}
            alt={exercise.name ?? exercise.title ?? "Exercise"}
            className="ex-hero-img"
          />
          <div className="ex-hero-overlay">
            <h1>{exercise.name ?? exercise.title ?? "Exercise"}</h1>
            <p className="ex-skill-type">
              <span>{exercise.skill_level ?? exercise.level ?? "—"}</span> |{" "}
              <span>{exercise.exercise_type ?? "—"}</span>
            </p>
          </div>
        </section>

        <section className="ex-content">
          <motion.div className="ex-section-card" whileHover={{ y: -4 }}>
            <h2>Description</h2>
            {description ? <p>{description}</p> : <p>No description available.</p>}
          </motion.div>

          {videoEmbed && (
            <motion.div className="ex-video" whileHover={{ scale: 1.01 }}>
              <iframe
                title={exercise.name ?? "exercise-video"}
                src={videoEmbed}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          )}

          {benefits.length > 0 && (
            <motion.div className="ex-section-card" whileHover={{ y: -3 }}>
              <h3>✅ Benefits</h3>
              <ul>{benefits.map((b, i) => <li key={i}>{String(b)}</li>)}</ul>
            </motion.div>
          )}

          {how_to.length > 0 && (
            <motion.div className="ex-section-card" whileHover={{ y: -3 }}>
              <h3>🧘‍♀️ How to Perform</h3>
              <ol>{how_to.map((s, i) => <li key={i}>{String(s)}</li>)}</ol>
            </motion.div>
          )}

          {variations.length > 0 && (
            <motion.div className="ex-section-card" whileHover={{ y: -3 }}>
              <h3>🧱 Variations</h3>
              <ul>{variations.map((v, i) => <li key={i}>{String(v)}</li>)}</ul>
            </motion.div>
          )}

          {common_mistakes.length > 0 && (
            <motion.div className="ex-section-card" whileHover={{ y: -3 }}>
              <h3>⚠️ Common Mistakes</h3>
              <ul>{common_mistakes.map((m, i) => <li key={i}>{String(m)}</li>)}</ul>
            </motion.div>
          )}

          {sample_challenge.length > 0 && (
            <motion.div className="ex-section-card" whileHover={{ y: -3 }}>
              <h3>🧪 Sample 30-Day Challenge</h3>
              <ul>
                {sample_challenge.map((c, i) => {
                  if (c && typeof c === "object") {
                    const day = c.day ?? c.day_num ?? c.dayNumber ?? (i + 1);
                    const reps = c.reps ?? c.repetition ?? c.r ?? "-";
                    const sets = c.sets ?? c.s ?? "-";
                    return <li key={i}>Day {day}: {reps} reps × {sets} sets</li>;
                  }
                  return <li key={i}>{String(c)}</li>;
                })}
              </ul>
            </motion.div>
          )}

          <div className="ex-meta-grid">
            <motion.div className="ex-meta-box" whileHover={{ scale: 1.02 }}>
              <h3>Primary Muscles</h3>
              <div className="ex-tags">{(exercise.primary_muscles || []).map((m, i) => renderTag(m, i))}</div>
            </motion.div>
            <motion.div className="ex-meta-box" whileHover={{ scale: 1.02 }}>
              <h3>Secondary Muscles</h3>
              <div className="ex-tags">{(exercise.secondary_muscles || []).map((m, i) => renderTag(m, i))}</div>
            </motion.div>
            <motion.div className="ex-meta-box" whileHover={{ scale: 1.02 }}>
              <h3>Equipment</h3>
              <div className="ex-tags">{(exercise.equipment || []).map((e, i) => renderTag(e, i))}</div>
            </motion.div>
          </div>

          <div className="ex-back">
            <Link to="/workouts/exercises" className="ex-back-btn">← Back to Exercises</Link>
          </div>
        </section>
      </motion.main>
    </>
  );
}
