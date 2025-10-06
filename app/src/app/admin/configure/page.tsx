
import ExamInput from "@/components/examInput"
import { uploadExam } from "./page.server"

export default function Configure() {

  return (
    <main>
      <form action={uploadExam}>
        <ExamInput />
        <button type="submit">submit</button>
      </form>
    </main>
  )
}
