import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Article.css'; // The dedicated CSS file for styling

// Data for the article categories, including workout and nutrition posts
const articleCategories = [
  {
    name: "Workout Routines",
    description: "Discover a variety of workout plans tailored for different goals and skill levels.",
    posts: [
      { id: 1, title: "Full Body Strength Training for Beginners", date: "August 1, 2024", image: "https://placehold.co/800x600/fca5a5/ffffff?text=Full+Body+Workout" },
      { id: 2, title: "Advanced HIIT for Fat Loss and Endurance", date: "August 5, 2024", image: "https://placehold.co/800x600/fdba74/ffffff?text=HIIT+Training" },
      { id: 3, title: "The Ultimate 4-Week Muscle-Building Program", date: "August 10, 2024", image: "https://placehold.co/800x600/93c5fd/ffffff?text=Muscle+Building" },
    ],
  },
  {
    name: "Nutrition & Diet",
    description: "Learn how to fuel your body with healthy eating tips, recipes, and meal plans.",
    posts: [
      { id: 4, title: "Pre-Workout Fuel: What to Eat for Optimal Performance", date: "July 28, 2024", image: "https://placehold.co/800x600/a3e635/ffffff?text=Pre-Workout+Meal" },
      { id: 5, title: "Post-Workout Recovery: The Best Foods to Eat", date: "July 30, 2024", image: "https://placehold.co/800x600/c4b5fd/ffffff?text=Post-Workout+Meal" },
      { id: 6, title: "Simple, High-Protein Recipes You Can Make in 20 Minutes", date: "August 2, 2024", image: "https://placehold.co/800x600/fcd34d/ffffff?text=Protein+Recipes" },
    ],
  },
  {
    name: "Supplements & Wellness",
    description: "Understand the role of supplements and other wellness strategies in your fitness journey.",
    posts: [
      { id: 7, title: "Creatine: A Beginner's Guide to the Most Popular Supplement", date: "August 8, 2024", image: "https://placehold.co/800x600/f87171/ffffff?text=Creatine+Guide" },
      { id: 8, title: "Vitamins and Minerals Essential for Athletes", date: "August 12, 2024", image: "https://placehold.co/800x600/67e8f9/ffffff?text=Athlete+Vitamins" },
    ],
  },
];

const ArticlePage = () => {
  return (
    <>
      <Navbar />
      <div className="article-page-container">
        <header className="article-header">
          <h1>Our Blog & Articles</h1>
          <p>
            Stay motivated and informed with our latest articles on workouts, nutrition, and wellness.
          </p>
        </header>

        {articleCategories.map((category, index) => (
          <section className="article-section" key={index}>
            <div className="section-header">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>
            <div className="article-grid">
              {category.posts.map((post) => (
                <div className="article-card" key={post.id}>
                  <img src={post.image} alt={post.title} className="article-image" />
                  <div className="card-content">
                    <p className="article-date">{post.date}</p>
                    <h3 className="article-title">{post.title}</h3>
                    <Link to={`/articles/${post.id}`} className="read-more-link">
                      Read More <FaArrowRight className="link-icon" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default ArticlePage;
