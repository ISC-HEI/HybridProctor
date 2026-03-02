'use client'

import { createContext } from "react";

export interface StepContextPayload {
  step: number;
  setStep: (step: number) => void;
  total: number;
}

export const StepContext = createContext<StepContextPayload|null>(null);
