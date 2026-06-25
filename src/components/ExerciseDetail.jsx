import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clipboard,
  Facebook,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  PlayCircle,
  Share2,
  Twitter,
} from "lucide-react";
import API, { DEBUG } from "./Api";
import "./ExerciseDetail.css";

const fallbackImage = "/assets/exercises/bench_press.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.28 },
};

const extractResults = (res) => {
  if (!res?.data) return [];
  if (Array.isArray(res.data)) return res.data;
  return Array.isArray(res.data.results) ? res.data.results : [];
};

const formatImage = (value) => {
  if (!value || typeof value !== "string") return fallbackImage;
  if (value.startsWith("http") || value.startsWith("/")) return value;
  if (value.startsWith("media/")) return `/${value}`;
  return `/media/${value.replace(/^\/+/, "")}`;
};

const toTitle = (value) => {
  if (!value) return "";
  return String(value).replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const getYouTubeEmbed = (value) => {
  if (!value) return "";
  const text = String(value).trim();
  if (!text) return "";
  if (text.includes("youtube.com/embed/")) return text;
  try {
    const url = new URL(text.includes("://") ? text : `https://${text}`);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    const match = text.match(/(?:v=|embed\/|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  }
  return "";
};

const listFrom = (...values) => {
  for (const value of values) {
    if (Array.isArray(value) && value.length) return value;
  }
  return [];
};

const nameOf = (item) => item?.name || item?.title || String(item || "");

const equipmentPath = (item) => `/equipment/${item?.category || "all"}/${item?.id}`;

const challengeText = (item) => {
  if (!item || typeof item !== "object") return String(item || "");
  return item.prescription || item.description || item.text || "";
};

const challengeLabel = (item, index) => {
  if (item && typeof item === "object" && item.day) return `Day ${item.day}`;
  return String(index + 1);
};

function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || "RedIron Exercise");
  const items = [
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "LinkedIn", icon: Share2, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Email", icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="exerciseDetail-share" aria-label="Share exercise">
      <button type="button" onClick={copyLink}><Clipboard size={16} />{copied ? "Copied" : "Copy Link"}</button>
      {items.map(({ label, icon: Icon, href }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon size={16} /></a>
      ))}
    </div>
  );
}

function MuscleFocus({ primary, secondary, group }) {
  const primaryItems = primary.map(nameOf).filter(Boolean);
  const secondaryItems = secondary.map(nameOf).filter(Boolean);

  return (
    <motion.section className="exerciseDetail-section exerciseDetail-muscleFocus" {...fadeUp}>
      <h2>Muscle Focus</h2>
      <div className="exerciseDetail-muscleTextGrid">
        <div>
          <span className="exerciseDetail-muscleLabel">Primary</span>
          <div className="exerciseDetail-musclePills">
            {(primaryItems.length ? primaryItems : [group || "Main Muscle"]).map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <div>
          <span className="exerciseDetail-muscleLabel">Secondary</span>
          <div className="exerciseDetail-musclePills exerciseDetail-musclePillsSecondary">
            {(secondaryItems.length ? secondaryItems : ["Support Muscles"]).map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function ExerciseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/api/exercises/${encodeURIComponent(slug)}/`);
        if (!cancelled) setExercise(res.data);
      } catch (error) {
        if (DEBUG) console.error("[ExerciseDetail] Failed to load exercise:", error);
        if (!cancelled) setExercise(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [slug]);

  const loadRelated = useCallback(async () => {
    if (!exercise) return;
    try {
      const res = await API.get("/api/exercises/", {
        params: { muscle_group: exercise.muscle_group, page_size: 12 },
      });
      const candidates = extractResults(res)
        .filter((item) => item.slug !== exercise.slug)
        .sort((a, b) => {
          const relatedCodes = exercise.related_exercises || [];
          const aIndex = relatedCodes.indexOf(a.code || a.slug);
          const bIndex = relatedCodes.indexOf(b.code || b.slug);
          return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        })
        .slice(0, 4);
      setRelated(candidates);
    } catch {
      setRelated([]);
    }
  }, [exercise]);

  useEffect(() => {
    loadRelated();
  }, [loadRelated]);

  const content = exercise?.content || {};
  const benefits = listFrom(exercise?.benefits, content.benefits);
  const steps = listFrom(exercise?.how_to_perform, content.how_to_perform, content.how_to);
  const variations = listFrom(exercise?.variations, content.variations);
  const mistakes = listFrom(exercise?.common_mistakes, content.common_mistakes);
  const challenge = listFrom(exercise?.sample_30_day_challenge, content.sample_30_day_challenge, content.sample_challenge);
  const tips = listFrom(exercise?.tips, content.tips, content.coaching_tips);
  const primary = exercise?.primary_muscles || [];
  const secondary = exercise?.secondary_muscles || [];
  const equipment = exercise?.equipment || [];
  const video = getYouTubeEmbed(exercise?.youtube_url || exercise?.video_url);
  const image = formatImage(exercise?.featured_image || exercise?.image || exercise?.featured_image_url);

  const firstEquipment = equipment[0];
  const firstPrimary = nameOf(primary[0]) || exercise?.subcategory || exercise?.muscle_group;
  const title = exercise?.name || exercise?.title || "Exercise";

  const metaTags = useMemo(() => [
    toTitle(exercise?.difficulty || exercise?.skill_level || "Beginner"),
    toTitle(exercise?.exercise_type || "Strength"),
    exercise?.muscle_group,
  ].filter(Boolean), [exercise]);

  if (loading) {
    return <main className="exerciseDetail-page"><div className="exerciseDetail-loader">Loading exercise...</div></main>;
  }

  if (!exercise) {
    return <main className="exerciseDetail-page"><div className="exerciseDetail-loader">Exercise not found.</div></main>;
  }

  return (
    <motion.main className="exerciseDetail-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button className="exerciseDetail-back" type="button" onClick={() => navigate(-1)}><ArrowLeft size={18} />Back</button>

      <section className="exerciseDetail-top">
        <div className="exerciseDetail-titleBlock">
          <span className="exerciseDetail-category">{exercise.subcategory || exercise.muscle_group}</span>
          <h1>{title}</h1>
          <div className="exerciseDetail-metaTags">
            {metaTags.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="exerciseDetail-metaInfo">
            <span>Difficulty: {toTitle(exercise.skill_level)}</span>
            <span>Equipment: {firstEquipment ? <Link to={equipmentPath(firstEquipment)}>{firstEquipment.name}</Link> : "Bodyweight"}</span>
            <span>Primary Muscle: {firstPrimary}</span>
            <span>Secondary Muscle: {secondary.map(nameOf).filter(Boolean).slice(0, 2).join(", ") || "Support"}</span>
          </div>
        </div>

        <motion.figure className="exerciseDetail-heroImage" whileHover={{ scale: 1.01 }}>
          <img src={image} alt={title} loading="eager" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
          {video && (
            <a className="exerciseDetail-watchButton" href="#exerciseDetail-video">
              <PlayCircle size={17} />
              Watch Video
            </a>
          )}
        </motion.figure>
        <ShareButtons title={title} />
      </section>

      <div className="exerciseDetail-layout">
        <div className="exerciseDetail-main">
          <motion.section className="exerciseDetail-section" {...fadeUp}>
            <h2>Description</h2>
            <p>{exercise.description || content.description || "No description available."}</p>
          </motion.section>

          <div className="exerciseDetail-twoCol">
            <motion.section className="exerciseDetail-section" {...fadeUp}>
              <h2>Benefits</h2>
              <div className="exerciseDetail-cardGrid">
                {(benefits.length ? benefits : ["Builds focused strength and improves movement quality."]).map((item, index) => <div key={index}>{String(item)}</div>)}
              </div>
            </motion.section>

            <motion.section className="exerciseDetail-section" {...fadeUp}>
              <h2>How To Perform</h2>
              <ol className="exerciseDetail-steps">
                {(steps.length ? steps : ["Set up with control.", "Move through a full comfortable range.", "Finish each rep with stable posture."]).map((item, index) => <li key={index}>{String(item).replace(/^Step\s*\d+:\s*/i, "")}</li>)}
              </ol>
            </motion.section>
          </div>

          {variations.length > 0 && (
            <motion.section className="exerciseDetail-section" id="exerciseDetail-video" {...fadeUp}>
              <h2>Variations</h2>
              <div className="exerciseDetail-cardGrid">{variations.map((item, index) => <div key={index}>{String(item)}</div>)}</div>
            </motion.section>
          )}

          <div className="exerciseDetail-twoCol">
            <motion.section className="exerciseDetail-section" {...fadeUp}>
              <h2>Common Mistakes</h2>
              <div className="exerciseDetail-warningList">
                {(mistakes.length ? mistakes : ["Rushing reps or losing position under fatigue."]).map((item, index) => <div key={index}>{String(item)}</div>)}
              </div>
            </motion.section>

            <motion.section className="exerciseDetail-section exerciseDetail-coachCard" {...fadeUp}>
              <h2>Coaching Tips</h2>
              <ul>{(tips.length ? tips : ["Keep the working muscle under control through every rep."]).map((item, index) => <li key={index}>{String(item)}</li>)}</ul>
            </motion.section>
          </div>

          {challenge.length > 0 && (
            <motion.section className="exerciseDetail-section" {...fadeUp}>
              <h2>30 Day Challenge</h2>
              <div className="exerciseDetail-timeline">
                {challenge.map((item, index) => (
                  <div key={index}>
                    <span>{challengeLabel(item, index)}</span>
                    <p>{challengeText(item)}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {video && (
            <motion.section className="exerciseDetail-section" {...fadeUp}>
              <h2>Video Demonstration</h2>
              <div className="exerciseDetail-videoWrap">
                {!iframeLoaded && <div className="exerciseDetail-videoSkeleton" />}
                <iframe
                  src={video}
                  title={`${title} video demonstration`}
                  onLoad={() => setIframeLoaded(true)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.section>
          )}

          <div className="exerciseDetail-bottomGrid">
            <EquipmentPanel equipment={equipment} />
            <MuscleFocus primary={primary} secondary={secondary} group={exercise.muscle_group} />
          </div>

          <RelatedPanel related={related} />
        </div>

        <aside className="exerciseSidebar-panel">
          <RelatedPanel related={related} compact />
          <EquipmentPanel equipment={equipment} compact />
          <MuscleFocus primary={primary} secondary={secondary} group={exercise.muscle_group} />
        </aside>
      </div>
    </motion.main>
  );
}

function RelatedPanel({ related, compact = false }) {
  if (!related?.length) return null;
  return (
    <motion.section className={compact ? "exerciseSidebar-card" : "exerciseDetail-section exerciseDetail-relatedBottom"} {...fadeUp}>
      <h2>Related Exercises</h2>
      <div className={compact ? "exerciseSidebar-relatedList" : "exerciseDetail-relatedGrid"}>
        {related.slice(0, 4).map((item) => (
          <Link key={item.id || item.slug} to={`/exercises/${item.slug}`} className="exerciseSidebar-relatedItem">
            <img src={formatImage(item.featured_image || item.image || item.featured_image_url)} alt="" loading="lazy" />
            <span>
              <strong>{item.name}</strong>
              <small>{toTitle(item.skill_level)} · {item.subcategory || item.muscle_group}</small>
            </span>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

function EquipmentPanel({ equipment, compact = false }) {
  if (!equipment?.length) return null;
  const item = equipment[0];
  const image = item.image1 || item.image || item.image_urls?.[0] || "/logo.png";
  return (
    <motion.section className={compact ? "exerciseSidebar-card" : "exerciseDetail-section exerciseDetail-equipmentPanel"} {...fadeUp}>
      <h2>Equipment Used</h2>
      <div className="exerciseSidebar-equipmentCard">
        <img src={formatImage(image)} alt={item.name} loading="lazy" />
        <div>
          <strong>{item.name}</strong>
          <span>{toTitle(item.category || "Equipment")}</span>
          <Link to={equipmentPath(item)}><LinkIcon size={15} />View Equipment Details</Link>
        </div>
      </div>
    </motion.section>
  );
}
