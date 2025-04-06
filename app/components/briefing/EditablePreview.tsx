"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditablePreviewProps {
  markdown: string;
  onChange?: (markdown: string) => void;
}

export default function EditablePreview({
  markdown,
  onChange,
}: EditablePreviewProps) {
  const [editableMarkdown, setEditableMarkdown] = useState(markdown);
  const [activeTab, setActiveTab] = useState<string>("preview");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditableMarkdown(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Tabs
      defaultValue="preview"
      className="w-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <div className="flex justify-between items-center mb-4">
        <TabsList className="bg-zinc-700">
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
          >
            Edit
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="preview" className="mt-0">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              // Make sure headings are properly styled
              h1: ({ ...props }) => (
                <h1
                  className="text-3xl font-bold mb-5 mt-8 text-white"
                  {...props}
                />
              ),
              h2: ({ ...props }) => (
                <h2
                  className="text-2xl font-bold mb-4 mt-6 text-white border-b border-zinc-700 pb-2"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="text-xl font-bold mb-3 mt-5 text-white"
                  {...props}
                />
              ),
              p: ({ ...props }) => (
                <p className="mb-4 text-zinc-300" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc pl-6 mb-4 text-zinc-300" {...props} />
              ),
              li: ({ ...props }) => <li className="mb-2" {...props} />,
              strong: ({ ...props }) => (
                <strong className="font-bold text-white" {...props} />
              ),
            }}
          >
            {editableMarkdown}
          </ReactMarkdown>
        </div>
      </TabsContent>

      <TabsContent value="edit" className="mt-0">
        <Textarea
          value={editableMarkdown}
          onChange={handleChange}
          className="min-h-[500px] bg-zinc-900 text-zinc-300 font-mono text-sm"
          placeholder="Enter markdown content here..."
        />
        <div className="mt-4">
          <Button
            onClick={() => setActiveTab("preview")}
            className="bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Back to Preview
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
