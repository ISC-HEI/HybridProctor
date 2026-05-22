import { ErrorBoundary, lazy, LocationProvider, Route, Router } from 'preact-iso'

const ExamPage = lazy(() => import("./routes/index.tsx"));
const NotFound = lazy(() => import("./404.tsx"))

export function App() {
  return (
    <>
      <LocationProvider>
        <ErrorBoundary>
          <Router>
            <Route path='/' component={ExamPage}/>

            <Route default component={NotFound}/>
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </>
  )
}
