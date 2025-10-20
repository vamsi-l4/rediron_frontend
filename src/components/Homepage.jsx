import React, { useContext, useState } from "react";
import { FaPhoneAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
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
      <section className="hero-section">
        <div className="hero-overlay">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">The Gym for High Impact Athletes</h1>
            <p className="hero-subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus vehicula ut neque leo, posuere purus arcu.
            </p>
            <div className="hero-buttons">
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
      <section className="contact-info-section">
        <div className="contact-info-container">
          <div className="info-column">
            <div className="info-icon">
              <FaPhoneAlt />
            </div>
            <h3 className="info-title">CONTACT</h3>
            <p className="info-detail">CONTACT@YOURGYM.COM</p>
            <p className="info-detail">+91 98765 43210</p>
          </div>

          <div className="info-column">
            <div className="info-icon">
              <FaClock />
            </div>
            <h3 className="info-title">OPEN HOURS</h3>
            <p className="info-detail">MONDAY - FRIDAY: 6:00AM - 10:00PM</p>
            <p className="info-detail">SATURDAY: 7:00AM - 10:00PM</p>
            <p className="info-detail">SUNDAY: 7:00AM - 10:00PM</p>
          </div>

          <div className="info-column">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <h3 className="info-title">LOCATION</h3>
            <p className="info-detail">8756 S SOMEWHERE ST, LOS ANGELES, CA</p>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="equipment-section">
        <div className="equipment-header">
          <h2 className="section-title equipment-main-title">Discover All Our Equipment</h2>
        </div>

        <div className="equipment-grid">
          {[
            {
              name: "Cardio",
              description:
                "Enhance your endurance and cardiovascular health with our state-of-the-art cardio machines.",
              link: "/equipment/cardio",
              image: "/img/article1.jpg",
            },
            {
              name: "Weight Lifting",
              description:
                "Build strength and muscle with our extensive range of free weights, machines, and power racks.",
              link: "/equipment/weight-lifting",
              image: "/img/article2.jpg",
            },
            {
              name: "Core Training",
              description:
                "Strengthen your core for better posture, stability, and overall athletic performance.",
              link: "/equipment/core-training",
              image: "/img/article3.jpg",
            },
          ].map((equipment, i) => (
            <motion.div
              className="equipment-card"
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.4)" }}
            >
              <div className="equipment-image-wrapper">
                <img src={equipment.image} alt={equipment.name} className="equipment-image" />
              </div>
              <div className="equipment-content">
                <h3 className="equipment-name">{equipment.name}</h3>
                <p className="equipment-description">{equipment.description}</p>
                <Link to={equipment.link} className="view-details-link">
                  View Details
                  <FaArrowRight className="read-link-icon" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="about-section-with-bg">
        <div className="about-content-overlay">
          <div className="about-container">
            <motion.h2
              className="section-title"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              We are not just a gym, we are a whole community
            </motion.h2>
            <motion.p
              className="about-subtitle"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sagittis, diam netus vel eget scelerisque nibh justo, vestibulum. Velit senectus.
            </motion.p>
            <motion.div
              className="hero-buttons"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/subscribe" className="btn-red">
                Subscribe Now
              </Link>
              <Link to="/classes" className="btn-outline">
                Browse Classes
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <BeginnerWorkoutPlan />

      <section className="discover-section">
        <motion.div
          className="discover-overlay"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title discover-title">
            Discover What Makes <br />
            Our Gym Different
            <br />
          </h2>
          <div className="hero-buttons discover-buttons">
            <Link to="/subscribe" className="btn-white">
              Subscribe Now
            </Link>
            <button className="play-video-btn" onClick={handlePlayVideo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="play-icon"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trainers Section */}
      <section className="trainers-section">
        <h2 className="section-title">Our Team of Personal Trainers</h2>
        <div className="trainer-grid">
          {[1, 2, 3].map((id) => (
            <motion.div
              className="trainer-card"
              key={id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: id * 0.2 }}
            >
              <img src={`/img/trainer${id}.jpg`} alt={`Trainer ${id}`} />
              <div className="plus-icon">+</div>
              <h3>
                {id === 1 ? "John Carter" : id === 2 ? "Sophie Moore" : "Dan Clark"}
              </h3>
              <p>Personal Coach</p>
            </motion.div>
          ))}
        </div>
        <div className="center-btn">
          <Link to="/trainers" className="btn-outline">
            Browse Trainers
          </Link>
        </div>
      </section>



      {/* Instagram Section */}
      <section className="instagram-section">
        <div className="instagram-header">
          <h2 className="section-title instagram-title">FOLLOW ON INSTAGRAM</h2>
        </div>

        <div className="instagram-grid-wrapper">
          {instagramImages.map((item, index) => (
            <motion.img
              key={item.id}
              src={item.src}
              alt={item.alt}
              className="insta-grid-item"
              style={{ gridArea: item.gridAreaName }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.5 }}
            />
          ))}
        </div>

        <div className="instagram-footer">
          <Link
            to="https://www.instagram.com/yourgymprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-follow-insta"
          >
            Visit our Instagram
          </Link>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="video-modal-overlay" onClick={closeVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-video-btn" onClick={closeVideo}>×</button>
            <iframe
              width="800"
              height="450"
              src="https://www.youtube.com/embed/3p8EBPVZ2Iw"
              title="Gym Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            ></iframe>
          </div>
        </div>
      )}

    </>
  );
}
