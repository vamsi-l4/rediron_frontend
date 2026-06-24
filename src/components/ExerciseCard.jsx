import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Dumbbell, Heart } from "lucide-react";
import "./ExerciseCard.css";

const fallbackImage = "/assets/exercises/bench_press.jpg";

const formatImage = (value) => {
  if (!value || typeof value !== "string") return fallbackImage;
  if (value.startsWith("http") || value.startsWith("/")) return value;
  if (value.startsWith("media/")) return `/${value}`;
  return `/media/${value.replace(/^\/+/, "")}`;
};

const titleCase = (value) => {
  if (!value) return "";
  return String(value).replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const firstName = (items) => {
  if (!Array.isArray(items) || !items.length) return "";
  const item = items[0];
  return item?.name || item?.title || String(item);
};

export default function ExerciseCard({ exercise }) {
  const [loaded, setLoaded] = useState(false);
  const slug = encodeURIComponent(exercise?.slug || exercise?.id || "");
  const equipmentName = firstName(exercise?.equipment) || "Bodyweight";
  const primaryMuscle = firstName(exercise?.primary_muscles) || exercise?.subcategory || exercise?.muscle_group || "General";
  const description = String(exercise?.description || "").trim();

  return (
    <motion.article
      className="exerciseCard-card"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.24 }}
    >
      <Link to={`/exercises/${slug}`} className="exerciseCard-mediaLink" aria-label={`View ${exercise?.name || "exercise"}`}>
        {!loaded && <span className="exerciseCard-imageSkeleton" />}
        <img
          src={formatImage(exercise?.featured_image || exercise?.image || exercise?.featured_image_url)}
          alt={exercise?.name || "Exercise"}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
            setLoaded(true);
          }}
        />
        <span className="exerciseCard-difficulty">{titleCase(exercise?.difficulty || exercise?.skill_level || "Beginner")}</span>
        <span className="exerciseCard-muscleBadge">{exercise?.muscle_group || "Exercise"}</span>
        <span className="exerciseCard-wishlist" aria-label="Wishlist">
          <Heart size={17} />
        </span>
      </Link>

      <div className="exerciseCard-body">
        <h2>{exercise?.name || exercise?.title || "Exercise"}</h2>
        <p>{description ? `${description.slice(0, 112)}${description.length > 112 ? "..." : ""}` : "Professional movement guide with focused form cues and training context."}</p>

        <div className="exerciseCard-meta">
          <span><Dumbbell size={15} />{equipmentName}</span>
          <span>{primaryMuscle}</span>
        </div>

        <Link to={`/exercises/${slug}`} className="exerciseCard-button">
          View Exercise
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </motion.article>
  );
}
