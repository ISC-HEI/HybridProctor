
import type { StepPair } from "@/lib/types/step";
import { signal } from "@preact/signals";
import { BookCheckIcon, CogIcon, FolderPlusIcon } from "lucide-preact";

export const STEPS: StepPair[] = [
  { icon: BookCheckIcon, label: "Exam" },
  { icon: CogIcon, label: "Config" },
  { icon: FolderPlusIcon, label: "Resources" },
] as const;

export const currentStep = signal(1);
export const totalSteps = STEPS.length;

export const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
}

export const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}
