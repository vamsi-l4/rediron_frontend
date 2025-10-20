import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ExerciseCard.css";

/** avoid duplicate /media/ and support different backend formats */
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
      const m = maybeUrl.pathname.match(/\/(\d+)/);
      if (m) return `https://player.vimeo.com/video/${m[1]}`;
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

const slugOrId = (exercise) => {
  if (!exercise) return "";
  if (exercise.slug) return encodeURIComponent(String(exercise.slug));
  if (exercise.id || exercise.pk) return encodeURIComponent(String(exercise.id ?? exercise.pk));
  if (exercise.name) return encodeURIComponent(String(exercise.name).toLowerCase().replace(/\s+/g, "-"));
  return "";
};

export default function ExerciseCard({ exercise }) {
  const img = formatImage(exercise?.image ?? exercise?.featured_image ?? "");
  const [open, setOpen] = useState(false);
  const hasVideo = !!(exercise && (exercise.video_url || exercise.video));

  return (
    <>
      <div className="ex-card">
        <div className="ex-media">
          <img src={img} alt={exercise?.name ?? "exercise"} />
          {hasVideo && (
            <button
              className="ex-play"
              onClick={() => setOpen(true)}
              aria-label={`Play ${exercise?.name ?? "video"}`}
            >
              ▶
            </button>
          )}
        </div>

        <div className="ex-body">
          <h3 className="ex-title">{exercise?.name ?? "Exercise"}</h3>
          <div className="ex-meta">
            <span className="ex-tag">{exercise?.skill_level ?? "—"}</span>
            <span className="ex-tag">{exercise?.exercise_type ?? "—"}</span>
          </div>

          <Link to={`/exercises/${slugOrId(exercise)}`} className="ex-link">
            Read More →
          </Link>
        </div>
      </div>

      {open && (
        <div className="ex-modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="ex-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="ex-modal-close" onClick={() => setOpen(false)}>
              ×
            </button>
            {exercise && (exercise.video_url || exercise.video) ? (
              <div className="ex-video-wrap">
                <iframe
                  title={exercise?.name ?? "exercise-video"}
                  src={getEmbedUrl(exercise.video_url ?? exercise.video)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="ex-no-video">No video available</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
