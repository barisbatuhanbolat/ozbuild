'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Wand2, Share2, ArrowRight, ChevronDown } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

// Types
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Constants
const FEATURES: Feature[] = [
  {
    icon: <FileText className="w-12 h-12" />,
    title: "Choose Your Design",
    description: "Browse through our collection of modern, ATS-friendly templates designed for your industry"
  },
  {
    icon: <Wand2 className="w-12 h-12" />,
    title: "AI Enhancement",
    description: "Let our AI help optimize your content and suggest improvements for maximum impact"
  },
  {
    icon: <Share2 className="w-12 h-12" />,
    title: "Export & Share",
    description: "Download in multiple formats or share directly with recruiters via a secure link"
  }
];

const TOTAL_SECTIONS = 4;

const page = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isScrolling) return;

      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1000);

      if (e.deltaY > 0 && activeSection < TOTAL_SECTIONS - 1) {
        setActiveSection(prev => prev + 1);
      } else if (e.deltaY < 0 && activeSection > 0) {
        setActiveSection(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [activeSection, isScrolling]);

  const NavigationDots = () => (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
      {Array.from({ length: TOTAL_SECTIONS }).map((_, index) => (
        <button
          key={index}
          onClick={() => setActiveSection(index)}
          className={`block w-3 h-3 my-2 rounded-full transition-all duration-300 ${
            activeSection === index ? 'bg-purple-400 scale-125' : 'bg-white bg-opacity-30 hover:bg-opacity-50'
          }`}
        />
      ))}
    </div>
  );

  const Navbar = () => (
    <nav className="fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">OzBuild</h1>
      <div className="space-x-4">
        {!isLoaded || !user ? (
          <>
            <Link href="/sign-in" className="text-white hover:text-purple-200 transition-colors">
              Login
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Register
            </Link>
          </>
        ) : (
          <Link 
            href="/dashboard" 
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <Navbar />
      <NavigationDots />

      <div 
        className="transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(-${activeSection * 100}vh)` }}
      >
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center px-8">
          <div className="max-w-4xl text-center">
            <h1 className="text-6xl font-bold text-white mb-4">Create Your Perfect Resume</h1>
            <h2 className="text-4xl text-purple-300 mb-6">Powered by AI</h2>
            <p className="text-xl text-gray-200 mb-8">
              Transform your career story into a compelling resume in minutes
            </p>
            <Link
              href={`${!user ? "/sign-up" : "/dashboard"}`}
              className="bg-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-600 transition-all group inline-block"
            >
              <span className="flex items-center">
                Begin Your Journey 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white">
              <ChevronDown className="w-8 h-8" />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="h-screen flex items-center justify-center px-8">
          <div className="max-w-6xl">
            <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {FEATURES.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm hover:bg-opacity-20 transition-all"
                >
                  <div className="text-purple-400 mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section className="h-screen flex items-center justify-center px-8">
          <div className="max-w-4xl grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">AI-Powered Excellence</h2>
              <p className="text-gray-300 mb-6">
                Our advanced AI technology analyzes your experience and skills to create 
                perfectly tailored resumes that stand out to both human recruiters and ATS systems.
              </p>
              <ul className="space-y-4">
                {['Smart content optimization', 'ATS-friendly formatting', 'Industry-specific suggestions'].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 h-64 rounded-xl" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="h-screen flex items-center justify-center px-8 text-center">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Build Your Future?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who have already transformed their careers 
              with our AI-powered resume builder.
            </p>
            <Link
              href={`${!user ? "/sign-up" : "/dashboard"}`}
              className="bg-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-600 transition-all inline-block"
            >
              Get Started For Free
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;