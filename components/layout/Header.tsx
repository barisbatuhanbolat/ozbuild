"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface HeaderProps {
  landingPage?: boolean;
  activeSection?: number;
  setActiveSection?: (section: number) => void;
  TOTAL_SECTIONS?: number;
}

const Header = ({
  landingPage,
  activeSection,
  setActiveSection,
  TOTAL_SECTIONS,
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const user = useUser();

  const navItems = [
    {
      id: 1,
      label: "Features",
      icon: "✨"
    },
    {
      id: 2,
      label: "About Us",
      icon: "👥"
    },
    {
      id: 3,
      label: "Contact Us",
      icon: "📬"
    },
  ];

  const handleSectionClick = (sectionId: number) => {
    setActiveSection?.(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-transparent backdrop-blur-sm">
      <nav className="px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white hover:text-purple-200 transition-colors duration-200">
              OzBuild
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:order-1">
            {landingPage &&
              navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    group relative px-4 py-2 rounded-lg text-sm font-medium 
                    transition-all duration-300 ease-in-out
                    ${
                      activeSection === item.id
                        ? "bg-purple-600 text-white"
                        : "text-white hover:bg-purple-500/10"
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`
                      transition-transform duration-300
                      ${hoveredItem === item.id ? "scale-110" : "scale-100"}
                    `}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <div className={`
                    absolute bottom-0 left-0 w-full h-0.5 bg-purple-400
                    transform origin-left scale-x-0 transition-transform duration-300
                    ${hoveredItem === item.id ? "scale-x-100" : ""}
                  `}/>
                </button>
              ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center lg:order-2 space-x-4">
            {user?.isLoaded && !user?.isSignedIn ? (
              <Link
                href="/sign-in"
                className="px-4 py-2 text-white hover:text-purple-200 transition-colors duration-200"
              >
                Login
              </Link>
            ) : (
              <>
                <div className="mr-4 h-full items-center align-middle flex max-md:hidden justify-center">
                  <UserButton showName={true} />
                </div>
                <div className="mr-4 h-full items-center align-middle hidden max-md:flex justify-center">
                  <UserButton showName={false} />
                </div>
              </>
            )}
            <Link
              href={`${!user?.isSignedIn ? "/sign-up" : "/dashboard"}`}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {!user?.isSignedIn ? "Register" : "Dashboard"}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-purple-200 p-2 transition-transform duration-300 hover:rotate-180"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && landingPage && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleSectionClick(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex items-center space-x-3 w-full px-5 py-3 rounded-lg
                  text-white transition-all duration-300
                  ${
                    activeSection === item.id
                      ? "bg-purple-600"
                      : "hover:bg-purple-500/10"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-base font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;