// src/components/AboutUs.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBullseye, FaGlobe, FaHandshake, FaChartLine, FaVideo, FaAppleAlt } from 'react-icons/fa';
import "./AboutUs.css"; // external stylesheet
import trainer1 from '../assets/trainer1.png';
import trainer2 from '../assets/trainer2.png';
import trainer3 from '../assets/trainer3.png';
import trainer4 from '../assets/trainer4.png';
import trainer5 from '../assets/trainer5.png';
import trainer6 from '../assets/trainer6.png';

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
          <div className="aboutus-hero-overlay"></div>

        <div className="aboutus-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="aboutus-hero-grid"
          >
            {/* Left */}
            <div className="aboutus-hero-content">
              <h1>RedIron Gym <span>Strength, Science & Community</span></h1>
              <p>
                Built for people who want to train smarter — our methods mix
                proven strength training science with real-world coaching. We
                obsess over movement quality, progressive overload, recovery,
                and habit design. No fluff. All results.
              </p>
              <div className="aboutus-hero-buttons">
                <button className="aboutus-btn-primary" onClick={() => requireAuth('/equipment')}>
                  Explore Programs
                </button>
                <a href="#team" className="aboutus-btn-outline">
                  Meet Our Coaches
                </a>
              </div>
            </div>

            {/* Right card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="aboutus-hero-card"
            >
              <div className="aboutus-card-top">
                <div>
                  <h3>Our Promise</h3>
                  <p>Sustainable progress, expert coaching, data-driven plans.</p>
                </div>
                <div className="aboutus-stat">
                  <div className="aboutus-stat-number">
                    {stats.members.toLocaleString()}
                  </div>
                  <div className="aboutus-stat-label">Active Members</div>
                </div>
              </div>

              <hr />

              <div className="aboutus-card-stats">
                <div>
                  <div className="aboutus-stat-number">{stats.trainers}</div>
                  <div className="aboutus-stat-label">Certified Coaches</div>
                </div>
                <div>
                  <div className="aboutus-stat-number">{stats.programs}</div>
                  <div className="aboutus-stat-label">Training Programs</div>
                </div>
                <div>
                  <div className="aboutus-stat-number">98%</div>
                  <div className="aboutus-stat-label">Client Retention</div>
                </div>
              </div>

              <div className="aboutus-card-buttons">
                <button className="aboutus-btn-gradient" onClick={() => requireAuth('/signup')}>
                  Start Free Trial
                </button>
                <button className="aboutus-btn-outline-small" onClick={() => requireAuth('/contact')}>
                  Contact Sales
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="aboutus-mission-section">
        <motion.div
          className="aboutus-mission-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.12 }}
        >
          {[
            { title: "Mission", body: "Empower everyone to achieve their peak physical potential through elite coaching.", icon: <FaBullseye /> },
            { title: "Vision", body: "A world where evidence-backed fitness is accessible, sustainable, and transformative.", icon: <FaGlobe /> },
            { title: "Values", body: "Integrity in coaching, consistency in effort, and community in struggle.", icon: <FaHandshake /> },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="aboutus-mission-card"
            >
              <div className="aboutus-icon-wrapper">{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team */}
      <section id="team" className="aboutus-team-section">
        <h2>Meet The RedIron Coaches</h2>
        <div className="aboutus-team-grid">
          {[
            {
              name: "John Carter",
              title: "Head Strength Coach",
              bio: "With over 10 years of experience, John specializes in building raw power and functional strength. He has transformed hundreds of athletes from beginners to elite competitors.",
              img: trainer1,
            },
            {
              name: "Sophie Moore",
              title: "HIIT & Conditioning Expert",
              bio: "Sophie brings relentless energy to every session. Her high-intensity interval training methods are designed to maximize fat loss while building serious cardiovascular endurance.",
              img: trainer2,
            },
            {
              name: "Dan Clark",
              title: "Performance & Nutrition",
              bio: "Dan combines athletic performance training with precision nutrition. He believes that what you do in the kitchen is just as important as what you do on the gym floor.",
              img: trainer3,
            },
            {
              name: "Emma Wilson",
              title: "Mobility & Recovery Specialist",
              bio: "Emma focuses on keeping you injury-free. Her expertise in biomechanics and mobility ensures you can train harder, recover faster, and move with perfect mechanics.",
              img: trainer4,
            },
            {
              name: "Marcus Johnson",
              title: "Bodybuilding Coach",
              bio: "Marcus is a former competitive bodybuilder who knows exactly what it takes to sculpt a stage-ready physique. He focuses on mind-muscle connection and precise programming.",
              img: trainer5,
            },
            {
              name: "Sarah Davis",
              title: "Functional Fitness",
              bio: "Sarah’s training philosophy revolves around movements that improve your daily life. She mixes kettlebells, suspension training, and calisthenics for a well-rounded physique.",
              img: trainer6,
            },
          ].map((m) => (
            <motion.article
              key={m.name}
              whileHover={{ scale: 1.03 }}
              className="aboutus-team-card"
            >
              <div className="aboutus-avatar">
                <img src={m.img} alt={`${m.name}`} />
              </div>
              <h5>{m.name}</h5>
              <div className="aboutus-role">{m.title}</div>
              <p>{m.bio}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* AI features */}
      <section id="ai-features" className="aboutus-features-section">
        <h3>AI-powered Performance Tools</h3>
        <div className="aboutus-features-grid">
          {[
            { title: "Smart Progress Tracker", desc: "Auto-adjusts microcycles based on your daily performance.", icon: <FaChartLine /> },
            { title: "Form Analyzer", desc: "Upload short clips for instant AI biomechanical feedback.", icon: <FaVideo /> },
            { title: "Nutrition Planner", desc: "Personalized weekly plans mapped to your macros.", icon: <FaAppleAlt /> },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="aboutus-feature-card"
            >
              <div className="aboutus-icon-wrapper">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
              <div className="aboutus-feature-btn-wrap">
                <button className="aboutus-btn-primary">Learn More</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="aboutus-cta">
        <div className="aboutus-cta-container">
          <h2>Ready to Shatter Your Limits?</h2>
          <p>Join RedIron Gym today and experience the difference of elite coaching.</p>
          <div className="aboutus-cta-buttons">
            <button className="aboutus-btn-primary" onClick={() => requireAuth('/signup')}>Join Now</button>
            <button className="aboutus-btn-outline" onClick={() => requireAuth('/contact')}>Contact Us</button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
