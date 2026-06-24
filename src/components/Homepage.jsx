import React, { useContext, useState } from "react";
import { FaPhoneAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import BeginnerWorkoutPlan from "./BeginnerWorkoutPlan";
import "./Homepage.css";

export default function Homepage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/subscribe");
    }
  };

  const handleBrowseClassesClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/exercise-videos");
    }
  };

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  const instagramImages = [
    { id: 1, src: "/img/insta1.jpg", alt: "Gym workout 1", gridAreaName: "top1" },
    { id: 2, src: "/img/insta2.jpg", alt: "Gym workout 2", gridAreaName: "top2" },
    { id: 3, src: "/img/insta3.jpg", alt: "Gym workout 3", gridAreaName: "top3" },
    { id: 4, src: "/img/insta4.jpg", alt: "Gym workout 4", gridAreaName: "midLeft" },
    { id: 5, src: "/img/article3.jpg", alt: "Main Gym workout", gridAreaName: "main" },
    { id: 6, src: "/img/insta5.jpg", alt: "Gym workout 5", gridAreaName: "midRight" },
    { id: 7, src: "/img/insta6.jpg", alt: "Gym workout 6", gridAreaName: "bottom1" },
    { id: 8, src: "/img/insta7.jpg", alt: "Gym workout 7", gridAreaName: "bottom2" },
    { id: 9, src: "/img/insta8.jpg", alt: "Gym workout 8", gridAreaName: "bottom3" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="homepage-hero-section">
        <div className="homepage-hero-overlay">
          <motion.div
            className="homepage-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="homepage-hero-title">The Gym for High Impact Athletes</h1>
            <p className="homepage-hero-subtitle">
              RedIron Gym provides state-of-the-art equipment and specialized training programs designed to push your limits, build unparalleled strength, and unleash your true athletic potential.
            </p>
            <div className="homepage-hero-buttons">
              <button onClick={handleSubscribeClick} className="btn-red">
                Subscribe Now
              </button>
              <Link to="/equipment" className="btn-outline">
                Browse Equipment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="homepage-contact-info-section">
        <div className="homepage-contact-info-container">
          <div className="homepage-info-column">
            <div className="homepage-info-icon">
              <FaPhoneAlt />
            </div>
            <h3 className="homepage-info-title">CONTACT</h3>
            <p className="homepage-info-detail">CONTACT@YOURGYM.COM</p>
            <p className="homepage-info-detail">+91 98765 43210</p>
          </div>

          <div className="homepage-info-column">
            <div className="homepage-info-icon">
              <FaClock />
            </div>
            <h3 className="homepage-info-title">OPEN HOURS</h3>
            <p className="homepage-info-detail">MONDAY - FRIDAY: 6:00AM - 10:00PM</p>
            <p className="homepage-info-detail">SATURDAY: 7:00AM - 10:00PM</p>
            <p className="homepage-info-detail">SUNDAY: 7:00AM - 10:00PM</p>
          </div>

          <div className="homepage-info-column">
            <div className="homepage-info-icon">
              <FaMapMarkerAlt />
            </div>
            <h3 className="homepage-info-title">LOCATION</h3>
            <p className="homepage-info-detail">8756 S SOMEWHERE ST, LOS ANGELES, CA</p>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="homepage-equipment-section">
        <motion.h2
          className="homepage-section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Discover All Our Equipment
        </motion.h2>
        <div className="homepage-equipment-grid">
          {["cardio", "weightlifting", "core"].map((type, i) => (
            <motion.div
              key={i}
              className="homepage-equipment-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <img src={`/img/article${i+1}.jpg`} alt={type} />
              <h3 className="homepage-equipment-title-text">{
                  type === "cardio" ? "Cardio" :
                  type === "weightlifting" ? "Weight Lifting" :
                  "Core Training"
                }</h3>
              <Link to={`/equipment/${type === "weightlifting" ? "weight-lifting" : type}`} className="homepage-card-link">
                View Equipment
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="homepage-about-section-with-bg">
        <div className="homepage-about-content-overlay">
          <div className="homepage-about-container">
            <motion.h2
              className="homepage-section-title"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              We are not just a gym, we are a whole community
            </motion.h2>
            <motion.p
              className="homepage-about-subtitle"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Join a supportive network of dedicated athletes. At RedIron, we combine expert coaching, comprehensive nutrition plans, and a motivating environment to help you conquer your fitness goals together.
            </motion.p>
            <motion.div
              className="homepage-hero-buttons"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/subscribe" className="btn-red">
                Subscribe Now
              </Link>
              <button onClick={handleBrowseClassesClick} className="btn-outline">
                Browse Classes
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <BeginnerWorkoutPlan />

      <section className="homepage-discover-section">
        <motion.div
          className="homepage-discover-overlay"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="homepage-section-title homepage-discover-title">
            Discover What Makes <br />
            Our Gym Different
            <br />
          </h2>
          <div className="homepage-hero-buttons homepage-discover-buttons">
            <Link to="/subscribe" className="btn-white">
              Subscribe Now
            </Link>
            <button className="homepage-play-video-btn" onClick={handlePlayVideo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="homepage-play-icon"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trainers Section */}
      <section className="homepage-trainers-section">
        <h2 className="homepage-section-title">Our Team of Personal Trainers</h2>
        <div className="homepage-trainer-grid">
          {[1, 2, 3].map((id) => (
            <motion.div
              className="homepage-trainer-card"
              key={id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: id * 0.2 }}
            >
              <img src={`/img/trainer${id}.jpg`} alt={`Trainer ${id}`} />
              <div className="homepage-plus-icon">+</div>
              <h3>
                {id === 1 ? "John Carter" : id === 2 ? "Sophie Moore" : "Dan Clark"}
              </h3>
              <p>Personal Coach</p>
            </motion.div>
          ))}
        </div>
        <div className="homepage-center-btn">
          <Link to="/trainers" className="btn-outline">
            Browse Trainers
          </Link>
        </div>
      </section>



      {/* Instagram Section */}
      <section className="homepage-instagram-section">
        <div className="homepage-instagram-header">
          <h2 className="homepage-section-title homepage-instagram-title">FOLLOW ON INSTAGRAM</h2>
        </div>

        <div className="homepage-instagram-grid-wrapper">
          {instagramImages.map((item, index) => (
            <motion.img
              key={item.id}
              src={item.src}
              alt={item.alt}
              className="homepage-insta-grid-item"
              style={{ gridArea: item.gridAreaName }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.5 }}
            />
          ))}
        </div>

        <div className="homepage-instagram-footer">
          <Link
            to="https://www.instagram.com/yourgymprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="homepage-btn-follow-insta"
          >
            Visit our Instagram
          </Link>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="homepage-video-modal-overlay" onClick={closeVideo}>
          <div className="homepage-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="homepage-close-video-btn" onClick={closeVideo}>×</button>
            <iframe
              width="800"
              height="450"
              src="https://www.youtube.com/embed/tUykoP30Gb0"
              title="Gym Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="homepage-video-iframe"
            ></iframe>
          </div>
        </div>
      )}

    </>
  );
}
