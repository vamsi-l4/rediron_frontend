import React, { useEffect, useState } from "react";
import "./About.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await API.get('/api/shop-about/');
        const aboutData = res.data.results ? res.data.results[0] : res.data[0];
        setAbout(aboutData);
      } catch (error) {
        console.error('Failed to fetch about:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="about-main rediron-theme">
      <Header />
      <div className="about-content">
        {about ? (
          <div>
            <h2>{about.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: about.content }} />
          </div>
        ) : (
          <div className="no-about">
            <h3>About page content not available.</h3>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default About;
