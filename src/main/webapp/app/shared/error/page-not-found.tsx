import "./page-not-found.css";
import { Home, MapPin, Search } from "lucide-react";
import { Button } from "primereact/button";
import React from "react";
import { useNavigate } from "react-router";

const PageNotFound = () => {
  const navigate = useNavigate();
  const handleGoToDashboard = () => {
    if (navigate) {
      navigate("/dashboard");
    }
  };

  const handleGoToPage = (page: string) => {
    if (navigate) {
      navigate(page);
    }
  };
  return (
    <div className="kemetra-404-container">
      <div className="kemetra-404-content">
        {/* 404 Number with Egyptian styling */}
        <div className="kemetra-404-number">
          <span className="kemetra-404-digit">4</span>
          <span className="kemetra-404-digit kemetra-404-digit-middle">0</span>
          <span className="kemetra-404-digit">4</span>
        </div>

        {/* Icon */}
        <div className="kemetra-404-icon">
          <MapPin size={80} strokeWidth={1.5} />
        </div>

        {/* Title and Description */}
        <h1 className="kemetra-404-title">Lost in the Sands of Time</h1>
        <p className="kemetra-404-description">
          The archaeological site you&apos;re looking for has been lost to
          history.
          <br />
          This page doesn&apos;t exist or may have been moved.
        </p>

        {/* Action Buttons */}
        <div className="kemetra-404-actions">
          <Button
            label="Go to Dashboard"
            icon={<Home size={18} />}
            onClick={handleGoToDashboard}
            className="kemetra-btn-primary kemetra-404-btn-primary"
          />
        </div>

        {/* Quick Links */}
        <div className="kemetra-404-quick-links">
          <p className="kemetra-404-quick-links-title">
            Explore these ancient paths:
          </p>
          <div className="kemetra-404-links-grid">
            <button
              onClick={() => handleGoToPage("/monuments")}
              className="kemetra-404-link"
            >
              Monuments
            </button>
            <button
              onClick={() => handleGoToPage("/gallery")}
              className="kemetra-404-link"
            >
              Gallery
            </button>
            <button
              onClick={() => handleGoToPage("/monumentsType")}
              className="kemetra-404-link"
            >
              Types
            </button>
            <button
              onClick={() => handleGoToPage("/eras")}
              className="kemetra-404-link"
            >
              Eras
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="kemetra-404-footer">
          <Search size={16} className="kemetra-404-footer-icon" />
          <span className="kemetra-404-footer-text">
            KEMETRA - Where Egypt&apos;s History Meets the Map
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
