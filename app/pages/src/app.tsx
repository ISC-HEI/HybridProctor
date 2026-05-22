import { ErrorBoundary, lazy, LocationProvider, Route, Router } from 'preact-iso'

const ExamPage = lazy(() => import("./routes/index.tsx"));
const PasswordPage = lazy(() => import("./routes/password"))
const NotFound = lazy(() => import("./404.tsx"))

export function App() {
  return (
    <>
      <LocationProvider>
        <ErrorBoundary onError={e => console.log(e)}>
          <Router>
            <Route path="/" component={ExamPage} />
            <Route path="/password" component={PasswordPage} />

            <Route default component={NotFound} />
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </>
  )
}
