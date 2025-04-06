"use client";

import type { ChangeEvent } from "react";
import type { Question } from "@/lib/data/questionnaire";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionRendererProps {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  error,
}: QuestionRendererProps) {
  // Add debug info and error handling
  const renderQuestionInput = () => {
    try {
      switch (question.type) {
        case "text":
        case "email":
        case "number":
          return (
            <Input
              type={question.type}
              id={question.id}
              placeholder={question.placeholder}
              value={(value as string) || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
              className="bg-zinc-700 border-zinc-600 text-white"
            />
          );

        case "textarea":
          return (
            <Textarea
              id={question.id}
              placeholder={question.placeholder}
              value={(value as string) || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                onChange(e.target.value)
              }
              className="bg-zinc-700 border-zinc-600 text-white min-h-[120px]"
            />
          );

        case "date":
          return (
            <Input
              type="date"
              id={question.id}
              value={(value as string) || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
              className="bg-zinc-700 border-zinc-600 text-white"
            />
          );

        case "select":
          return (
            <select
              id={question.id}
              value={(value as string) || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onChange(e.target.value)
              }
              className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2"
            >
              <option value="">Select an option</option>
              {question.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case "multiselect":
          return (
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <Checkbox
                    id={`${question.id}-${option.value}`}
                    checked={
                      Array.isArray(value) && value.includes(option.value)
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange(
                          Array.isArray(value)
                            ? [...value, option.value]
                            : [option.value]
                        );
                      } else {
                        onChange(
                          Array.isArray(value)
                            ? value.filter((v) => v !== option.value)
                            : []
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <Label
                    htmlFor={`${question.id}-${option.value}`}
                    className="text-zinc-300"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          );

        case "radio":
          return (
            <RadioGroup
              value={(value as string) || ""}
              onValueChange={onChange}
              className="space-y-2"
            >
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <RadioGroupItem
                    id={`${question.id}-${option.value}`}
                    value={option.value}
                    className="mr-2"
                  />
                  <Label
                    htmlFor={`${question.id}-${option.value}`}
                    className="text-zinc-300"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          );

        case "checkbox":
          return (
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <Checkbox
                    id={`${question.id}-${option.value}`}
                    checked={
                      Array.isArray(value) && value.includes(option.value)
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange(
                          Array.isArray(value)
                            ? [...value, option.value]
                            : [option.value]
                        );
                      } else {
                        onChange(
                          Array.isArray(value)
                            ? value.filter((v) => v !== option.value)
                            : []
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <Label
                    htmlFor={`${question.id}-${option.value}`}
                    className="text-zinc-300"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          );

        default:
          console.warn(
            `Unsupported question type: ${question.type} for question ID: ${question.id}`
          );
          return (
            <div className="p-3 bg-red-900/30 border border-red-600 rounded-md">
              <p>Unsupported question type: {question.type}</p>
              <p className="text-xs mt-1 text-zinc-400">
                Question ID: {question.id}
              </p>
            </div>
          );
      }
    } catch (err) {
      console.error(`Error rendering question ${question.id}:`, err);
      return (
        <div className="p-3 bg-red-900/30 border border-red-600 rounded-md">
          <p>Error rendering question</p>
          <p className="text-xs mt-1 text-zinc-400">
            Please try refreshing the page
          </p>
        </div>
      );
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-2">
        <label
          htmlFor={question.id}
          className="block text-white font-medium mb-1"
        >
          {question.label}
        </label>
        {question.helpText && (
          <p className="text-zinc-400 text-sm mb-2">{question.helpText}</p>
        )}
      </div>

      {renderQuestionInput()}

      {error && <p className="mt-1 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
