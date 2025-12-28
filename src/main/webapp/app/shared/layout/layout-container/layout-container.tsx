import React, { useState } from "react";
import ErrorBoundary from "app/shared/error/error-boundary";
import Footer from "app/shared/layout/footer/footer";
import Header from "app/shared/layout/header/header";
import { Outlet } from "react-router-dom";
import Menu from "../menu/menu";

export const LayoutSystemTemplete = () => {
  const [mainMargin, setMainMargin] = useState("260px");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <ErrorBoundary>
        <Header
          onMainMarginChange={(m) => setMainMargin(m)}
          sidebarCollapsed={(b) => setSidebarCollapsed(b)}
        />
      </ErrorBoundary>
      <div className="flex flex-column h-screen layout-container">
        <div>
          <div className="flex">
            {/* Menu Content */}
            <Menu sidebarCollapsed={sidebarCollapsed} />

            {/* Main Content */}
            <div
              className="flex-1 transition-all duration-300 relative"
              style={{
                marginLeft: mainMargin,
                zIndex: 10,
              }}
            >
              <div
                className={`p-4 md:p-6 lg:p-8 w-[${sidebarCollapsed ? "95vw" : "83vw"}] mx-auto`}
              >
                <Outlet />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LayoutSystemTemplete;
