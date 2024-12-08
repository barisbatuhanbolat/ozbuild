"use client";

import Header from "@/components/layout/Header";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from '@/components/ui/card';
import { ArrowBigUp, ArrowRight, AtomIcon, Edit, FileSpreadsheet, Share2, Wand2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  const user = useUser();

  return (
    <div>
      <Header />
      <section>
        <div className="py-8 px-6 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 md:px-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Create Your Perfect Resume
            <span className="block text-indigo-400">Powered by AI</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Transform your career story into a compelling resume in minutes
          </p>
          {!user?.isSignedIn && (
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link
              href={`${!user?.isSignedIn ? "/sign-up" : "/dashboard"}`}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:scale-105 transition duration-300 flex items-center mx-auto "
            >

              <span className="relative text-base font-semibold text-white flex items-center mx-auto">
              Begin Your Journey
              <ArrowRight className="ml-2" />
              </span>
            </Link>
          </div>
          )}
        </div>
      </section>
      <section>
        <div className="grid md:grid-cols-3 gap-8 mt-16 px-4 sm:px-8 md:px-12">
          <Card className="bg-white/10 backdrop-blur-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Choose Your Design</h3>
              <p className="text-gray-300">
                Browse through our collection of modern, ATS-friendly templates designed for your industry
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Enhancement</h3>
              <p className="text-gray-300">
                Let our AI help optimize your content and suggest improvements for maximum impact
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Export & Share</h3>
              <p className="text-gray-300">
                Download in multiple formats or share directly with recruiters via a secure link
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default page;
