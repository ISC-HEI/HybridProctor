import { Student } from "@/lib/types/student";

import style from "./index.module.scss";
import dayjs from "dayjs";

interface StudentsTableProps {
  students: Map<string, Student>;
}

export default function StudentsTable({ students }: StudentsTableProps) {
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

  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th>IP</th>
          <th>Name</th>
          <th>Since</th>
          <th>Finished</th>
          <th>Connected</th>
        </tr>
      </thead>
      <tbody>
        {
          Array.from(students.values()).map(
            (student, idx) =>
              <tr key={idx}>
                <td>{student.ip}</td>
                <td>{student.name}</td>
                <td>{dayjs(student.since * 1000).format("HH:mm:ss").replace(":", "h")}</td>
                <td><span className={`${style.indicator} ${student.finished ? style.on : style.off} ${style.clickable}`} onClick={() => releaseStudent(student)}></span></td>
                <td><span className={`${style.indicator} ${student.connected ? style.on : style.off}`}></span></td>
              </tr>
          )
        }
      </tbody>
    </table>
  )
}
