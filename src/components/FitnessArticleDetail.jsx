import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Copy,
  Facebook,
  Folder,
  Linkedin,
  Mail,
  MessageCircle,
  Microscope,
  Play,
  Target,
  Twitter,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import API, { makeAbsolute } from "./Api";
import "./FitnessArticles.css";

const ensureList = (value) => Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
const getImage = (article) => makeAbsolute(article?.featured_image_url || article?.image_url) || "/logo.png";

const getEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(String(url).includes("://") ? url : `https://${url}`);
    if (parsed.hostname.includes("youtube") || parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    return url;
  } catch {
    const match = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/i);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }
};

export default function FitnessArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeSection, setActiveSection] = useState("core");

  useEffect(() => {
    window.scrollTo(0, 0);
    let mounted = true;
    const loadArticle = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await API.get(`/api/fitness-articles/${slug}/`);
        if (!mounted) return;
        setArticle(res.data);
        const relatedRes = await API.get(`/api/fitness-articles/related/${res.data.id}/`);
        if (mounted) setRelated(Array.isArray(relatedRes.data) ? relatedRes.data : []);
      } catch {
        if (mounted) {
          setArticle(null);
          setErrorMsg("Fitness article not found.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadArticle();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const videoEmbed = useMemo(() => getEmbedUrl(article?.youtubeUrl), [article]);

  const date = useMemo(() => {
    const value = article?.published_at || article?.publishDate || article?.created_at || "2026-01-01";
    return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [article]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
  };

  const shareAction = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article?.title || "RedIron Fitness Article");
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    if (platform === "whatsapp") window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    if (platform === "linkedin") window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, "_blank");
    if (platform === "email") window.location.href = `mailto:?subject=${text}&body=${url}`;
  };

  const ShareButtons = ({ mobile = false }) => (
    <section className={`fitness-article-share ${mobile ? "mobile" : ""}`}>
      {!mobile && <h2>Share Article</h2>}
      <div className="fitness-article-share-buttons">
        <button onClick={copyLink} title="Copy Link"><Copy size={18} /></button>
        <button onClick={() => shareAction("facebook")} title="Facebook"><Facebook size={18} /></button>
        <button onClick={() => shareAction("twitter")} title="X"><Twitter size={18} /></button>
        <button onClick={() => shareAction("whatsapp")} title="WhatsApp"><MessageCircle size={18} /></button>
        <button onClick={() => shareAction("linkedin")} title="LinkedIn"><Linkedin size={18} /></button>
        <button onClick={() => shareAction("email")} title="Email"><Mail size={18} /></button>
      </div>
    </section>
  );

  const SectionCard = ({ title, Icon, children, className = "" }) => (
    <motion.section
      className={`fitness-article-section ${className}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.32 }}
    >
      <h2><Icon size={21} /> {title}</h2>
      <div className="fitness-article-section-content">{children}</div>
    </motion.section>
  );

  if (loading) return <div className="fitness-article-detail-state">Loading fitness article...</div>;
  if (!article) return <div className="fitness-article-detail-state">{errorMsg || "Fitness article not found."}</div>;

  const contentSections = [
    {
      id: "core",
      title: "Core Concepts",
      Icon: Zap,
      body: (
        <ul className="fitness-article-check-list">
          {ensureList(article.coreConcepts).map((item, index) => <li key={index}><CheckCircle2 size={18} /> {item}</li>)}
        </ul>
      ),
    },
    {
      id: "why",
      title: "Why It Matters",
      Icon: Target,
      body: (
        <ul className="fitness-article-check-list">
          {ensureList(article.whyItMatters).map((item, index) => <li key={index}><CheckCircle2 size={18} /> {item}</li>)}
        </ul>
      ),
    },
    {
      id: "myths",
      title: "Common Myths",
      Icon: XCircle,
      body: (
        <ul className="fitness-article-warning-list">
          {ensureList(article.commonMyths).map((item, index) => <li key={index}><AlertTriangle size={18} /> {item}</li>)}
        </ul>
      ),
    },
    {
      id: "coach",
      title: "Coach Insight",
      Icon: Zap,
      className: "fitness-article-coach-card",
      body: <p>{article.coachInsight}</p>,
    },
    {
      id: "science",
      title: "Science Explained",
      Icon: Microscope,
      body: (
        <ul className="fitness-article-check-list">
          {ensureList(article.scienceExplained).map((item, index) => <li key={index}><CheckCircle2 size={18} /> {item}</li>)}
        </ul>
      ),
    },
    {
      id: "application",
      title: "Practical Application",
      Icon: Target,
      body: (
        <ol className="fitness-article-step-list">
          {ensureList(article.practicalApplication).map((item, index) => <li key={index}><span>{index + 1}</span>{item}</li>)}
        </ol>
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      Icon: CheckCircle2,
      body: (
        <ul className="fitness-article-takeaways">
          {ensureList(article.keyTakeaways).map((item, index) => <li key={index}><CheckCircle2 size={18} /> {item}</li>)}
        </ul>
      ),
    },
  ];

  const currentSection = contentSections.find((section) => section.id === activeSection) || contentSections[0];

  return (
    <div className="fitness-article-detail-page">
      <div className="fitness-article-detail-container">
        <button className="fitness-article-detail-back" onClick={() => navigate("/articles/fitness")} aria-label="Back to Fitness Articles">
          <ArrowLeft size={22} />
        </button>
        <span className="fitness-article-back-label">Back to Fitness Articles</span>

        <motion.header
          className="fitness-article-detail-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="fitness-article-detail-intro">
            <span className="fitness-article-badge">{article.category}</span>
            <h1>{article.title}</h1>
            <div className="fitness-article-meta">
              <span><Calendar size={17} /> {date}</span>
              <span><User size={17} /> By {article.author || "RedIron Team"}</span>
              <span><Folder size={17} /> Fitness Articles</span>
            </div>
          </div>
          <div className="fitness-article-detail-image">
            <img src={getImage(article)} alt={article.title} onError={(event) => { event.currentTarget.src = "/logo.png"; }} />
          </div>
          <div className="fitness-article-mobile-share">
            <ShareButtons mobile />
          </div>
        </motion.header>

        <div className="fitness-article-detail-grid">
          <main className="fitness-article-main">
            <SectionCard title="Overview" Icon={BookOpen}>
              <p>{article.overview}</p>
            </SectionCard>

            <section className="fitness-article-tabbed-reader">
              <div className="fitness-article-section-tabs" role="tablist" aria-label="Article sections">
                {contentSections.map(({ id, title, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={activeSection === id}
                    className={activeSection === id ? "active" : ""}
                    onClick={() => setActiveSection(id)}
                  >
                    <Icon size={17} />
                    <span>{title}</span>
                  </button>
                ))}
              </div>
              <SectionCard title={currentSection.title} Icon={currentSection.Icon} className={currentSection.className || ""}>
                {currentSection.body}
              </SectionCard>
            </section>

            {videoEmbed && (
              <SectionCard title={article.videoTitle || "Video Demonstration"} Icon={Play}>
                <div className="fitness-article-video">
                  <iframe src={videoEmbed} title={`${article.title} video`} allowFullScreen />
                </div>
              </SectionCard>
            )}
          </main>

          <aside className="fitness-article-sidebar">
            <div className="fitness-article-sidebar-sticky">
              {related.length > 0 && (
                <section className="fitness-article-related">
                  <h2>Related Articles</h2>
                  {related.slice(0, 4).map((item) => (
                    <Link key={item.id} to={`/articles/fitness/${item.slug}`} className="fitness-article-related-card">
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
              <ShareButtons />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
