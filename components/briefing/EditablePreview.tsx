"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ReactMarkdown from "react-markdown";

interface EditablePreviewProps {
  markdown: string;
  onChange: (newMarkdown: string) => void;
}

export default function EditablePreview({
  markdown,
  onChange,
}: EditablePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(markdown);

  const handleSave = () => {
    onChange(editableContent);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span
            className={`text-sm font-medium ${
              !isEditing ? "text-yellow-400" : "text-zinc-400"
            }`}
          >
            Preview
          </span>
          <Switch
            checked={isEditing}
            onCheckedChange={setIsEditing}
            className="bg-zinc-700 data-[state=checked]:bg-yellow-400"
          />
          <span
            className={`text-sm font-medium ${
              isEditing ? "text-yellow-400" : "text-zinc-400"
            }`}
          >
            Edit
          </span>
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 rounded-lg p-6 overflow-auto max-h-[600px]">
        {isEditing ? (
          <Textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="min-h-[500px] font-mono text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none"
            placeholder="Edit your markdown here..."
          />
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
