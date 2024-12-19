"use client";

import RichTextEditor from "@/components/common/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateEducationDescription } from "@/lib/actions/gpt.actions";
import { addEducationToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Brain, Loader2, Minus, Plus, X } from "lucide-react";
import React, { useState } from "react";

const EducationForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedDescriptionList, setAiGeneratedDescriptionList] = useState([] as any);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [educationList, setEducationList] = useState(
    formData?.education.length > 0
      ? formData?.education
      : [
          {
            universityName: "",
            degree: "",
            major: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ]
  );
  const [currentAiIndex, setCurrentAiIndex] = useState(educationList.length - 1);
  const { toast } = useToast();

  const handleChange = (event: any, index: number) => {
    const newEntries = educationList.slice();
    const { name, value } = event.target || event;
    newEntries[index][name] = value;
    setEducationList(newEntries);

    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const generateEducationDescriptionFromAI = async (index: number) => {
    if (
      !educationList[index]?.universityName ||
      !educationList[index]?.degree ||
      !educationList[index]?.major
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please enter the name of institute, degree, and major to generate a description.",
        variant: "destructive",
      });
      return;
    }

    setCurrentAiIndex(index);
    setIsAiLoading(true);

    const result = await generateEducationDescription(
      `${educationList[index]?.universityName} on ${educationList[index]?.degree} in ${educationList[index]?.major}`
    );

    setAiGeneratedDescriptionList(result);
    setIsAiLoading(false);
    setIsModalOpen(true); // Open the modal
  };

  const RemoveEducation = () => {
    const newEntries = educationList.slice(0, -1);
    setEducationList(newEntries);

    if (currentAiIndex > newEntries.length - 1) {
      setCurrentAiIndex(newEntries.length - 1);
    }

    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const onSave = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await addEducationToResume(params.id, educationList);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Educational details updated successfully.",
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
      <div className="p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 bg-white">
        <h2 className="text-lg font-semibold">Education</h2>
        <p className="mt-1 text-sm text-gray-500">Add your educational details</p>

         {educationList.map((item: any, index: number) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2 space-y-2">
                <label className="text-slate-700 font-semibold">
                  Name of Institute:
                </label>
                <Input
                  name="universityName"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.universityName}
                  className="no-focus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-700 font-semibold">Degree:</label>
                <Input
                  name="degree"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.degree}
                  className="no-focus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-700 font-semibold">Major:</label>
                <Input
                  name="major"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.major}
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
                  onChange={(e) => handleChange(e, index)}
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
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.endDate}
                  className="no-focus"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <div className="flex justify-between items-end mt-2">
                  <label className="text-slate-700 font-semibold">
                    Description:
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      generateEducationDescriptionFromAI(index);
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
                <Textarea
                  id={`description-${index}`}
                  name="description"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.description || ""}
                  className="no-focus"
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-3 flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEducationList([...educationList, {}])}
              className="text-primary"
            >
              <Plus className="size-4 mr-2" /> Add More
            </Button>
            <Button
              variant="outline"
              onClick={RemoveEducation}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Select a Description</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* AI Suggestions - Side by Side Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {aiGeneratedDescriptionList?.map((item: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleChange({ target: { name: "description", value: item.description } }, currentAiIndex);
                    setIsModalOpen(false);
                  }}
                  className="group relative bg-gray-50 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-lg hover:scale-102 hover:bg-purple-50 border-2 border-transparent hover:border-purple-200"
                >
                  <p className="text-gray-600 text-justify">{item.description}</p>
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

export default EducationForm;
