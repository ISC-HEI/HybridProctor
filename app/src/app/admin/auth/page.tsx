'use client'

import Input from "@/components/input";
import style from "./page.module.scss";
import { verify } from "./page.server";
import { LogInIcon } from "lucide-react";

export default function Auth() {
  return (
    <main className={style.page}>
      <form action={verify} className={style.login}>
        <h2 className={style.title}>Login</h2>
        <label className={style.label}>
          Password
          <Input type="password" name="password" />
        </label>
        <button type="submit" className={style.btn}>Login <LogInIcon className={style.icon}/></button>
      </form>
    </main>
  )
}
