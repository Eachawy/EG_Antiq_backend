import "./header.scss";

import React from "react";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Storage } from "react-jhipster";
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
import { setLocale } from "app/shared/reducers/locale";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { Button } from "primereact/button";

const Header = (props) => {
  const dispatch = useAppDispatch();
  const notificationsRef = React.useRef<OverlayPanel>(null);
  const profileRef = React.useRef<OverlayPanel>(null);

  const currentLocale = useAppSelector((state) => state.locale.currentLocale);
  Storage.session.set("locale", currentLocale);

  const handleLocaleChange = () => {
    const langKey = Storage.session.get("locale") === "en" ? "ar" : "en";
    Storage.session.set("locale", langKey);
    dispatch(setLocale(langKey));
  };

  return (
    <>
      {/* Top App Bar */}
      <div className="kemetra-header kemetra-header-gradient">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Left Section - Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg lg:hidden hover:bg-opacity-10 kemetra-transition kemetra-text-primary"
              onClick={props.onToggleMobileSidebar}
            >
              <Menu size={22} />
            </button>
            <button
              className="p-2 rounded-lg hidden lg:flex hover:bg-opacity-10 kemetra-transition kemetra-text-primary"
              onClick={props.onToggleSidebar}
            >
              {props.sidebarCollapsed ? (
                <ChevronRight size={22} />
              ) : (
                <ChevronLeft size={22} />
              )}
            </button>

            {/* KEMETRA Logo & Branding */}
            <div className="flex items-center gap-1">
              <div className="kemetra-logo-container">
                {/* <Castle className="text-white" size={24} /> */}
                {/* <div className="kemetra-logo-accent" /> */}
                <img
                  src={"./content/images/kemetra-logo.png"}
                  alt="Kemetra Logo"
                />
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <h1 className="kemetra-brand-title">EMETRA</h1>
                  {/* <Sparkles
                    size={16}
                    className="kemetra-text-gold kemetra-lang-icon-filter"
                  /> */}
                </div>
                <p className="kemetra-brand-subtitle">
                  Where Egypt&apos;s History Meets the Map
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <Button
              icon={<Languages size={18} />}
              label={currentLocale === "en" ? "العربية" : "English"}
              onClick={handleLocaleChange}
              outlined
              className="kemetra-btn-outlined kemetra-transition"
            />

            {/* Divider */}
            <div className="hidden md:block kemetra-divider-vertical" />

            {/* Notifications */}
            {/* <button
              className="kemetra-icon-btn kemetra-hover-lift"
              onClick={(e) => notificationsRef.current?.toggle(e as any)}
            >
              <Bell size={20} />
              <div className="kemetra-notification-badge" />
            </button> */}

            {/* Divider */}
            {/* <div className="hidden md:block kemetra-divider-vertical" /> */}

            {/* Profile Button */}
            <button
              className="kemetra-profile-btn kemetra-hover-lift"
              onClick={(e) => profileRef.current?.toggle(e as any)}
            >
              <Avatar
                label="A"
                shape="circle"
                className="kemetra-avatar-gold kemetra-avatar-large kemetra-font-primary"
              />
              <div className="hidden lg:block text-left">
                <p className="kemetra-profile-name">Admin User</p>
                <p className="kemetra-profile-role">Administrator</p>
              </div>
              <ChevronDown
                size={16}
                className="hidden lg:block kemetra-text-gold"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Overlay */}
      {/* <OverlayPanel ref={notificationsRef} className="kemetra-overlay-panel">
        <div className="p-2">
          <div className="flex items-center justify-between mb-4 pb-3 kemetra-overlay-header-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center kemetra-overlay-header-icon-box">
                <Bell size={16} className="text-white" />
              </div>
              <h3 className="font-bold text-lg kemetra-overlay-title">
                Notifications
              </h3>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold kemetra-overlay-badge">
              3
            </div>
          </div>

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
              <div
                key={index}
                className="p-2.5 rounded-xl cursor-pointer transition-all duration-200 kemetra-notification-item"
              >
                <p className="text-sm font-semibold mb-1 kemetra-notification-title">
                  {notification.title}
                </p>
                <p className="text-xs mb-1.5 kemetra-notification-message">
                  {notification.desc}
                </p>
                <div className="text-xs flex items-center gap-1 kemetra-notification-time">
                  <div className="w-1 h-1 rounded-full kemetra-notification-time-dot" />
                  {notification.time}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 kemetra-view-all-notifications-btn">
            View All Notifications
          </button>
        </div>
      </OverlayPanel> */}

      {/* Profile Overlay */}
      <OverlayPanel ref={profileRef} className="kemetra-overlay-panel">
        <div className="p-2">
          {/* Profile Header */}
          <div className="flex items-center gap-3 pb-4 mb-4 kemetra-overlay-header-border">
            <Avatar
              label="A"
              shape="circle"
              className="kemetra-profile-avatar"
              style={{ width: "48px", height: "48px" }}
            />
            <div>
              <p className="font-bold text-base kemetra-profile-name">
                Admin User
              </p>
              <p className="text-xs italic kemetra-profile-role">
                System Administrator
              </p>
            </div>
          </div>

          {/* Menu Items */}
          {/* <div className="space-y-1">
            <button className="w-full text-left rounded-xl flex items-center gap-3 transition-all duration-200 kemetra-profile-menu-btn">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center kemetra-profile-menu-icon-box">
                <User size={16} className="kemetra-profile-menu-icon" />
              </div>
              <span className="font-medium text-sm kemetra-profile-menu-text">
                My Profile
              </span>
            </button>

            <button className="w-full text-left rounded-xl flex items-center gap-3 transition-all duration-200 kemetra-profile-menu-btn">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center kemetra-profile-menu-icon-box">
                <Settings size={16} className="kemetra-profile-menu-icon" />
              </div>
              <span className="font-medium text-sm kemetra-profile-menu-text">
                Settings
              </span>
            </button>
          </div> */}

          {/* Divider */}
          {/* <div className="my-4 kemetra-profile-divider" /> */}

          {/* Logout Button */}
          <button
            className="w-full text-left rounded-xl flex items-center gap-3 transition-all duration-200 kemetra-logout-btn"
            onClick={props.onLogout}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center kemetra-logout-icon-box">
              <LogOut size={16} className="kemetra-logout-icon" />
            </div>
            <span className="font-semibold text-sm kemetra-logout-text">
              Logout
            </span>
          </button>
        </div>
      </OverlayPanel>
    </>
  );
};

export default Header;
