'use client'

import { useRouter } from 'next/navigation';
import style from './index.module.scss';
import { undefinePassword } from './index.server';

interface NewPasswordProps {
  password: string;
}

export default function NewPassword({ password }: NewPasswordProps) {
  const router = useRouter();

  const next = async () => {
    await undefinePassword();
    router.refresh();
  }

  return (
    <main className={style.newPassword}>
      <h1>A new password has been randomly generated</h1>
      <p>Please note it somewhere safe/remember it : <span className={style.password}>{password}</span></p>
      <button className={style.next} onClick={next}>Continue</button>
    </main>
  )
}
