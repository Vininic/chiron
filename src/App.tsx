import { Component, useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ChironProvider } from "@/lib/study/store";
import { useI18n, type Locale } from "@/lib/i18n/I18nProvider";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { pullSuitePrefs, pushSuitePrefs } from "@/lib/prefs";
import AppLayout from "@/components/AppLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Maps from "@/pages/Maps";
import Apostila from "@/pages/Apostila";
import Authoring from "@/pages/Authoring";
import Practice from "@/pages/Practice";
import Review from "@/pages/Review";
import Labs from "@/pages/Labs";
import Aetheris from "@/pages/Aetheris";
import NotFound from "@/pages/NotFound";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return <div style={{ padding: 40, fontFamily: "monospace" }}><h2>Something went wrong</h2><pre style={{ whiteSpace: "pre-wrap", color: "red" }}>{this.state.error.stack ?? this.state.error.message}</pre></div>;
    }
    return this.props.children;
  }
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" replace />;
}

function SyncPrefs() {
  const { isCloud } = useAuth();
  const { setTheme } = useTheme();
  const { setLocale } = useI18n();

  useEffect(() => {
    if (!isCloud) return;
    let cancelled = false;
    void pullSuitePrefs().then((prefs) => {
      if (cancelled) return;
      if (prefs?.theme) setTheme(prefs.theme);
      if (prefs?.locale && (prefs.locale === "pt" || prefs.locale === "en"))
        setLocale(prefs.locale as Locale);
    });
    return () => { cancelled = true; };
  }, [isCloud, setTheme, setLocale]);

  return null;
}

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <SyncPrefs />
              <ChironProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/maps" element={<Maps />} />
                  <Route path="/apostila" element={<Apostila />} />
                  <Route path="/apostila/nova" element={<Authoring />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/review" element={<Review />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/labs/:labId" element={<Labs />} />
                  <Route path="/aetheris" element={<Aetheris />} />
                  {/* Settings became a dialog (suite shell §2.3); the old route stays
                        so bookmarks resolve instead of hitting NotFound. */}
                    <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
                  {/* About became a dialog (suite shell §2.4); the old route stays
                        so bookmarks resolve instead of hitting NotFound. */}
                    <Route path="/about" element={<Navigate to="/dashboard" replace />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              </ChironProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
