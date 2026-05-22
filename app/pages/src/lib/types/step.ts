
import { type ComponentType, type SVGAttributes } from "preact";

export interface StepPair {
  icon: ComponentType<SVGAttributes<SVGSVGElement>>;
  label: string;
}
