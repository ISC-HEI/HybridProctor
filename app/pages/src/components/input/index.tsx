'use client'

import { ChangeEvent } from 'react';
import style from './index.module.scss';

interface InputProps {
  required?: boolean;
  placeholder?: string;
  type?: "text"|"password";
  area?: boolean;
  className?: string;
  name?: string;
  value?: string|number|readonly string[]|undefined;
  onChange?: ((evt: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void)|(() => void);
}

export default function Input({ required, placeholder, type, area, className, name, value, onChange }: InputProps) {
  return (
    <>
      { area ?
        <textarea required={required} placeholder={placeholder} className={`${style.input} ${className}`} name={name} value={value} onChange={onChange}></textarea>
        :
        <input required={required} placeholder={placeholder} type={type} className={`${style.input} ${className}`} name={name} value={value} onChange={onChange}/>
      }
    </>
  )
}
