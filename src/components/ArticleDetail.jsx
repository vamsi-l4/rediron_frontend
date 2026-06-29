import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  MessageCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import API from "./Api";
import "./ArticleDetail.css";

const getEmbedUrl = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  try {
    const maybeUrl = s.includes("://") ? new URL(s) : new URL(`https://${s}`);
    if (
      maybeUrl.hostname.includes("youtube") ||
      maybeUrl.hostname.includes("youtu.be")
    ) {
      const v = maybeUrl.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const parts = maybeUrl.pathname.split("/").filter(Boolean);
      if (parts.length)
        return `https://www.youtube.com/embed/${parts[parts.length - 1]}`;
    }
    if (maybeUrl.hostname.includes("vimeo")) {
      const idMatch = maybeUrl.pathname.match(/\/(\d+)/);
      if (idMatch) return `https://player.vimeo.com/video/${idMatch[1]}`;
    }
    return s;
  } catch {
    const yt = s.match(
      /(?:v=|\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i
    );
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = s.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return s;
  }
};

const formatImage = (imgPath) => {
  const defaultImage = "/img/default-article.jpg";
  if (!imgPath || typeof imgPath !== "string") return defaultImage;
  const path = imgPath.trim();
  if (path.startsWith("http")) return path;
  if (path.startsWith("/media/")) return path;
  if (path.startsWith("media/")) return `/${path}`;
  return `/media/${path.replace(/^\/+/, "")}`;
};

const normalizeContentList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim());
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }
  return [String(value).trim()];
};

