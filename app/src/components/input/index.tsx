'use client'

import { ChangeEvent } from 'react';
import style from './index.module.scss';

interface InputProps {
  type?: "text"|"password";
  area?: boolean;
  className?: string;
  name?: string;
  value?: string|number|readonly string[]|undefined;
  onChange?: ((evt: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void)|(() => void);
}

export default function Input({ type, area, className, name, value, onChange }: InputProps) {
  return (
    <>
      { area ?
        <textarea className={`${style.input} ${className}`} name={name} value={value} onChange={onChange}></textarea>
        :
        <input type={type} className={`${style.input} ${className}`} name={name} value={value} onChange={onChange}/>
      }
    </>
  )
}
