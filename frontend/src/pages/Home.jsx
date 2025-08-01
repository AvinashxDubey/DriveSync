import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // or use Tailwind if you're using it
import bgImage from '../assets/bg.jpg';

const Home = () => {
  return (
    <div className="home-container"
     style={{
        backgroundImage: `url(${bgImage})`,
      }}>
      <header className="top-bar">
        <Link to="/login" className="login-link">
          Login
        </Link>
      </header>
      <main className="hero-section">
        <h1 className="hero-title">Welcome to DriveSync</h1>
        <p className="hero-subtitle">
          Streamline vehicle software updates, manage registered vehicles, and assign update packages with ease.
        </p>
      </main>
    </div>
  );
};

export default Home;
