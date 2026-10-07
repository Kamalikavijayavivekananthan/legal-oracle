import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import DashboardHome from "./pages/DashboardHome";
import UploadPage from "./pages/UploadPage";
import ResultsList from "./pages/ResultsList";
import ContradictionDetails from "./pages/ContradictionDetails";
import LoginPage from "./pages/LoginPage";
import Reports from "./pages/Reports";
import SavedReports from "./pages/SavedReports";
import RiskOverview from "./pages/RiskOverview";
import ClauseExplorer from "./pages/ClauseExplorer";
import SettingsPage from "./pages/SettingsPage";
import { UserProvider, useUser } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { getUserData, setUserData } from "./utils/userStorage";

function AppContent() {
  const { user, userKey, logout } = useUser();
  const [globalResults, setGlobalResults] = useState(() => {
    return userKey ? getUserData(userKey, "results", null) : null;
  });

  // Whenever the active user changes, immediately load their isolated results
  useEffect(() => {
    if (userKey) {
      const userSpecificResults = getUserData(userKey, "results", null);
      setGlobalResults(userSpecificResults);
    } else {
      setGlobalResults(null);
    }
  }, [userKey]);

  // Listen to cross-component data updates for active user
  useEffect(() => {
    const handleDataChanged = (e) => {
      if (e.detail?.userKey === userKey && e.detail?.itemKey === "results") {
        setGlobalResults(e.detail.value);
      }
    };
    window.addEventListener("legaloracle_user_data_changed", handleDataChanged);
    return () => window.removeEventListener("legaloracle_user_data_changed", handleDataChanged);
  }, [userKey]);

  const handleAddResults = (newResults) => {
    if (!userKey) return;
    setGlobalResults((prev) => {
      let updated;
      if (!prev) {
        updated = newResults;
      } else {
        updated = {
          total_contracts: (prev.total_contracts || 0) + (newResults.total_contracts || 0),
          contradictions_found: (prev.contradictions_found || 0) + (newResults.contradictions_found || 0),
          results: [...(newResults.results || []), ...(prev.results || [])]
        };
      }
      setUserData(userKey, "results", updated);
      return updated;
    });
  };

  const handleLogout = () => {
    logout();
    setGlobalResults(null);
  };

  const isLoggedIn = !!user;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={isLoggedIn ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
          <Route index element={<DashboardHome globalResults={globalResults} />} />
          <Route path="upload" element={<UploadPage setGlobalResults={handleAddResults} />} />
          <Route path="results" element={<ResultsList globalResults={globalResults} />} />
          <Route path="results/:id" element={<ContradictionDetails globalResults={globalResults} />} />
          <Route path="reports" element={<Reports />} />
          <Route path="saved" element={<SavedReports />} />
          <Route path="risk" element={<RiskOverview globalResults={globalResults} />} />
          <Route path="explorer" element={<ClauseExplorer globalResults={globalResults} />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
