"use client";
 
import Link from "next/link";
import React, { useState } from "react";
import { FileText, Loader2, MoreVertical } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deleteResume } from "@/lib/actions/resume.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ResumeCard = ({
  resume,
  refreshResumes,
}: {
  resume: any;
  refreshResumes: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle loading state
  if (!resume) {
    return (
      <div className="aspect-[3/4] bg-white/5 rounded-xl p-4 group">
        <div className="h-3/4 bg-white/10 rounded-lg mb-3 flex items-center justify-center animate-pulse">
          <FileText className="h-8 w-8 text-purple-400/50" />
        </div>
        <div className="h-6 bg-white/10 rounded-md mb-2 animate-pulse" />
        <div className="h-4 bg-white/10 rounded-md w-2/3 animate-pulse" />
      </div>
    );
  }

  const myResume = JSON.parse(resume);

  const updatedAtDate = new Date(resume.updatedAt);
  const currentTime = new Date(); // Current time

  const timeDifferenceMs = currentTime - updatedAtDate;

  const differenceInDays = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));

  const onDelete = async () => {
    setIsLoading(true);
    const result = await deleteResume(myResume.resumeId, pathname);
    setIsLoading(false);
    setOpenAlert(false);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Resume deleted successfully.",
        className: "bg-white",
      });
      refreshResumes();
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  return (
    <div className="relative">
      <div className="aspect-[3/4] bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors group">
        <Link
          href={`/my-resume/${myResume.resumeId}/view`}
          className="block h-3/4 mb-3"
        >
          <div 
            className="h-full bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/15 transition-colors"
            style={{
              borderTop: `4px solid ${myResume?.themeColor}`,
            }}
          >
            <FileText className="h-8 w-8 text-purple-200" />
          </div>
        </Link>
        
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-white font-medium truncate">
              {myResume.title}
            </h3>
            <p className="text-sm text-purple-200">
            Updated {isNaN(differenceInDays) || differenceInDays === 0 ? "today" : `${differenceInDays} days ago`}
          </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="mt-1">
              <MoreVertical className="h-4 w-4 text-purple-300 hover:text-purple-200" />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => router.push(`/my-resume/${myResume.resumeId}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/my-resume/${myResume.resumeId}/view`)}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setOpenAlert(true)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume and remove your data from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenAlert(false)}
              disabled={isLoading}
              className="no-focus"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete} 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Deleting
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResumeCard;