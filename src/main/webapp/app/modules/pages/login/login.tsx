import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Mail, Lock, ArrowRight } from "lucide-react";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (emails: string) => {
    if (!emails) {
      setEmailError("");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emails)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (email) {
      validateEmail(email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <div className="kemetra-login-container">
      {/* Left Section - Background Image with Overlay */}
      <div className="kemetra-login-hero">
        {/* Background Image */}
        <div className="kemetra-login-hero-bg" />

        {/* Dark Gradient Overlay */}
        <div className="kemetra-login-hero-overlay" />

        {/* Content Overlay */}
        <div className="kemetra-login-hero-content">
          <div className="max-w-xl">
            <h1 className="kemetra-login-hero-title">KEMETRA</h1>
            <p className="kemetra-login-hero-subtitle">
              Where Egypt&apos;s History Meets the Map
            </p>
            <div className="kemetra-login-hero-divider" />
            <p className="kemetra-login-hero-description">
              Preserving and mapping the timeless treasures of ancient Egypt.
              Explore millennia of history through our comprehensive heritage
              management platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="kemetra-login-form-section">
        {/* Blurred Background Image */}
        <div className="kemetra-login-form-bg-blur" />

        {/* Light overlay for readability */}
        <div className="kemetra-login-form-overlay" />

        {/* Login Panel */}
        <div className="kemetra-login-panel">
          {/* Mobile Logo/Title */}
          <div className="kemetra-login-mobile-logo">
            <h1 className="kemetra-login-mobile-title">KEMETRA</h1>
            <p className="kemetra-login-mobile-subtitle">
              Where Egypt&apos;s History Meets the Map
            </p>
          </div>

          {/* Welcome Text */}
          <div className="kemetra-login-welcome">
            <h2 className="kemetra-login-welcome-title">Welcome Back</h2>
            <p className="kemetra-login-welcome-subtitle">
              Sign in to access your heritage dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="kemetra-login-form">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="kemetra-login-label">
                Email Address
              </label>
              <div className="kemetra-login-input-wrapper">
                <Mail size={18} className="kemetra-login-input-icon" />
                <InputText
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="your.email@kemetra.com"
                  className="kemetra-login-input"
                />
              </div>
              {emailError && (
                <p className="kemetra-login-error">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="kemetra-login-label">
                Password
              </label>
              <div className="kemetra-login-password-wrapper">
                <Lock size={18} className="kemetra-login-input-icon" />
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  toggleMask
                  feedback={false}
                  className="password-field-full-width"
                  inputClassName="w-full"
                  pt={{
                    root: { style: { width: "100%" } },
                    input: { style: { width: "100%" } },
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                label="Sign In"
                icon={<ArrowRight size={20} />}
                iconPos="right"
                loading={loading}
                disabled={loading}
                className="kemetra-login-submit"
              />
            </div>
          </form>

          {/* Divider */}
          <div className="kemetra-login-footer">
            <p className="kemetra-login-copyright">
              © 2024 KEMETRA Heritage Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
