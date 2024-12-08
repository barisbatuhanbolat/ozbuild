"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { FormProvider, useFormContext } from "@/lib/context/FormProvider";
import { RWebShare } from "react-web-share";
import React from "react";
import ResumePreview from "@/components/layout/my-resume/ResumePreview";
import { usePathname } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import { DownloadIcon, Share2Icon } from "lucide-react";

const FinalResumeView = ({
  params,
  isOwnerView,
}: {
  params: { id: string };
  isOwnerView: boolean;
}) => {
  const path = usePathname();
  const { formData } = useFormContext();

  const handleDownload = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <FormProvider params={params}>
        <div id="no-print">
          <Header />
          <div className="my-10 mx-10 md:mx-20 lg:mx-36">
            {isOwnerView ? (
              <>
                <h2 className="text-center text-2xl font-bold text-white">
                  Congrats! Your resume is ready!
                </h2>
              </>
            ) : (
              <>
                <h2 className="text-center text-2xl font-bold">
                  Resume Preview
                </h2>
              </>
            )}
            <div className="flex max-sm:flex-col justify-center gap-8 my-10">
              <Button
                className="flex px-12 py-6 gap-2 rounded-full bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-primary-700/30 text-white"
                onClick={handleDownload}
              >
                <DownloadIcon className="size-6" /> Download
              </Button>
              <RWebShare
                data={{
                  text: "Hello everyone, check out my resume by clicking the link!",
                  url: `${process.env.BASE_URL}/${path}`,
                  title: `${formData?.firstName} ${formData?.lastName}'s Resume`,
                }}
                onClick={() => console.log("Shared successfully!")}
              >
                <Button className="flex px-12 py-6 gap-2 rounded-full bg-white hover:bg-white focus:ring-4 focus:ring-primary-700/30 text-black">
                  <Share2Icon className="size-6" /> Share URL
                </Button>
              </RWebShare>
            </div>
          </div>
        </div>
        <div className="px-10 pt-4 pb-16 max-sm:px-5 max-sm:pb-8 print:p-0">
          <div id="print-area">
            <ResumePreview />
          </div>
        </div>
      </FormProvider>
    </PageWrapper>
  );
};

export default FinalResumeView;
