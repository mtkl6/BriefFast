interface EditablePreviewProps {
  markdown: string;
  onChange: (newMarkdown: string) => void;
  isEditing: boolean;
}

export default function EditablePreview({
  markdown,
  onChange,
  isEditing,
}: EditablePreviewProps) {
  return (
    <div className="prose prose-invert max-w-none">
      {isEditing ? (
        <textarea
          value={markdown}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[600px] bg-zinc-900 text-white p-4 rounded-lg border border-zinc-700 focus:outline-none focus:border-yellow-400"
        />
      ) : (
        <div
          className="markdown-preview"
          dangerouslySetInnerHTML={{ __html: markdown }}
        />
      )}
    </div>
  );
}
