import React, { useEffect, useState } from "react";
import ErrorBoundary from "app/shared/error/error-boundary";
import { OverlayPanel } from "primereact/overlaypanel";
import Footer from "app/shared/layout/footer/footer";
import Header from "app/shared/layout/header/header";
import { Outlet, useNavigate } from "react-router-dom";
import Menu from "../menu/menu";
import { useAppDispatch } from "app/config/store";
import { logout } from "app/shared/reducers/authentication";

export const LayoutSystemTemplete = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mainMargin, setMainMargin] = useState("260px");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const notificationsRef = React.useRef<OverlayPanel>(null);
  const profileRef = React.useRef<OverlayPanel>(null);

  const handleLogout = () => {
    try {
      dispatch(logout());
      // Redirect to login page after logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to login even if logout fails
      navigate("/");
    }
  };

  useEffect(() => {
    const updateMargin = () => {
      if (window.innerWidth >= 1024) {
        setMainMargin(sidebarCollapsed ? "80px" : "260px");
      } else {
        setMainMargin("0");
      }
    };

    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, [sidebarCollapsed]);

  return (
    <>
      <div className="min-h-screen relative kemetra-layout-bg">
        {/* Blurred Background Image */}
        <div className="kemetra-bg-blur" />

        {/* Light overlay */}
        <div className="kemetra-overlay" />

        {/* Header Component */}
        <ErrorBoundary>
          <Header
            sidebarCollapsed={sidebarCollapsed}
            mobileSidebarVisible={mobileSidebarVisible}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onToggleMobileSidebar={() =>
              setMobileSidebarVisible(!mobileSidebarVisible)
            }
            onLogout={handleLogout}
            notificationsRef={notificationsRef}
            profileRef={profileRef}
          />
        </ErrorBoundary>

        {/* Sidebar */}
        <div className="flex kemetra-layout-content-margin-top">
          <Menu
            sidebarCollapsed={sidebarCollapsed}
            mobileSidebarVisible={mobileSidebarVisible}
            onCloseMobileSidebar={() => setMobileSidebarVisible(false)}
          />
          {/* Main Content */}
          <div
            className="flex-1 transition-all duration-300 relative kemetra-layout-main-margin"
            style={
              {
                marginLeft: mainMargin,
                "--sidebar-margin": mainMargin,
              } as React.CSSProperties
            }
          >
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LayoutSystemTemplete;
