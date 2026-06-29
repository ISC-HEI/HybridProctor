import { type Student } from "@srvtypes/student";

import style from "./index.module.scss";
import dayjs from "dayjs";
import { useSignal, useSignalEffect, type Signal } from "@preact/signals";
import type { Yamlconf } from "@srvtypes/yamlconf";

interface StudentsTableProps {
  students: Signal<Map<string, Student>>;
}

export default function StudentsTable({ students }: StudentsTableProps) {
  const yamlconf = useSignal<Yamlconf>();
  const showHidden = useSignal<boolean>(false);

  useSignalEffect(() => {
    (async () => {
      yamlconf.value = await (await fetch("/api/fetch/config")).json();
    })();
  });

  const canFinish = () => {
    console.log(yamlconf.value)
    return yamlconf.value && ( yamlconf.value.validation || !yamlconf.value.enable )
  }

  const releaseStudent = (student: Student) => {
    fetch("/api/status", {
      method: "POST",
      body: JSON.stringify({
        student
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }); 
  }

  const hideStudent = (student: Student) => {
    fetch("/api/hide", {
      method: "POST",
      body: JSON.stringify({
        student
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  return (
    <table id="student_table" className={style.table}>
      <thead>
        <tr>
          <th>IP</th>
          <th>Name</th>
          <th>Since</th>
          <th>{canFinish() ? "Finished" : "Sent files"}</th>
          <th>Connected</th>
          <th>Has internet</th>
          <th><button className={style.hide_btn} onClick={() => showHidden.value = !showHidden.value}>{showHidden.value ? "Hide" : "Show"} hidden</button></th>
        </tr>
      </thead>
      <tbody id="table_body">
        {
          Array.from(students.value.values()).map(
            (student, idx) => (
              <tr className={`${student.hidden ? style.hidden : ""} ${!showHidden.value && student.hidden ? style.hide : ""}`} key={idx}>
                <td>{student.ip}</td>
                <td>{student.name}</td>
                <td>{dayjs(student.since * 1000).format("HH:mm:ss").replace(":", "h")}</td>
                <td>
                  <span
                    className={`${style.indicator} ${(canFinish() ? student.finished : student.sent) ? style.on : style.off} ${canFinish() ? style.clickable : ""}`}
                    onClick={() => canFinish() ? releaseStudent(student) : null}
                  >{canFinish() ? student.finished : student.sent}</span>
                </td>
                <td><span className={`${style.indicator} ${student.connected ? style.on : style.off}`}></span></td>
                <td><span className={`${style.indicator} ${student.hasInternet ? style.on : style.off}`}></span></td>
                <td><button className={style.hide_btn} onClick={() => hideStudent(student)}>{student.hidden ? "Show" : "Hide"}</button></td>
              </tr>
            )
          )
        }
      </tbody>
    </table>
  )
}
