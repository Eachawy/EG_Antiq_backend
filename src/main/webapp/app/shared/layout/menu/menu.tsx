import React, { useEffect, useState } from "react";
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
  Mail,
} from "lucide-react";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router";
import { hasAnyAuthority } from "app/shared/auth/private-route";
import { AUTHORITIES } from "app/config/constants";
import { useAppSelector } from "app/config/store";
import { Storage } from "react-jhipster";

const Menu = (props) => {
  const navigate = useNavigate();
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const $Account = useAppSelector((state) => state.authentication.account);

  // const navItems: any = [
  //   { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
  //   { label: "Eras", icon: CalendarClock, page: "eras" },
  //   { label: "Monuments Type", icon: Landmark, page: "monumentsType" },
  //   { label: "Dynasty", icon: Crown, page: "dynasty" },
  //   { label: "Monuments", icon: Castle, page: "monuments" },
  //   { label: "Monuments Era", icon: GitBranch, page: "monumentsEra" },
  //   { label: "Descriptions", icon: Languages, page: "descriptionMonuments" },
  //   { label: "Gallery", icon: ImageIcon, page: "gallery" },
  //   { label: "Sources", icon: ImageIcon, page: "sources" },
  //   { label: "Books", icon: ImageIcon, page: "books" },
  //   { label: "Monument Sources", icon: ImageIcon, page: "monumentSources" },
  //   { label: "Monument Books", icon: ImageIcon, page: "monumentBooks" },
  // ];

  const [navItems, setNavItems] = useState<any>([
    { label: "Dashboard", icon: LayoutDashboard, page: "app/dashboard" },
    { label: "Eras", icon: CalendarClock, page: "eras" },
    { label: "Monuments Type", icon: Landmark, page: "monumentsType" },
    { label: "Dynasty", icon: Crown, page: "dynasty" },
    { label: "Monuments", icon: Castle, page: "monuments" },
    { label: "Monuments Era", icon: GitBranch, page: "monumentsEra" },
    { label: "Descriptions", icon: Languages, page: "descriptionMonuments" },
    { label: "Gallery", icon: ImageIcon, page: "gallery" },
    { label: "Sources", icon: ImageIcon, page: "sources" },
    { label: "Books", icon: ImageIcon, page: "books" },
    { label: "Monument Sources", icon: ImageIcon, page: "monumentSources" },
    { label: "Monument Books", icon: ImageIcon, page: "monumentBooks" },
  ]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(hasAnyAuthority($Account?.roles, [AUTHORITIES.PORTAL_ADMIN]));

    if (
      Storage.session.get("isAdmin") ||
      hasAnyAuthority($Account?.roles, [AUTHORITIES.PORTAL_ADMIN])
    ) {
      setNavItems((prevState) => [
        ...prevState,
        {
          label: "Admin",
          icon: Shield,
          page: "admin",
          children: [
            { label: "Users", icon: Users, page: "users" },
            { label: "Portal Users", icon: User, page: "portalUsers" },
            { label: "Roles", icon: BookmarkCheck, page: "Roles" },
            { label: "User Roles", icon: BookmarkCheck, page: "userRoles" },
            { label: "Favourites", icon: Heart, page: "favourites" },
            { label: "Saved Search", icon: Search, page: "savedSearch" },
            { label: "User History", icon: History, page: "userHistory" },
            { label: "Newsletter", icon: Mail, page: "newsletter" },
          ],
        },
      ]);
      Storage.session.set("isAdmin", true);
    }
  }, []);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    props.onCloseMobileSidebar();
    navigate(page);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed left-0 bottom-0 border-r transition-all duration-300 overflow-y-auto kemetra-sidebar-desktop ${
          props.sidebarCollapsed
            ? "kemetra-sidebar-desktop-collapsed"
            : "kemetra-sidebar-desktop-expanded"
        }`}
        style={{ zIndex: 40 }}
      >
        <nav className="p-3">
          {navItems.map((item) => (
            <div key={item.page}>
              {item?.children ? (
                <div>
                  <button
                    onClick={() => setAdminExpanded(!adminExpanded)}
                    className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg text-sm transition-all ${
                      currentPage === item.page
                        ? "kemetra-sidebar-nav-item-active"
                        : "kemetra-sidebar-nav-item"
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
                          className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg text-sm transition-all ${
                            currentPage === child.page
                              ? "kemetra-sidebar-nav-item-active"
                              : "kemetra-sidebar-nav-item"
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
                  className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg text-sm transition-all ${
                    currentPage === item.page
                      ? "kemetra-sidebar-nav-item-active"
                      : "kemetra-sidebar-nav-item"
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
      {props.mobileSidebarVisible && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={props.onCloseMobileSidebar}
          />
          <div className="lg:hidden fixed left-0 bottom-0 z-50 w-72 overflow-y-auto kemetra-sidebar-mobile">
            <nav className="p-4">
              {navItems.map((item) => (
                <div key={item.page}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => setAdminExpanded(!adminExpanded)}
                        className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                          currentPage === item.page
                            ? "kemetra-sidebar-nav-item-active"
                            : "kemetra-sidebar-nav-item"
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
                              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                                currentPage === child.page
                                  ? "kemetra-sidebar-nav-item-active"
                                  : "kemetra-sidebar-nav-item"
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
                      className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                        currentPage === item.page
                          ? "kemetra-sidebar-nav-item-active"
                          : "kemetra-sidebar-nav-item"
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
    </>
  );
};

export default Menu;
