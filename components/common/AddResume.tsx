import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { ResumeNameValidationSchema } from "@/lib/validations/resume";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createResume } from "@/lib/actions/resume.actions";
import { toast } from "../ui/use-toast";
import { useRouter } from "next-nprogress-bar";

const AddResume = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ResumeNameValidationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof ResumeNameValidationSchema>
  ) => {
    if (userId === undefined) {
      return;
    }
    
    setIsLoading(true);

    const uuid = uuidv4();

    const result = await createResume({
      resumeId: uuid,
      userId: userId,
      title: values.name,
    });

    

    if (result.success) {
      form.reset();

      const resume = JSON.parse(result.data!);

      router.push(`/my-resume/${resume.resumeId}/edit`);
    } else {
      setIsLoading(false);

      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  return (
    <>
      <div
        className="aspect-[3/4] rounded-xl border-2 border-dashed border-purple-400/30 flex flex-col items-center justify-center text-purple-300 hover:border-purple-400 hover:text-purple-200 transition-colors cursor-pointer bg-white/5"
        onClick={() => userId && setOpenDialog(true)}
      >
        <Plus className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium">Add New</span>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Enter the title of your resume here. Click create when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="comment-form"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p className="mt-2 mb-3 text-slate-700 font-semibold">
                        Resume Title:
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Example: Android Developer Resume"
                        className="no-focus"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-10 flex justify-end gap-5">
                <button
                  type="button"
                  onClick={() => setOpenDialog(false)}
                  className="btn-ghost"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Creating
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddResume;