// src/components/sidebar.tsx
import * as React from "react";
import homeIcon from "@/assets/icons/home.svg";
import addIcon from "@/assets/icons/add.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import settingsIcon from "@/assets/icons/settings.svg";
import profileIcon from "@/assets/icons/profile.svg";
import listIcon from "@/assets/icons/listIcon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { useUserAuth } from "@/context/userAuthContext";

interface NavItem {
  name: string;
  link: string;
  icon: string;
  authRequired?: boolean;
}

const navItems: NavItem[] = [ // Added type for navItems
  {
    name: "Home",
    link: "/",
    icon: homeIcon,
    authRequired: false,
  },
  {
    name: "Add Record",
    link: "/admin/record",
    icon: addIcon,
    authRequired: true,
  },
  {
    name: "Records",
    link: "/recordsList",
    icon: listIcon,
    authRequired: false,
  },
  {
    name: "Settings",
    link: "/admin/settings",
    icon: settingsIcon,
    authRequired: true,
  },
];

interface ISidebarProps {
  onLinkClick?: () => void; // Prop to notify parent (Layout) to close mobile menu
}

const Sidebar: React.FunctionComponent<ISidebarProps> = ({ onLinkClick }) => {
  const { pathname } = useLocation();
  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
      if (onLinkClick) {
        onLinkClick(); // Close mobile menu if open
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Wrapper for link clicks to also trigger onLinkClick from props
  const handleGeneralLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    // Simplified nav: full height and width of its container, dark background
    <nav className="flex flex-col h-full w-full bg-slate-800 text-white overflow-y-auto">
      <div className="flex justify-center items-center m-5 p-4 pt-0 lg:pt-4 border-b border-slate-700">
        <div className="text-xl font-semibold">Cemetery Admin</div>
      </div>

      <div className="flex-grow">
        {navItems.map((item) => {
          if (item.authRequired && !user) {
            return null;
          }
          const isActive = pathname === item.link;
          return (
            <div
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full rounded-none justify-start text-base px-6 py-3",
                isActive
                  ? "bg-sky-600 text-white hover:bg-sky-700 font-semibold"
                  : "hover:bg-slate-700 hover:text-white"
              )}
              key={item.name}
              onClick={handleGeneralLinkClick} // Use the wrapper
            >
              <Link to={item.link} className="flex items-center w-full">
                <img
                  src={item.icon}
                  className="w-5 h-5 mr-3 flex-shrink-0"
                  alt={item.name}
                  style={{
                    filter: isActive ? "none" : "brightness(0) invert(1)",
                  }}
                />
                <span>{item.name}</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Authentication Links Section (Login/Logout) */}
      <div className="mt-auto border-t border-slate-700">
        {user ? (
          <div
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full rounded-none justify-start text-base px-6 py-3",
              "hover:bg-red-600 hover:text-white text-red-300"
            )}
            // onClick for logout is handled by the button inside for async operations
          >
            <button onClick={handleLogout} className="flex items-center w-full">
              <img
                src={logoutIcon}
                className="w-5 h-5 mr-3 flex-shrink-0"
                alt="Logout"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full rounded-none justify-start text-base px-6 py-3",
              pathname === "/login"
                ? "bg-sky-600 text-white hover:bg-sky-700 font-semibold"
                : "hover:bg-slate-700 hover:text-white"
            )}
            key="login-link"
            onClick={handleGeneralLinkClick} // Use the wrapper
          >
            <Link to="/login" className="flex items-center w-full">
              <img
                src={profileIcon}
                className="w-5 h-5 mr-3 flex-shrink-0"
                alt="Login"
                style={{
                  filter: pathname === "/login" ? "none" : "brightness(0) invert(1)",
                }}
              />
              <span>Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;