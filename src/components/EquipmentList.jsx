import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdFavorite } from "react-icons/md";
import { GiWeightLiftingUp, GiAbdominalArmor } from "react-icons/gi";
import "./EquipmentList.css";

const EquipmentList = () => {
    const pageBackgroundStyle = {
    background: 'radial-gradient(circle at top left, rgba(255, 30, 30, 0.18), transparent 25%), radial-gradient(circle at bottom right, rgba(255, 0, 0, 0.12), transparent 20%), #040404',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
  const equipmentCards = [
    {
      id: 1,
      title: "Cardio Training",
      Icon: MdFavorite,
      description: "Explore our best-in-class cardio equipment",
      image: "/assets/eqp_cardio.png",
      link: "/equipment/cardio",
    },
    {
      id: 2,
      title: "Strength Training",
      Icon: GiWeightLiftingUp,
      description: "Explore our best-in-class strength equipment",
      image: "/assets/eqp_strength.png",
      link: "/equipment/strength",
    },
    {
      id: 3,
      title: "Core Training",
      Icon: GiAbdominalArmor,
      description: "Explore our best-in-class core equipment",
      image: "/assets/eqp_core.png",
      link: "/equipment/core",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

return (
    <div style={pageBackgroundStyle} className="equipment-page1">
      <div className="equipment-section1">
        <div className="equipment-header1">
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="equipment-title1"
          >
            EQUIPMENT
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="equipment-subtitle1"
          >
            Explore our top-of-the-line gym equipment tailored for every aspect of your fitness journey.
          </motion.p>
        </div>

        <motion.div
          className="equipment-cards1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {equipmentCards.map((card) => {
            const Icon = card.Icon;
            return (
              <motion.div
                key={card.id}
                className="equipment-card1"
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div
                  className="equipment-card-bg1"
                  style={{ backgroundImage: `url(${card.image})` }}
                />

                <div className="equipment-card-content1">
                  <div className="equipment-card-top1">
                    <Icon className="equipment-card-icon1" />
                  </div>

                  <div className="equipment-card-bottom1">
                    <h3 className="equipment-card-bottom-title1">
                      {card.title}
                    </h3>
                    <p className="equipment-card-bottom-copy1">
                      {card.description}
                    </p>
                    <Link to={card.link} className="equipment-card-button1">
                      View Equipment
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default EquipmentList;