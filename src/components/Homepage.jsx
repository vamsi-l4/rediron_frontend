import React from "react";
import './Homepage.css';
 
const Homepage = () => {
    return (
        <div className="homepage-container">
            <div className="hero-section">
                <h1>🏋️‍♂️ Welcome to RedIron Gym</h1>
                <p>Your journey to fitness starts here!</p>
                <p className="tagline">"push yourself because no on else is going to do it for you."</p>
                <div className="home-buttons">
                    <a href="/equipment" className="btn">View Equipment</a>
                    <a href="/login" className="btn">Member Login</a>
                    <a href="/join" className="btns">Join Now</a>
                </div>    
             </div>
        </div>
    );
}; 
export default Homepage;


    