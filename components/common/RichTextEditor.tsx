"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import QuillEditor with SSR disabled
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const RichTextEditor = ({
  onRichTextEditorChange,
  defaultValue,
}: {
  onRichTextEditorChange: (value: any) => void;
  defaultValue: string;
}) => {
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [3, 4, 5, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ color: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  // Ensure QuillEditor is only rendered when the browser is available
  if (typeof window === "undefined") {
    return null; // Render nothing on the server
  }

  return (
    <QuillEditor
      theme="snow"
      value={value}
      modules={modules}
      onChange={(e: string) => {
        setValue(e);
        onRichTextEditorChange({ target: { name: "workSummary", value: e } });
      }}
      className="mt-2"
      style={{ borderColor: "#E5E7EB" }}
    />
  );
};

export default RichTextEditor;
