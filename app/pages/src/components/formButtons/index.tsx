
import { useContext } from "react";
import style from "./index.module.scss";
import { StepContext } from "@/lib/utils/hooks/stepContext";
import { ChevronLeftIcon, ChevronRightIcon, LoaderCircleIcon } from "lucide-react";

interface FormButtonsProps {
  disabled?: boolean;
  loading: boolean;
}

export default function FormButtons({ disabled, loading }: FormButtonsProps) {
  const stepContext = useContext(StepContext);

  const previous = () => {
    stepContext?.setStep(stepContext.step - 1);
  }

  return (
    <div className={style.container}>
      <button className={style.previous} type="reset" disabled={stepContext!.step === 1} onClick={previous}><ChevronLeftIcon /> Prev</button>
      <button className={`${style.next} ${loading ? style.loading : ""}`} disabled={disabled} type="submit">
        {loading ? <LoaderCircleIcon className={style.icon} /> : <>Next <ChevronRightIcon /></>}
      </button>
    </div>
  )
}
