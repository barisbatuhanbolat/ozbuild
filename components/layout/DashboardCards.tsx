"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import { Search, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";

const DashboardCards = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [resumeList, setResumeList] = useState(null as any);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResumes, setFilteredResumes] = useState(null as any);

  const loadResumeData = async () => {
    try {
      const resumeData = await fetchUserResumes(userId || "");
      const parsedData = JSON.parse(resumeData as any);
      setResumeList(parsedData);
      setFilteredResumes(parsedData);
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredResumes(resumeList); // Reset to original list when search is cleared
    } else {
      const filtered = resumeList.filter((resume: any) =>
        resume.title.toLowerCase().includes(query)
      );
      setFilteredResumes(filtered);
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
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Resumes Grid */}
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">My Resumes</h2>
              {resumeList === null ? (
                // Centered Loading Container
                <div className="min-h-[400px] flex justify-center items-center">
                  <svg
                    className="animate-spin h-12 w-12 text-purple-500" // Updated spinner size
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {/* Add New Resume Card */}
                  <AddResume userId={userId} />
                  {filteredResumes !== null && filteredResumes.length > 0 ? (
                    filteredResumes.map((resume: any) => (
                      <ResumeCard
                        key={resume.resumeId}
                        resume={JSON.stringify(resume)}
                        refreshResumes={loadResumeData}
                      />
                    ))
                  ) : (
                    <p className="text-white col-span-full"></p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
};

export default DashboardCards;
