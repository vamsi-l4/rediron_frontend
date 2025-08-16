import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Article1.css'; // Using a shared CSS file for both components
import BeginnerWorkoutPlan from './BeginnerWorkoutPlan';

// Mock data for individual articles
const articles = [
  {
    id: 1,
    title: "The Complete 4-Week Beginner's Workout Program",
    author: "Your Trainer",
    date: "August 1, 2024",
    image: "https://placehold.co/1200x600/fca5a5/ffffff?text=Compound+Lifts+Guide",
  },
  {
    id: 2,
    title: "Unlocking Your Full Potential with Periodization",
    author: "John Smith",
    date: "August 5, 2024",
    image: "https://placehold.co/1200x600/fdba74/ffffff?text=Periodization+Training",
    content: (
      <>
        <p>
          Have you ever hit a plateau in your workouts? Periodization might be the key to breaking through it. Periodization is a systematic approach to training that involves strategically varying your workout routine over time. It prevents overtraining, reduces the risk of injury, and ensures you're constantly challenging your body in new ways.
        </p>
        <h3>How It Works</h3>
        <p>
          Instead of doing the same workout week after week, periodization breaks your training into distinct cycles:
        </p>
        <ul>
          <li><strong>Macrocycle:</strong> This is your long-term plan, typically 6-12 months, focused on a major goal (e.g., preparing for a competition or gaining 10lbs of muscle).</li>
          <li><strong>Mesocycle:</strong> A smaller phase within the macrocycle, lasting 3-6 weeks. Each mesocycle focuses on a specific goal, like building strength, increasing endurance, or improving power.</li>
          <li><strong>Microcycle:</strong> The smallest unit, usually a single week. This is where you plan your daily workouts and recovery.</li>
        </ul>
        <h3>A Simple Example</h3>
        <p>
          For a beginner, a periodized program might look like this:
        </p>
        <ol>
          <li><strong>Phase 1 (Weeks 1-4):</strong> Focus on Endurance. Lighter weights, higher reps (12-15 reps per set).</li>
          <li><strong>Phase 2 (Weeks 5-8):</strong> Focus on Hypertrophy (Muscle Growth). Moderate weights, moderate reps (8-12 reps per set).</li>
          <li><strong>Phase 3 (Weeks 9-12):</strong> Focus on Strength. Heavier weights, lower reps (4-6 reps per set).</li>
        </ol>
        <p>
          By systematically changing your training, you keep your body adapting and avoid getting stuck. Talk to a trainer or do some research to find a program that fits your goals.
        </p>
      </>
    ),
  },
  {
    id: 4,
    title: "The Best Macros for Muscle Growth",
    author: "Emily Clark",
    date: "July 28, 2024",
    image: "https://placehold.co/1200x600/a3e635/ffffff?text=Muscle+Growth+Macros",
    content: (
      <>
        <p>
          Understanding your macronutrients (macros) is crucial for building muscle. While all three macros (protein, carbs, and fats) are important, they play different roles.
        </p>
        <h3>Protein: The Building Block</h3>
        <p>
          Protein is the most important macro for muscle repair and growth. Aim for a high intake, roughly 1.6-2.2 grams per kilogram of body weight. Sources like chicken, fish, eggs, and whey protein are excellent.
        </p>
        <h3>Carbohydrates: The Energy Source</h3>
        <p>
          Carbs fuel your workouts and help restore muscle glycogen after training. Don't be afraid of them! Focus on complex carbs like oats, brown rice, and sweet potatoes.
        </p>
        <h3>Fats: The Hormone Regulator</h3>
        <p>
          Healthy fats are essential for hormone production and overall health. Don't neglect them. Avocados, nuts, and olive oil are great choices.
        </p>
        <h3>A Simple Macro Split</h3>
        <p>
          A good starting point for a muscle-building diet is roughly:
        </p>
        <ul>
          <li><strong>40% Protein</strong></li>
          <li><strong>40% Carbohydrates</strong></li>
          <li><strong>20% Healthy Fats</strong></li>
        </ul>
        <p>
          Track your intake with a food logging app for a few weeks to get a sense of your macros and adjust as needed.
        </p>
      </>
    ),
  },
  {
    id: 5,
    title: "Post-Workout Recovery: The Best Foods to Eat",
    author: "Emily Clark",
    date: "July 30, 2024",
    image: "https://placehold.co/1200x600/c4b5fd/ffffff?text=Post-Workout+Nutrition",
    content: (
      <>
        <p>
          What you eat after your workout is just as important as the workout itself. The right post-workout meal helps repair muscle tissue, replenish energy stores, and kickstart your recovery.
        </p>
        <h3>The "Anabolic Window"</h3>
        <p>
          While the idea of a 30-minute "anabolic window" has been debated, it's still best to consume a meal or shake within 1-2 hours of finishing your workout. This meal should contain both protein and carbohydrates.
        </p>
        <h3>What to Eat</h3>
        <ul>
          <li>
            <strong>Protein:</strong> Aim for 20-30 grams of high-quality protein to provide the amino acids needed for muscle repair. Examples: a scoop of whey protein, a grilled chicken breast, or Greek yogurt.
          </li>
          <li>
            <strong>Carbohydrates:</strong> Consume 40-60 grams of carbohydrates to replenish glycogen stores. Examples: a banana, a bowl of oats, or sweet potatoes.
          </li>
        </ul>
        <h3>Simple Meal Ideas</h3>
        <ul>
          <li>Whey protein shake with a banana</li>
          <li>Grilled chicken breast with roasted sweet potatoes</li>
          <li>Greek yogurt with berries and a sprinkle of nuts</li>
          <li>Tuna sandwich on whole-wheat bread</li>
        </ul>
        <p>
          Proper post-workout nutrition is a key component of seeing results from your training. Don't skip this important step!
        </p>
      </>
    ),
  },
];

const ArticlePage1 = () => {
  const { id } = useParams();
  const article = articles.find((art) => art.id === parseInt(id));

  if (!article) {
    return (
      <div className="article-page-container">
        <h1>Article Not Found</h1>
        <p>We couldn't find the article you were looking for. Please check the URL.</p>
      </div>
    );
  }

  // Conditionally render the workout plan component for a specific ID
  if (parseInt(id) === 1) {
    return (
      <>
        <Navbar />
        <BeginnerWorkoutPlan />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="article-page-container">
        <article className="article-content">
          <header className="article-header">
            <h1 className="article-title">{article.title}</h1>
            <div className="article-meta">
              <span className="article-author">By {article.author}</span>
              <span className="article-date"> on {article.date}</span>
            </div>
          </header>
          <img src={article.image} alt={article.title} className="article-main-image" />
          <div className="article-body">
            {article.content}
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
};

export default ArticlePage1;
