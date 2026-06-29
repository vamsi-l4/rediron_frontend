import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Facebook,
  Folder,
  Info,
  Linkedin,
  Lightbulb,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Play,
  Target,
  Twitter,
  User,
} from "lucide-react";
import API, { makeAbsolute } from "./Api";
import "./WorkoutTips.css";

const getEmbedUrl = (url) => {
  if (!url) return null;
  const value = String(url).trim();
  try {
    const parsed = value.includes("://") ? new URL(value) : new URL(`https://${value}`);
    if (parsed.hostname.includes("youtube") || parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    return value;
  } catch {
    const match = value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/i);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }
};

const getImage = (tip) => makeAbsolute(tip?.thumbnail || tip?.image_url || tip?.featured_image_url) || "/logo.png";
const ensureList = (value) => Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];

export default function WorkoutTipDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tip, setTip] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeSection, setActiveSection] = useState("why");

  useEffect(() => {
    window.scrollTo(0, 0);
    let mounted = true;
    const loadTip = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await API.get(`/api/workout-tips/${slug}/`);
        if (!mounted) return;
        setTip(res.data);
        const relatedRes = await API.get(`/api/workout-tips/related/${res.data.id}/`);
        if (mounted) setRelated(Array.isArray(relatedRes.data) ? relatedRes.data : []);
      } catch {
        if (mounted) {
          setTip(null);
          setErrorMsg("Workout tip not found.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTip();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const videoEmbed = useMemo(() => getEmbedUrl(tip?.youtubeUrl), [tip]);
  const detailTabs = useMemo(() => {
    if (!tip) return [];
    return [
      {
        id: "why",
        label: "Why It Matters",
        visible: ensureList(tip.whyItMatters).length > 0,
        title: "Why It Matters",
        Icon: ClipboardCheck,
        body: (
          <ul className="workoutTips-checkList">
            {ensureList(tip.whyItMatters).map((item, index) => (
              <li key={index}><CheckCircle2 size={18} /> {item}</li>
            ))}
          </ul>
        ),
      },
      {
        id: "steps",
        label: "Step-by-Step Guide",
        visible: ensureList(tip.stepByStepGuide).length > 0,
        title: "Step-by-Step Guide",
        Icon: Target,
        body: (
          <ol className="workoutTips-stepList">
            {ensureList(tip.stepByStepGuide).map((item, index) => (
              <li key={index}><span>{index + 1}</span>{item.replace(/^Step\s*\d+:\s*/i, "")}</li>
            ))}
          </ol>
        ),
      },
      {
        id: "mistakes",
        label: "Common Mistakes",
        visible: ensureList(tip.commonMistakes).length > 0,
        title: "Common Mistakes",
        Icon: AlertTriangle,
        body: (
          <ul className="workoutTips-warningList">
            {ensureList(tip.commonMistakes).map((item, index) => (
              <li key={index}><AlertTriangle size={18} /> {item}</li>
            ))}
          </ul>
        ),
      },
      {
        id: "coach",
        label: "Coach Tip",
        visible: Boolean(tip.coachTip),
        title: "Coach Tip",
        Icon: Lightbulb,
        className: "workoutTips-coachCard",
        body: <p>{tip.coachTip}</p>,
      },
      {
        id: "takeaways",
        label: "Key Takeaways",
        visible: ensureList(tip.keyTakeaways).length > 0,
        title: "Key Takeaways",
        Icon: CheckCircle2,
        body: (
          <ul className="workoutTips-takeaways">
            {ensureList(tip.keyTakeaways).map((item, index) => (
              <li key={index}><CheckCircle2 size={18} /> {item}</li>
            ))}
          </ul>
        ),
      },
    ].filter((tab) => tab.visible);
  }, [tip]);

  useEffect(() => {
    if (detailTabs.length && !detailTabs.some((tab) => tab.id === activeSection)) {
      setActiveSection(detailTabs[0].id);
    }
  }, [detailTabs, activeSection]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
  };

  const shareAction = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(tip?.title || "Workout Tips");
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    if (platform === "whatsapp") window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    if (platform === "linkedin") window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, "_blank");
    if (platform === "email") window.location.href = `mailto:?subject=${text}&body=${url}`;
  };

  const ShareButtons = ({ compact = false }) => (
    <section className={`workoutTips-share ${compact ? "compact" : ""}`}>
      {!compact && <h2>Share this article</h2>}
      <div className="workoutTips-shareButtons">
        <button onClick={copyLink} title="Copy Link"><LinkIcon size={19} /></button>
        <button onClick={() => shareAction("facebook")} title="Facebook"><Facebook size={19} /></button>
        <button onClick={() => shareAction("twitter")} title="X"><Twitter size={19} /></button>
        <button onClick={() => shareAction("whatsapp")} title="WhatsApp"><MessageCircle size={19} /></button>
        <button onClick={() => shareAction("linkedin")} title="LinkedIn"><Linkedin size={19} /></button>
        <button onClick={() => shareAction("email")} title="Email"><Mail size={19} /></button>
      </div>
    </section>
  );

  const SectionCard = ({ title, Icon, children, className = "" }) => (
    <motion.section
      className={`workoutTips-detailCard ${className}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <h2><Icon size={21} /> {title}</h2>
      {children}
    </motion.section>
  );

  if (loading) return <div className="workoutTips-detailState">Loading workout tip...</div>;
  if (!tip) return <div className="workoutTips-detailState">{errorMsg || "Workout tip not found."}</div>;

  const date = new Date(tip.published_at || "2026-01-01").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="workoutTips-detailPage">
      <div className="workoutTips-detailContainer">
        <button className="workoutTips-detailBack" onClick={() => navigate("/articles/workout-tips")} aria-label="Back to Workout Tips">
          <ArrowLeft size={22} />
        </button>
        <span className="workoutTips-detailBackText">Back to Workout Tips</span>

        <motion.header
          className="workoutTips-detailHero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="workoutTips-detailIntro">
            <span className="workoutTips-detailBadge">{tip.category}</span>
            <h1>{tip.title}</h1>
            <div className="workoutTips-detailMeta">
              <span><Calendar size={17} /> {date}</span>
              <span><User size={17} /> {tip.author || "RedIron Team"}</span>
              <span><Folder size={17} /> Workout Tips</span>
            </div>
            <div className="workoutTips-detailDesktopShare">
              <ShareButtons compact />
            </div>
          </div>
          <div className="workoutTips-detailImageWrap">
            <img src={getImage(tip)} alt={tip.title} onError={(event) => { event.currentTarget.src = "/logo.png"; }} />
          </div>
          <div className="workoutTips-detailMobileShare">
            <ShareButtons compact />
          </div>
        </motion.header>

        <div className="workoutTips-detailGrid">
          <main className="workoutTips-detailMain">
            <SectionCard title="Overview" Icon={Info}>
              <p>{tip.overview}</p>
            </SectionCard>

            {detailTabs.length > 0 && (
              <div className="workoutTips-tabsShell">
                <div className="workoutTips-detailTabs" role="tablist" aria-label="Workout tip sections">
                  {detailTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeSection === tab.id}
                      className={`workoutTips-detailTab ${activeSection === tab.id ? "active" : ""}`}
                      onClick={() => setActiveSection(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {detailTabs.filter((tab) => tab.id === activeSection).map((tab) => (
                  <SectionCard key={tab.id} title={tab.title} Icon={tab.Icon} className={tab.className || ""}>
                    {tab.body}
                  </SectionCard>
                ))}
              </div>
            )}

            {videoEmbed && (
              <SectionCard title="Video Demonstration" Icon={Play}>
                <div className="workoutTips-video">
                  <iframe src={videoEmbed} title={`${tip.title} video`} allowFullScreen />
                </div>
              </SectionCard>
            )}

          </main>

          <aside className="workoutTips-related">
            <div className="workoutTips-relatedSticky">
              <ShareButtons />
              {related.length > 0 && (
                <section className="workoutTips-relatedBlock">
                  <h2>Related Articles</h2>
                  {related.slice(0, 4).map((item) => (
                    <Link key={item.id} to={`/articles/workout-tips/${item.slug}`} className="workoutTips-relatedCard">
                      <img src={getImage(item)} alt="" onError={(event) => { event.currentTarget.src = "/logo.png"; }} />
                      <span>
                        <small>{item.category}</small>
                        <strong>{item.title}</strong>
                        <em>{new Date(item.published_at || "2026-01-01").toLocaleDateString()}</em>
                      </span>
                      <ArrowRight size={16} />
                    </Link>
                  ))}
                </section>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
