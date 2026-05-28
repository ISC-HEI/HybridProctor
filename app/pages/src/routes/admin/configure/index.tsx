
'use client'

import ExamForm from "@/components/configureForms/examForm"

import style from "./index.module.scss";
import StepProgress from "@/components/stepProgress";
import ConfigForm from "@/components/configureForms/configForm";
import ResourcesForm from "@components/configureForms/resourcesForm";
import Goto from "@/components/goto";
import { currentStep, STEPS } from "@/lib/utils/signals/configure";
import { SquareActivityIcon } from "lucide-preact";

const STEP_COMPONENTS = [ExamForm, ConfigForm, ResourcesForm];

export default function Configure() {
  const StepComponent = STEP_COMPONENTS[currentStep.value - 1];

  return (
    <main className={style.page}>
      <Goto href="/admin/monitor" Icon={SquareActivityIcon} />
      <StepComponent />
      <StepProgress className={style.progress} steps={STEPS}/>
    </main>
  )
}
