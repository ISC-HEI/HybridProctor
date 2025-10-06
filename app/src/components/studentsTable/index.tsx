import { Student } from "@/lib/types/student";

import style from "./index.module.scss";

interface StudentsTableProps {
  students: Map<string, Student>;
}

export default function StudentsTable({ students }: StudentsTableProps) {


  return (
    <table className={style.table}>
      <thead>
        <tr>
          <th>IP</th>
          <th>Name</th>
          <th>Files</th>
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
                <td><span className={`${style.indicator} ${student.allFilesSent ? style.on : style.off}`}></span></td>
                <td><span className={`${style.indicator} ${student.connected ? style.on : style.off}`}></span></td>
              </tr>
          )
        }
      </tbody>
    </table>
  )
}
