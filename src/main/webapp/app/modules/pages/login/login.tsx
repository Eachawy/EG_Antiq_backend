import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Translate, Storage } from "react-jhipster";
import { login } from "app/shared/reducers/authentication";
import { setLocale } from "app/shared/reducers/locale";
import { setTextDirection } from "app/config/translation";
const LoginPage = (pops) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const $isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );
  const loading = useAppSelector((state) => state.authentication.loading);

  // React.useEffect(() => {
  //   Storage.session.set("locale", "ar");
  //   dispatch(setLocale("ar"));
  //   setTextDirection("ar");
  // }, []);

  if ($isAuthenticated) {
    navigate("/dashoard");
  }

  const handleLogin = (values) => {
    dispatch(login(values.username, values.password));
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
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="kemetra-login-form"
          >
            {/* Email Field */}
            <div>
              <label htmlFor="username" className="kemetra-login-label">
                <Translate contentKey="global.form.username.label">
                  Username
                </Translate>
              </label>
              <Controller
                name="username"
                control={control}
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <div className="kemetra-login-input-wrapper">
                    <Mail size={18} className="kemetra-login-input-icon" />
                    <InputText
                      {...field}
                      id="email"
                      autoComplete="username"
                      placeholder="Username"
                      className={`kemetra-login-input ${errors.username ? "p-invalid" : ""}`}
                      data-cy="username"
                    />
                  </div>
                )}
              />
              {errors.username && (
                <small className="kemetra-login-error">
                  {errors.username.message}
                </small>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="kemetra-login-label">
                <Translate contentKey="login.form.password">Password</Translate>
              </label>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <div className="kemetra-login-password-wrapper">
                    <Lock size={18} className="kemetra-login-input-icon" />
                    <Password
                      {...field}
                      id="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      className={`password-field-full-width ${errors.password ? "p-invalid" : ""}`}
                      inputClassName="w-full"
                      toggleMask
                      feedback={false}
                      data-cy="password"
                      pt={{
                        root: { style: { width: "100%" } },
                        input: { style: { width: "100%" } },
                      }}
                    />
                  </div>
                )}
              />
              {errors.password && (
                <small className="mt-1 text-red-600">
                  {errors.password.message}
                </small>
              )}
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
