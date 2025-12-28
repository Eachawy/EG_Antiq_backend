import React, { useState } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  Landmark,
  Crown,
  Castle,
  GitBranch,
  Languages,
  ImageIcon,
  Search,
  User,
  Users,
  Shield,
  Heart,
  BookmarkCheck,
  History,
} from "lucide-react";
import { Badge } from "primereact/badge";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  page: string;
  badge?: number;
  children?: NavItem[];
}

const Menu = (props) => {
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Eras", icon: CalendarClock, page: "eras" },
    { label: "Monuments Type", icon: Landmark, page: "monuments-type" },
    { label: "Dynasty", icon: Crown, page: "dynasty" },
    { label: "Monuments", icon: Castle, page: "monuments" },
    { label: "Monuments Era", icon: GitBranch, page: "monuments-era" },
    { label: "Descriptions", icon: Languages, page: "description-monuments" },
    { label: "Gallery", icon: ImageIcon, page: "gallery" },
    {
      label: "Admin",
      icon: Shield,
      page: "admin",
      children: [
        { label: "Users", icon: Users, page: "users" },
        { label: "Portal Users", icon: User, page: "portal-users" },
        { label: "Rules", icon: BookmarkCheck, page: "rules" },
        { label: "Favourites", icon: Heart, page: "favourites" },
        { label: "Saved Search", icon: Search, page: "saved-search" },
        { label: "User History", icon: History, page: "user-history" },
      ],
    },
  ];

  const handleNavClick = (page: string) => {
    setMobileSidebarVisible(false);
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div
        className="hidden lg:block fixed left-0 bottom-0 border-r transition-all duration-300 overflow-y-auto kemetra-sidebar"
        style={{
          width: props.sidebarCollapsed ? "80px" : "260px",
          top: "72px",
          zIndex: 40,
        }}
      >
        <nav className="p-3">
          {navItems.map((item) => (
            <div key={item.page}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => setAdminExpanded(!adminExpanded)}
                    className={`w-full flex items-center gap-3 kemetra-nav-item ${
                      currentPage === item.page ? "active" : ""
                    }`}
                  >
                    <item.icon className="text-lg" />
                    {!props.sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge value={item.badge} severity="info" />
                        )}
                      </>
                    )}
                  </button>
                  {adminExpanded && (
                    <div className="pl-6">
                      {item.children.map((child) => (
                        <button
                          key={child.page}
                          onClick={() => handleNavClick(child.page)}
                          className={`w-full flex items-center gap-3 kemetra-nav-item ${
                            currentPage === child.page ? "active" : ""
                          }`}
                        >
                          <child.icon className="text-lg" />
                          {!props.sidebarCollapsed && (
                            <>
                              <span className="flex-1 text-left">
                                {child.label}
                              </span>
                              {child.badge && (
                                <Badge value={child.badge} severity="info" />
                              )}
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full flex items-center gap-3 kemetra-nav-item ${
                    currentPage === item.page ? "active" : ""
                  }`}
                >
                  <item.icon className="text-lg" />
                  {!props.sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge value={item.badge} severity="info" />
                      )}
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarVisible && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileSidebarVisible(false)}
          />
          <div
            className="lg:hidden fixed left-0 bottom-0 z-50 w-72 overflow-y-auto kemetra-sidebar"
            style={{
              top: "72px",
            }}
          >
            <nav className="p-4">
              {navItems.map((item) => (
                <div key={item.page}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => setAdminExpanded(!adminExpanded)}
                        className={`w-full flex items-center gap-3 kemetra-nav-item ${
                          currentPage === item.page ? "active" : ""
                        }`}
                      >
                        <item.icon className="text-lg" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge value={item.badge} severity="info" />
                        )}
                      </button>
                      {adminExpanded && (
                        <div className="pl-6">
                          {item.children.map((child) => (
                            <button
                              key={child.page}
                              onClick={() => handleNavClick(child.page)}
                              className={`w-full flex items-center gap-3 kemetra-nav-item ${
                                currentPage === child.page ? "active" : ""
                              }`}
                            >
                              <child.icon className="text-lg" />
                              <span className="flex-1 text-left">
                                {child.label}
                              </span>
                              {child.badge && (
                                <Badge value={child.badge} severity="info" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.page)}
                      className={`w-full flex items-center gap-3 kemetra-nav-item ${
                        currentPage === item.page ? "active" : ""
                      }`}
                    >
                      <item.icon className="text-lg" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge value={item.badge} severity="info" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
