import { ErrorBoundary, lazy, LocationProvider, Route, Router } from 'preact-iso'

const ExamPage = lazy(() => import("./routes/index.tsx"));
const PasswordPage = lazy(() => import("./routes/password"));
const AuthPage = lazy(() => import("./routes/admin/auth"));
const MonitorPage = lazy(() => import("./routes/admin/monitor"));
const ExplorerPage = lazy(() => import("./routes/admin/explorer"));
const ConfigurePage = lazy(() => import("./routes/admin/configure"));
const NotFound = lazy(() => import("./404.tsx"));

export function App() {
  return (
    <>
      <LocationProvider>
        <ErrorBoundary onError={e => console.log(e)}>
          <Router>
            <Route path="/" component={ExamPage} />
            <Route path="/password" component={PasswordPage} />
            <Route path="/admin/auth" component={AuthPage} />
            <Route path="/admin/monitor" component={MonitorPage} />
            <Route path="/admin/explorer/:directory*" component={ExplorerPage} />
            <Route path="/admin/configure" component={ConfigurePage} />

            <Route default component={NotFound} />
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </>
  )
}
