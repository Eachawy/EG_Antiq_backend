import "./unathorized.page.css";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { Button } from "primereact/button";
import React from "react";
import { useNavigate } from "react-router";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const handleGoToDashboard = () => {
    if (navigate) {
      navigate("/dashboard");
    }
  };

  const handleGoBack = () => {
    // Go back to dashboard as default
    if (navigate) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="kemetra-403-container">
      <div className="kemetra-403-content">
        {/* 403 Number with Egyptian styling */}
        <div className="kemetra-403-number">
          <span className="kemetra-403-digit">4</span>
          <span className="kemetra-403-digit kemetra-403-digit-middle">0</span>
          <span className="kemetra-403-digit">3</span>
        </div>

        {/* Icon */}
        <div className="kemetra-403-icon">
          <ShieldAlert size={80} strokeWidth={1.5} />
        </div>

        {/* Title and Description */}
        <h1 className="kemetra-403-title">Sacred Chamber Restricted</h1>
        <p className="kemetra-403-description">
          You do not have the authority to enter this archaeological site.
          <br />
          This area is restricted to authorized personnel only.
        </p>

        {/* Permission Notice */}
        <div className="kemetra-403-notice">
          <div className="kemetra-403-notice-icon">
            <ShieldAlert size={20} />
          </div>
          <div className="kemetra-403-notice-text">
            <strong>Access Denied:</strong> Your current privileges do not allow
            access to this resource. Please contact your system administrator if
            you believe this is an error.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="kemetra-403-actions">
          <Button
            label="Go to Dashboard"
            icon={<Home size={18} />}
            onClick={handleGoToDashboard}
            className="kemetra-btn-primary kemetra-403-btn-primary"
          />
          <Button
            label="Go Back"
            icon={<ArrowLeft size={18} />}
            outlined
            onClick={handleGoBack}
            className="kemetra-btn-cancel kemetra-403-btn-secondary"
          />
        </div>

        {/* Footer Note */}
        <div className="kemetra-403-footer">
          <p className="kemetra-403-footer-text">
            If you require access to this area, please request permissions from
            your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
