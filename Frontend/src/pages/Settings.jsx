// src/pages/Settings.jsx
import React, { useState, useEffect } from "react"; // ✅ YEH LINE MISSING THI
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faTrashCan,
  faDownload,
  faCircleQuestion,
  faArrowLeft,
  faGear,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import GlitterBackground from "../components/GlitterBackground";

function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <GlitterBackground>
      <div className="settings-page">
        <div className="settings-container">
          <div className="settings-header">
            <Link to="/" className="back-btn-settings">
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </Link>
            <h1>
              <FontAwesomeIcon icon={faGear} className="icon-primary" />{" "}
              Settings
            </h1>
          </div>

          <div className="settings-grid">
            {/* 1. Theme Mode */}
            <div className="settings-card">
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faPalette} className="card-icon" />
              </div>
              <h3>Theme Mode</h3>
              <div className="theme-toggle-container">
                <span className={theme === "dark" ? "active-theme" : ""}>
                  <FontAwesomeIcon icon={faMoon} /> Dark
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={theme === "light"}
                    onChange={toggleTheme}
                  />
                  <span className="slider round"></span>
                </label>
                <span className={theme === "light" ? "active-theme" : ""}>
                  <FontAwesomeIcon icon={faSun} /> Light
                </span>
              </div>
            </div>

            {/* 2. All Downloads */}
            <Link to="/downloads" className="settings-card link-card">
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faDownload} className="card-icon" />
              </div>
              <h3>All Downloads</h3>
              <p>View your download history</p>
              <span className="card-arrow">&rarr;</span>
            </Link>

            {/* 3. Trash */}
            <Link to="/trash" className="settings-card link-card">
              <div className="card-icon-wrapper">
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="card-icon trash-icon"
                />
              </div>
              <h3>Trash</h3>
              <p>Recover deleted reels (30 days)</p>
              <span className="card-arrow">&rarr;</span>
            </Link>

            {/* 4. Help Center */}
            {/* 4. Help Center */}
            <div className="settings-card help-card">
              <div className="card-icon-wrapper">
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="card-icon"
                />
              </div>
              <h3>Help Center</h3>
              <div className="help-steps">
                <div className="step">
                  <span className="step-num">1</span>
                  <p>
                    Go to <strong>Home</strong> & upload{" "}
                    <strong>2-100 images</strong>
                  </p>
                </div>
                <div className="step">
                  <span className="step-num">2</span>
                  <p>
                    Choose your preferred <strong>Template</strong> & Music
                  </p>
                </div>
                <div className="step">
                  <span className="step-num">3</span>
                  <p>
                    Click <strong>"Create Reel"</strong> & wait for AI
                    processing
                  </p>
                </div>
                <div className="step">
                  <span className="step-num">4</span>
                  <p>
                    Access all your reels in <strong>"All Reels"</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlitterBackground>
  );
}

export default Settings;
