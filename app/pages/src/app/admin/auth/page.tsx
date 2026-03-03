'use client'

import Input from "@/components/input";
import style from "./page.module.scss";
import { LogInIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import dayjs from "dayjs";

export default function Auth() {
  const [password, setPassword] = useState<string>("");

  const handleVerify = (evt: FormEvent) => {
    evt.preventDefault();

    fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({
        password,
        timestamp: dayjs().toISOString()
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  return (
    <main className={style.page}>
      <form onSubmit={handleVerify} className={style.login}>
        <h2 className={style.title}>Login</h2>
        <label className={style.label}>
          Password
          <Input type="password" name="password" value={password} onChange={(evt) => setPassword(evt.target.value)} />
        </label>
        <button type="submit" className={style.btn}>Login <LogInIcon className={style.icon}/></button>
      </form>
    </main>
  )
}
