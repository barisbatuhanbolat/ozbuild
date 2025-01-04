"use client";

import RichTextEditor from "@/components/common/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateSummary } from "@/lib/actions/gpt.actions";
import { updateResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { Brain, Loader2, X } from "lucide-react";
import React, { useRef, useState } from "react";

const SummaryForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [summary, setSummary] = useState(formData?.summary || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([] as any);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const { toast } = useToast();

  const handleSummaryChange = (e: any) => {
    const newSummary = e.target.value;
    setSummary(newSummary);

    handleInputChange({
      target: {
        name: "summary",
        value: newSummary,
      },
    });
  };

  const generateSummaryFromAI = async () => {
    setIsAiLoading(true);
    const result = await generateSummary(
      formData,  // Pass entire formData object
      formData?.summary // Pass existing summary if available
    );
    setAiGeneratedSummaryList(result);
    setIsAiLoading(false);
    setIsModalOpen(true);
  };

  const onSave = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const updates = { summary: formData?.summary };
    const result = await updateResume({ resumeId: params.id, updates });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Summary updated successfully.",
        className: "bg-white",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }

    setIsLoading(false);
  };

  return (
    <div>
      {/* Form Section */}
      <div className="p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 bg-white">
        <h2 className="text-lg font-semibold leading-none tracking-tight">Summary</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add a summary about your job</p>

        <form className="mt-5 space-y-2" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label className="text-slate-700 font-semibold">Summary:</label>
            <Button
              variant="outline"
              onClick={generateSummaryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
              disabled={isAiLoading}
            >
              {isAiLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              Generate from AI
            </Button>
          </div>
          <Textarea
            className="no-focus min-h-[10em]"
            required
            value={summary}
            onChange={handleSummaryChange}
            defaultValue={formData?.summary || ""}
          />
          <div className="flex justify-end">
            <Button
              className="mt-3 bg-purple-500 hover:bg-purple-600 text-white"
              type="submit"
              disabled={isLoading}
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
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Select a Summary</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* AI Suggestions - Side by Side Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {aiGeneratedSummaryList?.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    handleSummaryChange({ target: { value: item?.summary } });
                    setIsModalOpen(false); // Close modal after selection
                  }}
                  className="group relative bg-gray-50 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-lg hover:scale-102 hover:bg-purple-50 border-2 border-transparent hover:border-purple-200"
                >
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item?.summary}
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

export default SummaryForm;
