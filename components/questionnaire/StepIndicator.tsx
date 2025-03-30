"use client";

import type { Step } from "@/lib/data/questionnaire";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="w-full bg-zinc-700 h-2 rounded-full mb-6">
        <div
          className="bg-yellow-400 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Circles */}
      <div className="flex justify-between mb-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
              step.id < currentStep
                ? "text-yellow-400"
                : step.id === currentStep
                ? "text-white"
                : "text-zinc-500"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${
                step.id < currentStep
                  ? "bg-yellow-400 text-black"
                  : step.id === currentStep
                  ? "bg-zinc-700 border-2 border-yellow-400 text-white"
                  : "bg-zinc-700 text-zinc-500"
              }`}
            >
              {step.id}
            </div>
            <span className="text-xs hidden md:block">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Step Info */}
      <div className="flex justify-between items-center px-1 py-2 text-sm text-zinc-400 border-t border-zinc-700">
        <div className="font-medium">
          Step <span className="text-yellow-400">{currentStep}</span> of{" "}
          <span className="text-white">{totalSteps}</span>
        </div>
        <div className="font-medium">
          <span className="text-yellow-400">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>{" "}
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
}
