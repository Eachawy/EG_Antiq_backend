import "./login.scss";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Translate } from "react-jhipster";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

import { useAppDispatch, useAppSelector } from "app/config/store";
import { login } from "app/shared/reducers/authentication";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { ToastContainer } from "react-toastify";

type LoginProps = Record<string, never>;

type LoginFormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export const Login = (props: LoginProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated,
  );
  const loginError = useAppSelector((state) => state.authentication.loginError);
  const loading = useAppSelector((state) => state.authentication.loading);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleLogin = (values: LoginFormValues) => {
    dispatch(login(values.username, values.password, values.rememberMe));
  };

  const from = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Background Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1561531526-68a24a396f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXJhbWlkcyUyMHN1bnNldCUyMGVneXB0fGVufDF8fHx8MTc2Njg0MDE4MXww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        />

        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(40, 30, 20, 0.6) 50%, rgba(0, 0, 0, 0.8) 100%)",
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <div className="max-w-xl">
            <h1
              className="text-6xl mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                letterSpacing: "0.02em",
                textShadow: "2px 4px 8px rgba(0, 0, 0, 0.5)",
              }}
            >
              KEMETRA
            </h1>
            <p
              className="text-2xl mb-8 opacity-90"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              Where Egypt&apos;s History Meets the Map
            </p>
            <div
              className="h-1 w-32 mb-6"
              style={{
                background:
                  "linear-gradient(90deg, #C9A24D 0%, rgba(201, 162, 77, 0) 100%)",
              }}
            />
            <p className="text-lg leading-relaxed opacity-80">
              Preserving and mapping the timeless treasures of ancient Egypt.
              Explore millennia of history through our comprehensive heritage
              management platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1561531526-68a24a396f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXJhbWlkcyUyMHN1bnNldCUyMGVneXB0fGVufDF8fHx8MTc2Njg0MDE4MXww&ixlib=rb-4.1.0&q=80&w=1080')`,
            filter: "blur(60px)",
            transform: "scale(1.1)",
          }}
        />

        {/* Light overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(245, 230, 211, 0.3)",
          }}
        />

        {/* Login Panel */}
        <div
          className="relative z-10 w-full max-w-md p-10 rounded-2xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Mobile Logo/Title */}
          <div className="lg:hidden text-center mb-8">
            <h1
              className="text-4xl mb-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                color: "#3D2817",
              }}
            >
              KEMETRA
            </h1>
            <p
              className="text-lg"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#6B5744",
              }}
            >
              Where Egypt&apos;s History Meets the Map
            </p>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2
              className="text-3xl mb-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                color: "#3D2817",
              }}
            >
              Welcome Back
            </h2>
            <p
              className="text-base"
              style={{
                color: "#6B5744",
              }}
            >
              Sign in to access your heritage dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                <Translate contentKey="global.form.username.label">
                  Username
                </Translate>
              </label>
              <Controller
                name="username"
                control={control}
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                      style={{ color: "#8B7355" }}
                    />
                    <InputText
                      {...field}
                      id="email"
                      autoComplete="username"
                      placeholder="Username"
                      className={`w-full kemetra-login-input ${errors.username ? "p-invalid" : ""}`}
                      data-cy="username"
                    />
                  </div>
                )}
              />
              {errors.username && (
                <small className="mt-1 text-red-600">
                  {errors.username.message}
                </small>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 text-sm font-medium text-gray-700"
                style={{ color: "#3D2817" }}
              >
                <Translate contentKey="login.form.password">Password</Translate>
              </label>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                      style={{ color: "#8B7355" }}
                    />
                    <Password
                      {...field}
                      id="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      className={`w-full kemetra-login-input ${errors.password ? "p-invalid" : ""}`}
                      inputClassName="w-full kemetra-login-input"
                      toggleMask
                      feedback={false}
                      data-cy="password"
                      pt={{
                        root: { style: { width: "100%" } },
                        input: {
                          className: "kemetra-login-input",
                          style: { width: "100%" },
                        },
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
                className="w-full"
                style={{
                  background: loading
                    ? "rgba(201, 162, 77, 0.6)"
                    : "linear-gradient(135deg, #C9A24D 0%, #B8913D 100%)",
                  border: "none",
                  borderRadius: "12px",
                  height: "52px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#FFFFFF",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 16px rgba(201, 162, 77, 0.4)",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.02em",
                }}
              />
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-300/30">
            <p className="text-xs text-center" style={{ color: "#8B7355" }}>
              © 2024 KEMETRA Heritage Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
