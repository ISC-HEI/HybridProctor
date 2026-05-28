import NewPassword from "@/components/newPassword";
import { useSignal } from "@preact/signals";
import { useEffect } from "react";

export default function Password() {
  const password = useSignal<string>();

  useEffect(() => {
    (async () => {
      password.value = await (await fetch("/api/fetch/newpassword")).text();
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
