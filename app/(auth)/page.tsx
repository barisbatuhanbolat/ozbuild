'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Wand2, Share2, ArrowRight, ChevronDown, Brain, Cpu, Sparkles, Users, Star, Mail, MessageSquare, Check, Send, Clock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const stats = [
  { icon: Users, label: '10K+', text: 'Active Users' },
  { icon: Star, label: '4.9/5', text: 'User Rating' },
  { icon: Sparkles, label: '98%', text: 'Success Rate' }
];

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

const features = [
  {
    icon: Brain,
    title: "Smart Analysis",
    description: "Our AI analyzes your professional experience to highlight key achievements"
  },
  {
    icon: Cpu,
    title: "ATS Optimization",
    description: "Format your resume to pass through Applicant Tracking Systems"
  },
  {
    icon: Sparkles,
    title: "Industry Insights",
    description: "Get tailored suggestions based on your industry standards"
  }
];

const TOTAL_SECTIONS = 4;

const page = () => {
  const { user, isLoaded } = useUser();
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const [formState, setFormState] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (isScrolling) return;

      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1000);

      if (e.deltaY > 0 && activeSection < 3) {
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
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <NavigationDots />

      <div 
        className="transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(-${activeSection * 100}vh)` }}
      >
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-8">
          {/* Background div with image and overlay */}
          <div
            className="absolute inset-0 bg-[url('/img/landing.jpg')] bg-cover bg-center bg-no-repeat"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-purple-900/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Header inside Hero Section */}
          <div className="absolute top-0 left-0 right-0 z-20">
            <Header
              landingPage={true}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
            />
          </div>

          {/* Content - adjusted to account for navbar */}
          <div className="relative max-w-4xl text-center z-10 mt-16">
            <h1 className="text-6xl font-bold text-white mb-4">
              Create Your Perfect Resume
            </h1>
            <h2 className="text-4xl text-purple-300 mb-6">
              Powered by AI
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Transform your career story into a compelling resume in minutes
            </p>
            <Link
              href={`${!user ? "/sign-up" : "/dashboard"}`}
              className="inline-flex bg-purple-500 text-white px-8 py-4 rounded-full font-semibold transition-all group inline-block hover:bg-purple-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="flex items-center">
                Begin Your Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white z-10">
            <ChevronDown className="w-8 h-8" />
          </div>
        </section>

        {/* AI Section */}
        <section className="min-h-screen flex items-center justify-center px-8 py-16">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                  Transform Your Resume with
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"> AI Magic</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Experience the future of resume building with our advanced AI technology.
                </p>
              </motion.div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl transition-all cursor-pointer ${
                      activeFeature === index 
                        ? 'bg-purple-800/50 shadow-lg shadow-purple-500/40' 
                        : 'hover:bg-purple-800/50'
                    }`}
                    onClick={() => setActiveFeature(index)}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <feature.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-[100px] opacity-30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="relative bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-64 flex items-center justify-center">
                  <motion.div
                    className="text-6xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🧠
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="min-h-screen relative flex items-center justify-center px-8">
          {/* Simple gradient background */}
          <div className="absolute inset-0" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Build Your
                <span className="relative ml-2">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Future?
                  <motion.span
                    className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-purple-400/40 to-pink-400/40 -z-10"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                  </span>
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Join thousands of professionals who have already transformed their careers
                with our AI-powered resume builder.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{stat.label}</h3>
                  <p className="text-gray-300">{stat.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
            <Link
              href={`${!user ? "/sign-up" : "/dashboard"}`}
              className="inline-flex bg-purple-500 text-white px-8 py-4 rounded-full font-semibold transition-all group inline-block hover:bg-purple-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="flex items-center">
                Get Started For Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            </motion.div>
          </div>
        </section>

        <section className="h-screen p-6 flex items-center justify-center">
          <div className="max-w-6xl w-full mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Let's Connect</h1>
              <p className="text-lg text-indigo-100">
                Have a question or project in mind? We're here to help bring your ideas to life.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="space-y-4">
                <Card className="bg-white/10 backdrop-blur-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-white">
                      <Mail className="h-6 w-6" />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <p className="text-sm text-indigo-200">info@ozbuild.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-white">
                      <Clock className="h-6 w-6" />
                      <div>
                        <p className="font-medium">24/7 Support</p>
                        <p className="text-sm text-indigo-200">Always here to help</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <Card className="bg-white shadow-xl">
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <input
                            type="email"
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="your@email.com"
                            value={formState.email}
                            onChange={(e) => setFormState({...formState, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Subject</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="How can we help?"
                            value={formState.subject}
                            onChange={(e) => setFormState({...formState, subject: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <textarea
                          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                          placeholder="Ask your question..."
                          value={formState.message}
                          onChange={(e) => setFormState({...formState, message: e.target.value})}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <span>Send Message</span>
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;