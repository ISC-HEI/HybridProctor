
import style from "./index.module.scss";
import { CheckIcon } from "lucide-preact";
import { type StepPair } from "@/lib/types/step";
import { currentStep } from "@/lib/utils/signals/configure";

interface StepSidebarProps {
  className?: string;
  steps: StepPair[];
}

export default function StepProgress({ className, steps }: StepSidebarProps) {
  return (
    <aside className={`${style.progress} ${className}`}>
      <ol className={style.list}>
        {
          steps.map((v, i) => {
            const num = i + 1;
            const isActive = currentStep.value === num;
            const isDone = currentStep.value > num;

            return (
              <li key={i} className={style.step}>
                <div className={`${style.iconContainer} ${isActive ? style.active : isDone ? style.done : style.next}`}>
                  { isActive
                    ? <v.icon className={`${style.icon} ${style.active}`} />
                    : isDone
                      ? <CheckIcon className={`${style.icon} ${style.done}`} />
                      : <v.icon className={`${style.icon} ${style.next}`} />
                  }
                </div>
                {v.label}
              </li>
            )
          })
        }
      </ol>
    </aside>
  )
}
