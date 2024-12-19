"use client";
import { FormProvider } from "@/lib/context/FormProvider";
import React, { useState } from "react";
import ResumeEditForm from "./ResumeEditForm";
import ResumePreview from "./ResumePreview";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ResumeEditor = ({
  params,
  userId,
}: {
  params: { id: string };
  userId: string | undefined;
}) => {
  const [currentDesign, setCurrentDesign] = useState(1);
  const TOTAL_DESIGNS = 2;

  const handlePrevious = () => {
    setCurrentDesign(current => 
      current === 1 ? TOTAL_DESIGNS : current - 1
    );
  };

  const handleNext = () => {
    setCurrentDesign(current => 
      current === TOTAL_DESIGNS ? 1 : current + 1
    );
  };

  if (!userId) {
    return null;
  }

  return (
    <FormProvider params={params}>
      <div className="p-10 max-sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center items-start pb-16 max-sm:pb-8">
          <ResumeEditForm params={params} userId={userId} />
          <div className="relative">
            {/* Template Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Template {currentDesign} of {TOTAL_DESIGNS}
              </span>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
            <ResumePreview resumeDesign={currentDesign} />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ResumeEditor;