
'use client'

import ExamForm from "@/components/configureForms/examForm"

import style from "./page.module.scss";
import { StepContext, StepContextPayload } from "@/lib/utils/hooks/stepContext";
import { useMemo, useState } from "react";
import StepProgress from "@/components/stepProgress";
import { StepPair } from "@/lib/types/StepPair";
import { BookCheckIcon, CogIcon, FolderPlusIcon, SquareActivityIcon } from "lucide-react";
import ConfigForm from "@/components/configureForms/configForm";
import ResourcesForm from "@components/configureForms/resourcesForm";
import Goto from "@/components/goto";

const STEPS: StepPair[] = [
  { icon: BookCheckIcon, label: "Exam" },
  { icon: CogIcon, label: "Config" },
  { icon: FolderPlusIcon, label: "Resources" },
];

export default function Configure() {
  const [step, setStep] = useState<number>(1);

  const stepContextValue = useMemo<StepContextPayload>(() => ({
    step,
    setStep,
    total: STEPS.length,
  }), [step, setStep]);
  
  const renderStep = () => {
    switch (step) {
      case 1: return <ExamForm />;
      case 2: return <ConfigForm />;
      case 3: return <ResourcesForm />;
    }
  }

  return (
    <main className={style.page}>
      <Goto href="/admin/monitor" Icon={SquareActivityIcon} />
      <StepContext.Provider value={stepContextValue}>
        {
          renderStep()
        }
        <StepProgress className={style.progress} steps={STEPS}/>
      </StepContext.Provider>
    </main>
  )
}
