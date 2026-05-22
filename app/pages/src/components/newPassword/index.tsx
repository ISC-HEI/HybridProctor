import type { Signal } from '@preact/signals';
import style from './index.module.scss';

interface NewPasswordProps {
  password: Signal<string|undefined>;
}

export default function NewPassword({ password }: NewPasswordProps) {
  const next = async () => {
    await fetch("/api/auth/password", {
      method: "PATCH"
    });

    navigation.navigate("/");
  }

  return (
    <main className={style.newPassword}>
      <h1>A new password has been randomly generated</h1>
      <p>Please note it somewhere safe/remember it : <span className={style.password}>{password}</span></p>
      <button className={style.next} onClick={next}>Continue</button>
    </main>
  )
}
