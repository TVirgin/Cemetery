// src/components/Header.tsx
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUserAuth } from "@/context/userAuthContext";
import { Menu, X } from 'lucide-react'; // Icons for hamburger menu

// Assuming icons are SVG imports
import homeIcon from "@/assets/icons/home.svg";
import addIcon from "@/assets/icons/add.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import settingsIcon from "@/assets/icons/settings.svg";
import profileIcon from "@/assets/icons/profile.svg";
import listIcon from "@/assets/icons/listIcon.svg";

interface NavItem {
  name: string;
  link: string;
  icon: string;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { name: "Home", link: "/", icon: homeIcon, authRequired: false },
  { name: "Add Record", link: "/admin/record", icon: addIcon, authRequired: true },
  { name: "Records", link: "/recordsList", icon: listIcon, authRequired: false },
  { name: "Settings", link: "/admin/settings", icon: settingsIcon, authRequired: true },
];

const Header: React.FunctionComponent = () => {
  const { pathname } = useLocation();
  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => {
        if (item.authRequired && !user) return null;
        const isActive = pathname === item.link;
        return (
          <Link
            key={item.name}
            to={item.link}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center transition-colors duration-150",
              isMobile 
                ? "text-lg w-full p-4 hover:bg-slate-700"
                : "px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700",
              isActive && (isMobile ? "bg-sky-600" : "bg-slate-900 text-white")
            )}
          >
            <img src={item.icon} className="w-5 h-5 mr-3" alt="" style={{ filter: "brightness(0) invert(1)" }} />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  const AuthLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <div className={cn("flex items-center", isMobile ? "flex-col w-full" : "space-x-2")}>
      {user ? (
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center transition-colors duration-150",
            isMobile 
              ? "text-lg w-full p-4 text-red-300 hover:bg-red-600 hover:text-white"
              : "px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700"
          )}
        >
          <img src={logoutIcon} className="w-5 h-5 mr-3" alt="" style={{ filter: "brightness(0) invert(1)" }} />
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          onClick={handleLinkClick}
          className={cn(
            "flex items-center transition-colors duration-150",
            isMobile 
              ? "text-lg w-full p-4 hover:bg-slate-700"
              : "px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700",
            pathname === "/login" && (isMobile ? "bg-sky-600" : "bg-slate-900 text-white")
          )}
        >
          <img src={profileIcon} className="w-5 h-5 mr-3" alt="" style={{ filter: "brightness(0) invert(1)" }} />
          Login
        </Link>
      )}
    </div>
  );

  return (
    <header className="bg-slate-800 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-semibold">Cemetery Admin</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLinks />
          </div>
          <div className="hidden md:block">
            <AuthLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
            <NavLinks isMobile />
          </div>
          <div className="pt-4 pb-3 border-t border-slate-700">
             <AuthLinks isMobile />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
