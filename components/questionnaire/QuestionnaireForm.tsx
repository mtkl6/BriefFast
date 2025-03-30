"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getQuestionsForStep,
  shouldShowQuestion,
} from "@/lib/data/questionnaire";
import type { Questionnaire } from "@/lib/data/questionnaire";
import QuestionRenderer from "./QuestionRenderer";
import StepIndicator from "./StepIndicator";
import { Button } from "@/components/ui/button";

interface QuestionnaireFormProps {
  questionnaire: Questionnaire;
  templateId: string;
}

export default function QuestionnaireForm({
  questionnaire,
  templateId,
}: QuestionnaireFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the total number of steps
  const totalSteps = questionnaire.steps.length;

  // Get the current step data
  const currentStepData = questionnaire.steps.find(
    (step) => step.id === currentStep
  );

  // Get questions for the current step
  const questions = getQuestionsForStep(questionnaire, currentStep).filter(
    (question) => shouldShowQuestion(question, answers)
  );

  // Load saved answers from localStorage on initial load
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`brief_${templateId}_answers`);
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error("Failed to parse saved answers:", error);
      }
    }
  }, [templateId]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(
        `brief_${templateId}_answers`,
        JSON.stringify(answers)
      );
    }
  }, [answers, templateId]);

  // Handle answer changes
  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear error for this question if it exists
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // Validate the current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const question of questions) {
      if (question.validation) {
        for (const rule of question.validation) {
          const value = answers[question.id];

          if (
            rule.type === "required" &&
            (value === undefined || value === null || value === "")
          ) {
            newErrors[question.id] = rule.message;
            break;
          }

          if (value !== undefined && value !== null && value !== "") {
            if (
              rule.type === "minLength" &&
              typeof value === "string" &&
              typeof rule.value === "number" &&
              value.length < rule.value
            ) {
              newErrors[question.id] = rule.message;
              break;
            }

            if (
              rule.type === "maxLength" &&
              typeof value === "string" &&
              typeof rule.value === "number" &&
              value.length > rule.value
            ) {
              newErrors[question.id] = rule.message;
              break;
            }

            if (
              rule.type === "email" &&
              typeof value === "string" &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
              newErrors[question.id] = rule.message;
              break;
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true);

      try {
        // In a real app, you would send the data to your API here
        // For now, we'll just simulate a successful submission
        console.log("Form submitted with answers:", answers);

        // Save the final answers to localStorage
        localStorage.setItem(
          `brief_${templateId}_final`,
          JSON.stringify(answers)
        );

        // Redirect to the preview page
        router.push(`/briefgen/${templateId}/preview`);
      } catch (error) {
        console.error("Error submitting form:", error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={questionnaire.steps}
      />

      {/* Step Title and Description */}
      {currentStepData && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-white">
            {currentStepData.title}
          </h2>
          {currentStepData.description && (
            <p className="text-zinc-400">{currentStepData.description}</p>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((question) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => handleAnswerChange(question.id, value)}
            error={errors[question.id]}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Button
          variant="ghost"
          className="text-yellow-400 hover:text-yellow-500 hover:bg-zinc-700"
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSubmitting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
          >
            <title>Previous step arrow</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
            >
              <title>Next step arrow</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        ) : (
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <span className="mr-2">⚡</span> Generate Brief
          </Button>
        )}
      </div>
    </div>
  );
}
