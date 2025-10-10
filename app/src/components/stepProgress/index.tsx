
import { useContext } from "react";
import style from "./index.module.scss";
import { StepContext } from "@/lib/utils/hooks/stepContext";
import { CheckIcon } from "lucide-react";
import { StepPair } from "@/lib/types/StepPair";

interface StepSidebarProps {
  className?: string;
  steps: StepPair[];
}

export default function StepProgress({ className, steps }: StepSidebarProps) {
  const stepContext = useContext(StepContext);

  return (
    <aside className={`${style.progress} ${className}`}>
      <ol className={style.list}>
        {
          steps.map((v, i) => {
            const num = i + 1;
            const isActive = stepContext!.step === num;
            const isDone = stepContext!.step > num;

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
