"use client";

import RichTextEditor from "@/components/common/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { generateExperienceDescription } from "@/lib/actions/gpt.actions";
import { addExperienceToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Brain, Loader2, Minus, Plus, X } from "lucide-react";
import React, { useRef, useState } from "react";

const ExperienceForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([] as any);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experienceList, setExperienceList] = useState(
    formData?.experience.length > 0
      ? formData?.experience
      : [
          {
            title: "",
            companyName: "",
            city: "",
            state: "",
            startDate: "",
            endDate: "",
            workSummary: "",
          },
        ]
  );
  const [currentAiIndex, setCurrentAiIndex] = useState(
    experienceList.length - 1
  );
  const { toast } = useToast();

  const handleChange = (index: number, event: any) => {
    const newEntries = experienceList.slice();
    const { name, value } = event.target || event;
    newEntries[index][name] = value;
    setExperienceList(newEntries);

    handleInputChange({
      target: {
        name: "experience",
        value: newEntries,
      },
    });
  };

  const generateExperienceDescriptionFromAI = async (index: number) => {
    if (
      !experienceList[index]?.title ||
      !experienceList[index]?.companyName
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please enter the position title and company name to generate summary.",
        variant: "destructive",
      });
      return;
    }

    setIsAiLoading(true);
    setCurrentAiIndex(index);

    const result = await generateExperienceDescription(
      `${experienceList[index]?.title} at ${experienceList[index]?.companyName}`
    );

    setAiGeneratedSummaryList(result);
    setIsAiLoading(false);
    setIsModalOpen(true); // Open modal after fetching data
  };

  const RemoveExperience = () => {
    const newEntries = experienceList.slice(0, -1);
    setExperienceList(newEntries);

    if (currentAiIndex > newEntries.length - 1) {
      setCurrentAiIndex(newEntries.length - 1);
    }

    handleInputChange({
      target: {
        name: "experience",
        value: newEntries,
      },
    });
  };

  const onSave = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await addExperienceToResume(params.id, experienceList);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Professional experience updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: result?.error,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div>
      {/* Form Section */}
      <div className="p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 bg-white">
        <h2 className="text-lg font-semibold">Professional Experience</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add your previous job experiences
        </p>

        <div className="mt-5">
        {experienceList.map((item: any, index: number) => (
        <div key={index}>
          <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">
                Position Title:
              </label>
              <Input
                name="title"
                onChange={(event) => handleChange(index, event)}
                defaultValue={item?.title}
                className="no-focus"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">
                Company Name:
              </label>
              <Input
                name="companyName"
                onChange={(event) => handleChange(index, event)}
                defaultValue={item?.companyName}
                className="no-focus"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">City:</label>
              <Input
                name="city"
                onChange={(event) => handleChange(index, event)}
                defaultValue={item?.city}
                className="no-focus"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">State:</label>
              <Input
                name="state"
                onChange={(event) => handleChange(index, event)}
                defaultValue={item?.state}
                className="no-focus"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">
                Start Date:
              </label>
              <Input
                type="date"
                name="startDate"
                onChange={(event) => handleChange(index, event)}
                defaultValue={item?.startDate}
                className="no-focus"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-700 font-semibold">
                End Date:
              </label>
              <Input
                type="date"
                name="endDate"
                onChange={(event) => handleChange(index, event)}
                defaultValue={item?.endDate}
                className="no-focus"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <div className="flex justify-between items-end">
                <label className=" text-slate-700 font-semibold">
                  Summary:
                </label>
                <Button
                  variant="outline"
                  onClick={() => {
                    generateExperienceDescriptionFromAI(index);
                  }}
                  type="button"
                  size="sm"
                  className="border-primary text-primary flex gap-2"
                  disabled={isAiLoading}
                >
                  {isAiLoading && currentAiIndex === index ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}{" "}
                  Generate from AI
                </Button>
              </div>
              <RichTextEditor
                defaultValue={item?.workSummary || ""}
                onRichTextEditorChange={(value: string) =>
                  handleChange(index, value)
                }
              />
            </div>
          </div>
        </div>
      ))}
        </div>
        <div className="mt-3 flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setExperienceList([...experienceList, {}])}
              className="text-primary"
            >
              <Plus className="size-4 mr-2" /> Add More
            </Button>
            <Button
              variant="outline"
              onClick={RemoveExperience}
              className="text-primary"
            >
              <Minus className="size-4 mr-2" /> Remove
            </Button>
          </div>
          <Button
            disabled={isLoading}
            onClick={onSave}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      {/* Modal for AI Suggestions */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Select a Work Summary</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* AI Suggestions - Side by Side Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {aiGeneratedSummaryList?.map((item: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleChange(currentAiIndex, {
                      name: "workSummary",
                      value: item.description,
                    });
                    setIsModalOpen(false); // Close modal after selection
                  }}
                  className="group relative bg-gray-50 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-lg hover:scale-102 hover:bg-purple-50 border-2 border-transparent hover:border-purple-200"
                >
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item?.description}
                    </p>
                  </div>

                  {/* Hover Effect Bar */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform rounded-b-xl" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
