'use client'

import NewPassword from "@/components/newPassword";
import { useEffect, useState } from "react";

export default function Password() {
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    (async () => {
      setPassword(await (await fetch("/api/fetch/newpassword")).text());
    })();
  }, []);

  return (
    <main>
      {
        password
          ?
          <NewPassword password={password}/>
          :
          <div></div>
      }
    </main>
  )
}
