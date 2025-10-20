// src/components/AboutUs.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./AboutUs.css"; // external stylesheet

export default function AboutUs() {
  const [stats, setStats] = useState({
    members: 0,
    trainers: 0,
    programs: 0,
  });

  // Animated counter
  useEffect(() => {
    const target = { members: 5200, trainers: 28, programs: 46 };
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      setStats({
        members: Math.floor(target.members * easeOutCubic(t)),
        trainers: Math.floor(target.trainers * easeOutCubic(t)),
        programs: Math.floor(target.programs * easeOutCubic(t)),
      });
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    function easeOutCubic(x) {
      return 1 - Math.pow(1 - x, 3);
    }
  }, []);
    

  // Auth check for button navigation
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const requireAuth = (target) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(target);
    }
  };

  return (
    <>
      <div className="aboutus-wrapper">
        {/* Hero */}
        <section className="aboutus-hero">
          <div className="hero-background">
            <svg className="hero-gradient" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#8b0000" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#ff0047" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)" />
          </svg>
        </div>

        <div className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hero-grid"
          >
            {/* Left */}
            <div className="hero-content">
              <h1>RedIron Gym — Strength, Science & Community</h1>
              <p>
                Built for people who want to train smarter — our methods mix
                proven strength training science with real-world coaching. We
                obsess over movement quality, progressive overload, recovery,
                and habit design. No fluff. All results.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => requireAuth('/equipment')}>
                  Explore Programs
                </button>
                <a href="#team" className="btn-outline">
                  Meet Our Coaches
                </a>
              </div>
            </div>

            {/* Right card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="hero-card"
            >
              <div className="card-top">
                <div>
                  <h3>Our Promise</h3>
                  <p>Sustainable progress, expert coaching, data-driven plans.</p>
                </div>
                <div className="stat">
                  <div className="stat-number">
                    {stats.members.toLocaleString()}
                  </div>
                  <div className="stat-label">Active Members</div>
                </div>
              </div>

              <hr />

              <div className="card-stats">
                <div>
                  <div className="stat-number">{stats.trainers}</div>
                  <div className="stat-label">Certified Coaches</div>
                </div>
                <div>
                  <div className="stat-number">{stats.programs}</div>
                  <div className="stat-label">Training Programs</div>
                </div>
                <div>
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Client Retention</div>
                </div>
              </div>

              <div className="card-buttons">
                <button className="btn-gradient" onClick={() => requireAuth('/signup')}>
                  Start Free Trial
                </button>
                <button className="btn-outline-small" onClick={() => requireAuth('/contact')}>
                  Contact Sales
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section">
        <motion.div
          className="mission-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.12 }}
        >
          {[
            { title: "Mission", body: "Empower everyone...", emoji: "🎯" },
            {
              title: "Vision",
              body: "A world where evidence-backed...",
              emoji: "🌍",
            },
            {
              title: "Values",
              body: "Integrity, consistency...",
              emoji: "🤝",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="mission-card"
            >
              <div className="emoji">{c.emoji}</div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team */}
      <section id="team" className="team-section">
        <h2>Meet The RedIron Coaches</h2>
        <div className="team-grid">
          {[
            {
              name: "Arjun Patel",
              title: "Head Coach",
              bio: "Strength & conditioning specialist",
              img: "/images/team/arjun.jpg",
            },
            {
              name: "Sneha Rao",
              title: "Nutrition Coach",
              bio: "Sports nutritionist",
              img: "/images/team/sneha.jpg",
            },
            {
              name: "Rohit Singh",
              title: "Coach",
              bio: "Functional training & mobility",
              img: "/images/team/rohit.jpg",
            },
            {
              name: "Maya Verma",
              title: "Coach",
              bio: "Hypertrophy & programming",
              img: "/images/team/maya.jpg",
            },
          ].map((m) => (
            <motion.article
              key={m.name}
              whileHover={{ scale: 1.03 }}
              className="team-card"
            >
              <div className="avatar">
                <img src={m.img} alt={`${m.name}`} />
              </div>
              <h5>{m.name}</h5>
              <div className="role">{m.title}</div>
              <p>{m.bio}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* AI features */}
      <section id="ai-features" className="features-section">
        <h3>AI-powered Performance Tools</h3>
        <div className="features-grid">
          {[
            {
              title: "Smart Progress Tracker",
              desc: "Auto-adjusts microcycles...",
            },
            { title: "Form Analyzer", desc: "Upload short clips..." },
            { title: "Nutrition Planner", desc: "Personalized weekly plans..." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="feature-card"
            >
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
              <div className="feature-btn-wrap">
                <button className="btn-primary">Learn More</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <div className="brand">RedIron Gym</div>
            <div className="tagline">Stronger. Smarter. Together.</div>
          </div>
          <div className="footer-buttons">
            <Link to="/signup" className="btn-primary">
              Join Now
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
