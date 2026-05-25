
import style from "./index.module.scss";
import { ChevronLeftIcon, ChevronRightIcon, LoaderCircleIcon } from "lucide-preact";
import { type Signal } from "@preact/signals";
import { currentStep, prevStep } from "@/lib/utils/signals/configure";


interface FormButtonsProps {
  disabled?: Signal<boolean>|boolean;
  loading: Signal<boolean>;
}

export default function FormButtons({ disabled, loading }: FormButtonsProps) {
  return (
    <div className={style.container}>
      <button className={style.previous} type="reset" disabled={currentStep.value === 1} onClick={prevStep}><ChevronLeftIcon /> Prev</button>
      <button className={`${style.next} ${loading.value ? style.loading : ""}`} disabled={disabled} type="submit">
        {loading.value ? <LoaderCircleIcon className={style.icon} /> : <>Next <ChevronRightIcon /></>}
      </button>
    </div>
  )
}
