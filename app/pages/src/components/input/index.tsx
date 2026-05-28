import type { Signal } from '@preact/signals';
import style from './index.module.scss';
import type { TargetedInputEvent } from 'preact';

interface InputProps {
  id?: string;
  required?: boolean;
  placeholder?: string;
  type?: "text"|"password";
  area?: boolean;
  className?: string;
  name?: string;
  value?: Signal|undefined;
  onInput?: ((evt: TargetedInputEvent<HTMLInputElement|HTMLTextAreaElement>) => void)|(() => void);
}

export default function Input({ id, required, placeholder, type, area, className, name, value, onInput }: InputProps) {
  return (
    <>
      { area ?
        <textarea id={id} required={required} placeholder={placeholder} className={`${style.input} ${className}`} name={name} value={value} onInput={onInput}></textarea>
        :
        <input id={id} required={required} placeholder={placeholder} type={type} className={`${style.input} ${className}`} name={name} value={value} onInput={onInput}/>
      }
    </>
  )
}
