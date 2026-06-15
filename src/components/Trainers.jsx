import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import './Trainers.css';

import trainer1 from '../assets/trainer1.png';
import trainer2 from '../assets/trainer2.png';
import trainer3 from '../assets/trainer3.png';
import trainer4 from '../assets/trainer4.png';
import trainer5 from '../assets/trainer5.png';
import trainer6 from '../assets/trainer6.png';

const trainersData = [
  {
    id: 1,
    name: 'John Carter',
    role: 'Head Strength Coach',
    image: trainer1,
    bio: 'With over 10 years of experience, John specializes in building raw power and functional strength. He has transformed hundreds of athletes from beginners to elite competitors.',
    specialties: ['Powerlifting', 'Hypertrophy', 'Injury Rehab'],
  },
  {
    id: 2,
    name: 'Sophie Moore',
    role: 'HIIT & Conditioning Expert',
    image: trainer2,
    bio: 'Sophie brings relentless energy to every session. Her high-intensity interval training methods are designed to maximize fat loss while building serious cardiovascular endurance.',
    specialties: ['HIIT', 'Fat Loss', 'Agility'],
  },
  {
    id: 3,
    name: 'Dan Clark',
    role: 'Performance & Nutrition',
    image: trainer3,
    bio: 'Dan combines athletic performance training with precision nutrition. He believes that what you do in the kitchen is just as important as what you do on the gym floor.',
    specialties: ['Athletic Performance', 'Diet Planning', 'Muscle Gain'],
  },
  {
    id: 4,
    name: 'Emma Wilson',
    role: 'Mobility & Recovery Specialist',
    image: trainer4,
    bio: 'Emma focuses on keeping you injury-free. Her expertise in biomechanics and mobility ensures you can train harder, recover faster, and move with perfect mechanics.',
    specialties: ['Mobility', 'Yoga', 'Pre-hab'],
  },
  {
    id: 5,
    name: 'Marcus Johnson',
    role: 'Bodybuilding Coach',
    image: trainer5,
    bio: 'Marcus is a former competitive bodybuilder who knows exactly what it takes to sculpt a stage-ready physique. He focuses on mind-muscle connection and precise programming.',
    specialties: ['Bodybuilding', 'Contest Prep', 'Posing'],
  },
  {
    id: 6,
    name: 'Sarah Davis',
    role: 'Functional Fitness',
    image: trainer6,
    bio: 'Sarah’s training philosophy revolves around movements that improve your daily life. She mixes kettlebells, suspension training, and calisthenics for a well-rounded physique.',
    specialties: ['Kettlebells', 'Calisthenics', 'Functional Strength'],
  }
];

const Trainers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="trainers-page">
      {/* Hero Section */}
      <section className="trainers-hero">
        <div className="trainers-hero-overlay">
          <motion.div
            className="trainers-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="trainers-hero-title">Meet Our Elite Trainers</h1>
            <p className="trainers-hero-subtitle">
              Expert guidance, personalized programming, and relentless motivation. Our team is here to help you shatter your limits.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="trainers-grid-section">
        <div className="trainers-container">
          <div className="trainers-grid">
            {trainersData.map((trainer, index) => (
              <motion.div 
                key={trainer.id} 
                className="trainer-detail-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="trainer-image-container">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="trainer-full-image"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x500/1a1a1a/b20d23?text=${trainer.name.replace(' ', '+')}`;
                    }}
                  />
                  <div className="trainer-socials">
                    <a href="#instagram" aria-label="Instagram"><FaInstagram size={20} /></a>
                    <a href="#twitter" aria-label="Twitter"><FaTwitter size={20} /></a>
                    <a href="#facebook" aria-label="Facebook"><FaFacebookF size={20} /></a>
                  </div>
                </div>
                <div className="trainer-info">
                  <h2 className="trainer-name">{trainer.name}</h2>
                  <h3 className="trainer-role">{trainer.role}</h3>
                  <p className="trainer-bio">{trainer.bio}</p>
                  
                  <div className="trainer-specialties">
                    <h4>Specialties:</h4>
                    <div className="specialty-tags">
                      {trainer.specialties.map((spec, i) => (
                        <span key={i} className="specialty-tag">{spec}</span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="book-trainer-btn">Book a Session</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="trainers-cta">
        <div className="trainers-cta-content">
          <h2>Ready to transform your life?</h2>
          <p>Don't wait for tomorrow. Start working with our elite coaches today and unlock your true potential.</p>
          <button className="btn-red-large">Get Started Now</button>
        </div>
      </section>
    </div>
  );
};

export default Trainers;