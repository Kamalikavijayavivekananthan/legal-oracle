import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
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
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";


function App() {
  const [globalResults, setGlobalResults] = useState(() => {
    try {
      const saved = localStorage.getItem("globalResults");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const handleAddResults = (newResults) => {
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
      try {
        localStorage.setItem("globalResults", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save globalResults to localStorage", err);
      }
      return updated;
    });
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              
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
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
