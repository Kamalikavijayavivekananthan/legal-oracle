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
  const [globalResults, setGlobalResults] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAddResults = (newResults) => {
    setGlobalResults((prev) => {
      if (!prev) return newResults;
      return {
        total_contracts: prev.total_contracts + newResults.total_contracts,
        contradictions_found: prev.contradictions_found + newResults.contradictions_found,
        results: [...newResults.results, ...(prev.results || [])]
      };
    });
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
              
              {/* Protected Routes */}
              <Route path="/" element={isLoggedIn ? <Layout onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" replace />}>
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
