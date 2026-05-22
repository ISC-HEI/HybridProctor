
import Input from "@/components/input";
import style from "./page.module.scss";
import { LogInIcon } from "lucide-preact";
import dayjs from "dayjs";

import { useSignal } from "@preact/signals";

export default function Auth() {
  const password = useSignal<string>("");

  const handleVerify = async (evt: Event) => {
    evt.preventDefault();

    const { redirect } = await (await (fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({
        password,
        timestamp: dayjs().toISOString()
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }))).json();

    navigation.navigate(redirect)
  }

  return (
    <main className={style.page}>
      <form onSubmit={handleVerify} className={style.login}>
        <h2 className={style.title}>Login</h2>
        <label className={style.label}>
          Password
          <Input type="password" name="password" value={password} onInput={evt => password.value = (evt.currentTarget as HTMLInputElement).value} />
        </label>
        <button type="submit" className={style.btn}>Login <LogInIcon className={style.icon}/></button>
      </form>
    </main>
  )
}
