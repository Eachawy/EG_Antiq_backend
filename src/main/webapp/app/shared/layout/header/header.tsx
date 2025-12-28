import "./header.scss";

import React, { useEffect, useState } from "react";
import { Storage, Translate } from "react-jhipster";

import LoadingBar from "react-redux-loading-bar";

import { useAppDispatch, useAppSelector } from "app/config/store";
import { setLocale } from "app/shared/reducers/locale";

import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import {
  Castle,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Languages,
} from "lucide-react";
import { Button } from "primereact/button";

const Header = (props) => {
  const dispatch = useAppDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const notificationsRef = React.useRef<OverlayPanel>(null);
  const profileRef = React.useRef<OverlayPanel>(null);

  const currentLocale = useAppSelector((state) => state.locale.currentLocale);
  Storage.session.set("locale", currentLocale);

  const handleLocaleChange = () => {
    const langKey = Storage.session.get("locale") === "en" ? "ar" : "en";
    Storage.session.set("locale", langKey);
    dispatch(setLocale(langKey));
  };

  useEffect(() => {
    const updateMargin = () => {
      if (window.innerWidth >= 1024) {
        props.onMainMarginChange(sidebarCollapsed ? "80px" : "260px");
      } else {
        props.onMainMarginChange("0");
      }
    };

    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    // eslint-disable-next-line no-console
    console.log("logout");
  };

  const onSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    props.sidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div id="app-header">
      <LoadingBar className="loading-bar" />
      {/* Top App Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b kemetra-appbar">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Left Section - Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              className="kemetra-header-btn lg:hidden"
              onClick={() => setMobileSidebarVisible(!mobileSidebarVisible)}
            >
              <Menu size={22} />
            </button>
            <button
              className="kemetra-header-btn hidden lg:flex"
              onClick={onSidebarToggle}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={22} />
              ) : (
                <ChevronLeft size={22} />
              )}
            </button>

            {/* KEMETRA Logo & Branding */}
            <div className="flex items-center gap-4">
              <div className="kemetra-logo-container">
                <Castle className="text-white" size={24} />
                {/* Egyptian corner accent */}
                <div className="kemetra-logo-accent" />
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <h1 className="kemetra-brand-title">KEMETRA</h1>
                  <Sparkles
                    size={16}
                    style={{
                      color: "#C9A24D",
                      filter: "drop-shadow(0 1px 2px rgba(201, 162, 77, 0.3))",
                    }}
                  />
                </div>
                <p className="kemetra-brand-subtitle">
                  Where Egypt&apos;s History Meets the Map
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* LanguageSwitcher */}
            <Button
              icon={<Languages size={18} />}
              label={currentLocale === "en" ? "العربية" : "English"}
              onClick={handleLocaleChange}
              outlined
              style={{
                borderColor: "#C9A24D",
                color: "#C9A24D",
                borderRadius: "var(--radius-lg)",
                fontWeight: 600,
                padding: "0.5rem 1rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(201, 162, 77, 0.1)";
                e.currentTarget.style.borderColor = "#B8913D";
                e.currentTarget.style.color = "#B8913D";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#C9A24D";
                e.currentTarget.style.color = "#C9A24D";
              }}
            />

            {/* Notifications */}
            <button
              className="kemetra-header-btn relative"
              onClick={(e) => notificationsRef.current?.toggle(e as any)}
            >
              <Bell size={20} />
              <div className="kemetra-notification-badge" />
            </button>

            {/* Divider */}
            <div className="hidden md:block kemetra-divider-vertical" />

            {/* Profile Button */}
            <button
              className="flex items-center gap-3 kemetra-profile-btn"
              onClick={(e) => profileRef.current?.toggle(e as any)}
            >
              <Avatar label="A" shape="circle" className="kemetra-avatar" />
              <div className="hidden lg:block text-left">
                <p
                  className="text-sm font-semibold kemetra-brand-title"
                  style={{ fontSize: "0.875rem" }}
                >
                  Admin User
                </p>
                <p className="text-xs kemetra-brand-subtitle">Administrator</p>
              </div>
              <ChevronDown
                size={16}
                className="hidden lg:block"
                style={{ color: "#C9A24D" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Overlay */}
      <OverlayPanel ref={notificationsRef} className="kemetra-overlay-panel">
        <div className="p-2">
          {/* Header */}
          <div className="flex items-center justify-between kemetra-overlay-header">
            <div className="flex items-center gap-2">
              <div className="kemetra-icon-container">
                <Bell
                  size={16}
                  className="text-white"
                  style={{ color: "#fff" }}
                />
              </div>
              <h3
                className="font-bold text-lg kemetra-brand-title"
                style={{ fontSize: "1.125rem" }}
              >
                Notifications
              </h3>
            </div>
            <div className="kemetra-badge">3</div>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {[
              {
                title: "New monument added",
                desc: "Karnak Temple has been added to the database",
                time: "2 hours ago",
              },
              {
                title: "Era updated",
                desc: "Ptolemaic Period details have been modified",
                time: "5 hours ago",
              },
              {
                title: "Gallery uploaded",
                desc: "12 new images added to Abu Simbel",
                time: "1 day ago",
              },
            ].map((notification, index) => (
              <div key={index} className="kemetra-notification-item">
                <p
                  className="text-sm font-semibold mb-1 kemetra-brand-title"
                  style={{ fontSize: "0.875rem" }}
                >
                  {notification.title}
                </p>
                <p className="text-xs mb-1.5 kemetra-brand-subtitle">
                  {notification.desc}
                </p>
                <p
                  className="text-xs flex items-center gap-1"
                  style={{ color: "#C9A24D", fontWeight: 500 }}
                >
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: "#C9A24D" }}
                  />
                  {notification.time}
                </p>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <button
            className="w-full mt-4 kemetra-primary-btn"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            View All Notifications
          </button>
        </div>
      </OverlayPanel>

      {/* Profile Overlay */}
      <OverlayPanel ref={profileRef} className="kemetra-overlay-panel">
        <div className="p-2">
          {/* Profile Header */}
          <div className="flex items-center gap-3 kemetra-overlay-header">
            <Avatar
              label="A"
              shape="circle"
              className="kemetra-avatar-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            />
            <div>
              <p className="font-bold text-base kemetra-brand-title">
                Admin User
              </p>
              <p
                className="text-xs kemetra-brand-subtitle"
                style={{ fontStyle: "italic" }}
              >
                System Administrator
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <button className="w-full text-left flex items-center gap-3 kemetra-menu-item">
              <div className="kemetra-icon-container">
                <User size={16} style={{ color: "#C9A24D" }} />
              </div>
              <span
                className="font-medium text-sm kemetra-brand-subtitle"
                style={{ fontStyle: "normal" }}
              >
                My Profile
              </span>
            </button>

            <button className="w-full text-left flex items-center gap-3 kemetra-menu-item">
              <div className="kemetra-icon-container">
                <Settings size={16} style={{ color: "#C9A24D" }} />
              </div>
              <span
                className="font-medium text-sm kemetra-brand-subtitle"
                style={{ fontStyle: "normal" }}
              >
                Settings
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-4 kemetra-divider-horizontal" />

          {/* Logout Button */}
          <button
            className="w-full text-left flex items-center gap-3 kemetra-logout-btn"
            onClick={handleLogout}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(201, 42, 42, 0.15)" }}
            >
              <LogOut size={16} style={{ color: "#C92A2A" }} />
            </div>
            <span
              className="font-semibold text-sm"
              style={{
                color: "#C92A2A",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Logout
            </span>
          </button>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default Header;