const parseMarkdownContent = (content) => {
  let benefits = [];
  let steps = [];
  let mistakes = [];
  let tips = [];

  const blocks = content.split(/(?=^##\s)/m);
  blocks.forEach((block) => {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    if (!lines.length) return;
    const title = lines[0].toLowerCase();
    const contentLines = lines.slice(1);

    const listItems = contentLines
      .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*"))
      .map((l) =>
        l.replace(/^[-*]\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      );

    const textContent = contentLines
      .filter((l) => !l.trim().startsWith("-") && !l.trim().startsWith("*"))
      .map((l) => l.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"))
      .join(" ");

    if (title.includes("benefit") || title.includes("matter")) {
      if (listItems.length) benefits.push(...listItems);
      if (textContent) benefits.push(textContent);
    } else if (title.includes("how to") || title.includes("apply") || title.includes("component")) {
      if (listItems.length) steps.push(...listItems);
      if (textContent) steps.push(textContent);
    } else if (
      title.includes("mistake") ||
      title.includes("faq") ||
      title.includes("tip")
    ) {
      listItems.forEach((item) => {
        const lowerItem = item.toLowerCase();
        if (
          lowerItem.includes("avoid") ||
          lowerItem.includes("don't") ||
          lowerItem.includes("never")
        ) {
          mistakes.push(item);
        } else {
          tips.push(item);
        }
      });
      if (textContent) tips.push(textContent);
    }
  });

  return { benefits, steps, mistakes, tips };
};

const parseArticleContent = (content) => {
  if (!content) {
    return { benefits: [], steps: [], mistakes: [], tips: [] };
  }

  if (typeof content === "object") {
    return {
      benefits: normalizeContentList(content.benefits || content.key_benefits || []),
      steps: normalizeContentList(content.how_to || content.howTo || content.steps || content.apply || []),
      mistakes: normalizeContentList(content.mistakes || []),
      tips: normalizeContentList(content.tips || content.advice || []),
      overview: normalizeContentList(content.overview || content.summary || []),
    };
  }

  return parseMarkdownContent(String(content));
};

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeSection, setActiveSection] = useState("benefits");

  useEffect(() => {
    window.scrollTo(0, 0);
    let mounted = true;
    setLoading(true);
    setErrorMsg(null);

    const fetchArticle = async () => {
      try {
        const res = await API.get(`/api/nutrition/${slug}/`);
        if (!mounted) return;
        setArticle(res.data);

        const cat = res.data?.category;
        if (cat) {
          try {
            const r = await API.get("/api/nutrition-list/", {
              params: { category: cat },
            });
            const list = Array.isArray(r.data)
              ? r.data
              : Array.isArray(r.data?.results)
              ? r.data.results
              : [];
            setRelated(list.filter((a) => a.slug !== res.data.slug));
          } catch {
            setRelated([]);
          }
        }
      } catch (err) {
        if (mounted) {
          setArticle(null);
          setErrorMsg("Article not found.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchArticle();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const img = formatImage(
    article?.featured_image_url || article?.image_url || article?.featured_image
  );
  const dateStr = article?.published_at || article?.created_at;
  
  const videoEmbed = getEmbedUrl(article?.video_url || article?.video);
  const parsedData = useMemo(() => parseArticleContent(article?.content), [article]);
  const detailTabs = useMemo(() => ([
    {
      id: "benefits",
      label: "Benefits / Why It Matters",
      visible: parsedData.benefits.length > 0,
      cardClass: "articleDetailsGlassCard articleDetailsBlockBenefits",
      content: (
        <>
          <h2>Benefits / Why It Matters</h2>
          <ul className="articleDetailsList">
            {parsedData.benefits.map((b, i) => (
              <li key={i} className="articleDetailsListItem">
                <CheckCircle size={20} className="articleDetailsIcon" />
                <span dangerouslySetInnerHTML={{ __html: b }}></span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "steps",
      label: "How To Apply",
      visible: parsedData.steps.length > 0,
      cardClass: "articleDetailsGlassCard articleDetailsBlockSteps",
      content: (
        <>
          <h2>How To Apply</h2>
          <ol className="articleDetailsNumberedList">
            {parsedData.steps.map((s, i) => (
              <li key={i} className="articleDetailsNumberedItem">
                <span className="articleDetailsNumberBadge">{i + 1}</span>
                <span dangerouslySetInnerHTML={{ __html: s }}></span>
              </li>
            ))}
          </ol>
        </>
      ),
    },
    {
      id: "mistakes",
      label: "Common Mistakes",
      visible: parsedData.mistakes.length > 0,
      cardClass: "articleDetailsGlassCard articleDetailsBlockMistakes",
      content: (
        <>
          <h2>Common Mistakes</h2>
          <ul className="articleDetailsList">
            {parsedData.mistakes.map((m, i) => (
              <li key={i} className="articleDetailsListItem">
                <AlertCircle size={20} className="articleDetailsIcon" />
                <span dangerouslySetInnerHTML={{ __html: m }}></span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "tips",
      label: "Coach Tips",
      visible: parsedData.tips.length > 0,
      cardClass: "articleDetailsHighlightedCard articleDetailsBlockTips",
      content: (
        <>
          <h2>Coach Tips</h2>
          <ul className="articleDetailsList">
            {parsedData.tips.map((t, i) => (
              <li key={i} className="articleDetailsListItem">
                <Lightbulb size={20} className="articleDetailsIcon" />
                <span dangerouslySetInnerHTML={{ __html: t }}></span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ]).filter((tab) => tab.visible), [parsedData]);

  useEffect(() => {
    if (detailTabs.length && !detailTabs.some((tab) => tab.id === activeSection)) {
      setActiveSection(detailTabs[0].id);
    }
  }, [detailTabs, activeSection]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    } catch {}
  };

  const shareAction = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article?.title || "");
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    if (platform === "linkedin") window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, "_blank");
    if (platform === "whatsapp") window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    if (platform === "email") window.location.href = `mailto:?subject=${text}&body=Check out this article: ${url}`;
  };

  if (loading) {
    return <div className="articleDetailsLoading">Loading article…</div>;
  }

  if (!article) {
    return (
      <div className="articleDetailsLoading">
        {errorMsg || "Article not found — redirecting…"}
      </div>
    );
  }

  const renderShareButtons = (isMobile) => (
    <div className={`articleDetailsShareWrapper ${isMobile ? 'articleDetailsMobileOnly' : 'articleDetailsDesktopOnly'}`}>
      {!isMobile && <h3 className="articleDetailsShareHeading">Share Article</h3>}
      <div className="articleDetailsShareButtons">
        <button onClick={copyLink} className="articleDetailsShareBtn" title="Copy Link"><LinkIcon size={20} /></button>
        <button onClick={() => shareAction('facebook')} className="articleDetailsShareBtn" title="Facebook"><Facebook size={20} /></button>
        <button onClick={() => shareAction('twitter')} className="articleDetailsShareBtn" title="X (Twitter)"><Twitter size={20} /></button>
        <button onClick={() => shareAction('whatsapp')} className="articleDetailsShareBtn" title="WhatsApp"><MessageCircle size={20} /></button>
        <button onClick={() => shareAction('linkedin')} className="articleDetailsShareBtn" title="LinkedIn"><Linkedin size={20} /></button>
        <button onClick={() => shareAction('email')} className="articleDetailsShareBtn" title="Email"><Mail size={20} /></button>
      </div>
    </div>
  );

  return (
    <div className="articleDetailsPage">
      <div className="articleDetailsContainer">
        
        {/* BACK BUTTON */}
        <button className="articleDetailsBackBtn" onClick={() => navigate(-1)} aria-label="Go Back">
          <ArrowLeft size={24} />
        </button>
        
        {/* HERO SECTION */}
        <motion.div 
          className="articleDetailsHero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Rendered first on mobile via CSS order */}
          <div className="articleDetailsHeroImageWrapper articleDetailsMobileOnly">
            <img src={img} alt={article.title} className="articleDetailsHeroImage" />
          </div>

          <div className="articleDetailsHeroText">
            <span className="articleDetailsCategoryBadge">{article.category || "Fitness"}</span>
            <h1 className="articleDetailsTitle">{article.title}</h1>
            
            <div className="articleDetailsMeta">
              {dateStr && (
                <span className="articleDetailsMetaItem">
                  <Calendar size={18} className="articleDetailsMetaIcon" />
                  {new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
              <span className="articleDetailsMetaItem">
                <User size={18} className="articleDetailsMetaIcon" />
                By {article.author || "RedIron Team"}
              </span>
              {article.category && (
                <span className="articleDetailsMetaItem">
                  <Tag size={18} className="articleDetailsMetaIcon" />
                  {article.category}
                </span>
              )}
            </div>
          </div>
          
          <div className="articleDetailsHeroImageWrapper articleDetailsDesktopOnly">
            <img src={img} alt={article.title} className="articleDetailsHeroImage" />
          </div>
        </motion.div>

        {/* MOBILE SHARE SECTION */}
        {renderShareButtons(true)}

        {/* MAIN TWO-COLUMN GRID */}
        <div className="articleDetailsGrid">
          
          {/* LEFT CONTENT */}
          <div className="articleDetailsMainContent">
            
            {/* Overview Section */}
            <motion.div className="articleDetailsGlassCard articleDetailsBlockOverview" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2>Overview</h2>
              {parsedData.overview && parsedData.overview.length > 0 ? (
                parsedData.overview.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{article.excerpt || "Explore the comprehensive breakdown of this topic below to enhance your training knowledge and execution."}</p>
              )}
            </motion.div>

            {detailTabs.length > 0 && (
              <div className="articleDetailsTabsShell">
                <div className="articleDetailsTabs" role="tablist" aria-label="Article sections">
                  {detailTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeSection === tab.id}
                      className={`articleDetailsTab ${activeSection === tab.id ? "active" : ""}`}
                      onClick={() => setActiveSection(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {detailTabs.filter((tab) => tab.id === activeSection).map((tab) => (
                  <motion.div key={tab.id} className={`${tab.cardClass} articleDetailsTabbedPanel`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}>
                    {tab.content}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Previous / Next Navigation */}
            {related.length >= 2 && (
              <div className="articleDetailsNav">
                <Link to={`/article/${related[0].slug}`} className="articleDetailsNavCard">
                  <span className="articleDetailsNavLabel">Previous Article</span>
                  <span className="articleDetailsNavTitle">{related[0].title}</span>
                </Link>
                <Link to={`/article/${related[1].slug}`} className="articleDetailsNavCard right">
                  <span className="articleDetailsNavLabel">Next Article</span>
                  <span className="articleDetailsNavTitle">{related[1].title}</span>
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="articleDetailsSidebar articleDetailsBlockSidebar">
            <div className="articleDetailsStickySidebar">
              
              {/* DESKTOP SHARE SECTION */}
              {renderShareButtons(false)}

              {/* RELATED ARTICLES SIDEBAR */}
              {related.length > 0 && (
                <div className="articleDetailsRelatedSection">
                  <h3 className="articleDetailsSidebarHeading">Related Articles</h3>
                  <div className="articleDetailsRelatedList">
                    {related.slice(0, 5).map((ra) => (
                      <Link key={ra.slug} to={`/article/${ra.slug}`} className="articleDetailsRelatedCard">
                        <img src={formatImage(ra.featured_image_url || ra.image_url)} alt={ra.title} className="articleDetailsRelatedImg" />
                        <div className="articleDetailsRelatedContent">
                          <span className="articleDetailsRelatedCategory">{ra.category || "Fitness"}</span>
                          <h4>{ra.title}</h4>
                          <span className="articleDetailsRelatedDate">
                            {new Date(ra.published_at || ra.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="articleDetailsRelatedArrow"><ArrowRight size={16}/></div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* VIDEO GUIDE SIDEBAR */}
              {videoEmbed && (
                <div className="articleDetailsVideoSection">
                  <h3 className="articleDetailsSidebarHeading">Watch Video</h3>
                  <div className="articleDetailsVideoWrapper">
                    <iframe src={videoEmbed} allowFullScreen title="Article Video" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MORE FROM CATEGORY */}
        {related.length > 0 && (
          <div className="articleDetailsMoreCategory">
            <h2 className="articleDetailsMoreHeading">More From This Category</h2>
            <div className="articleDetailsMoreGrid">
              {related.slice(0, 4).map((ra) => (
                <Link key={ra.slug} to={`/article/${ra.slug}`} className="articleDetailsMoreCard">
                  <div className="articleDetailsMoreImage">
                    <img src={formatImage(ra.featured_image_url || ra.image_url)} alt={ra.title} />
                    <span className="articleDetailsMoreBadge">{ra.category || "Fitness"}</span>
                  </div>
                  <div className="articleDetailsMoreContent">
                    <h4>{ra.title}</h4>
                    <p>{ra.excerpt || "Click to explore this expert guide..."}</p>
                    <span className="articleDetailsMoreBtn">Read More <ArrowRight size={14}/></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER CTA */}
        <motion.div className="articleDetailsFooterCta" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2>Ready To Transform Your Body?</h2>
          <p>Join RedIron Fitness Today.</p>
          <button className="articleDetailsCtaButton" onClick={() => navigate("/subscribe")}>
            Start Training
          </button>
        </motion.div>

      </div>
    </div>
  );
}
