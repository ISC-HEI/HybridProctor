import { ErrorBoundary, lazy, LocationProvider, Route, Router } from 'preact-iso'

const Exam = lazy(() => import("./routes/exam.tsx"));
const NotFound = lazy(() => import("./404.tsx"))

export function App() {
  return (
    <>
      <LocationProvider>
        <ErrorBoundary>
          <Router>
            <Route path='/' component={Exam}/>

            <Route default component={NotFound}/>
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </>
  )
}
