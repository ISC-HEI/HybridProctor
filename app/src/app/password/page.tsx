'use client'

import NewPassword from "@/components/newPassword";
import { useEffect, useState } from "react";
import { fetchNewPassword } from "./page.server";

export default function Password() {
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    (async () => {
      const pwd = await fetchNewPassword()
      console.log(pwd);
      setPassword(await fetchNewPassword());

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
