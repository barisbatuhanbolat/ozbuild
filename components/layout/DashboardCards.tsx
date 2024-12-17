"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import { Search, Plus, Sparkles, Clock, Download, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";

const DashboardCards = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [resumeList, setResumeList] = useState(null as any);

  const loadResumeData = async () => {
    try {
      const resumeData = await fetchUserResumes(userId || "");

      setResumeList(JSON.parse(resumeData as any));
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  useEffect(() => {
    user?.isSignedIn && loadResumeData();
  }, [user?.isLoaded]);

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Actions Row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
            <input 
              type="text"
              placeholder="Search your resumes..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 md:flex-none flex items-center justify-center gap-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              <Sparkles className="h-5 w-5" />
              Browse Templates
            </button>
          </div>
        </div>
        
        {/* Resumes Grid */}
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">My Resumes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Add New Resume Card */}
              <AddResume userId={userId} />
              
              {/* Sample Resume Cards */}
              {resumeList !== null
              ? resumeList.map((resume: any) => (
                  <ResumeCard
                    key={resume.resumeId}
                    resume={JSON.stringify(resume)}
                    refreshResumes={loadResumeData}
                  />
                ))
              : [1, 2, 3].map((index) => (
                  <ResumeCard
                    key={index}
                    resume={null}
                    refreshResumes={loadResumeData}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default DashboardCards;
