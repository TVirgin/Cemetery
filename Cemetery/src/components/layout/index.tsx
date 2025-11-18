// src/components/layout.tsx
import * as React from "react";
// import Sidebar from "../sidebar"; // Adjust path if your Sidebar is elsewhere
import Header from "../header";
import { Menu, X } from "lucide-react"; // Icons for hamburger/close
import { cn } from "@/lib/utils"; // For conditional classNames

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1">
        <div className="w-full max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 pb-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
