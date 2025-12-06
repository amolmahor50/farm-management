import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import ProtectedRoute from "@/routes/ProtectedRoute";
import AuthLayout from "@/view/auth/AuthLayout";
import { MainLayout } from "@/view/layout/MainLayout";

import { Dashboard } from "@/pages/dashboard/Dashboard";
import { Expense } from "@/pages/expenses/Expense";
import { Alerts } from "@/pages/alerts/Alerts";
import { Reports } from "@/pages/reports/Reports";
import { Yield } from "@/pages/yield/Yield";
import { Loans } from "@/pages/loans/Loans";
import { MarketPrices } from "@/pages/markets/MarketPrices";
import { Tasks } from "@/pages/tasks/Tasks";
import { CommunityForum } from "@/pages/communityforum/CommunityForum";
import { KnowledgeHub } from "@/pages/knowledgehub/KnowledgeHub";
import { ExpertConsultation } from "@/pages/experts/ExpertConsultation";
import { Insurance } from "@/pages/insurance/Insurance";
import { CropRotation } from "@/pages/crop-rotation/CropRotation";
import { Weather } from "@/pages/weather/Weather";
import { AIInsights } from "@/pages/ai-insights/AIInsights";
import { Loading } from "@/components/Loading";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return (
    <Routes>
      {/* ---------- CONDITIONAL ROOT ---------- */}
      {!user?.name || !user?.isActive || !user?.subscription?.isActive ? (
        // User not logged in → show login/auth layout
        <Route path="/*" element={<AuthLayout />} />
      ) : (
        // User logged in → show protected routes
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="expenses" element={<Expense />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="loans" element={<Loans />} />
          <Route path="yields" element={<Yield />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="market" element={<MarketPrices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="community" element={<CommunityForum />} />
          <Route path="knowledge" element={<KnowledgeHub />} />
          <Route path="consultation" element={<ExpertConsultation />} />
          <Route path="insurance" element={<Insurance />} />
          <Route path="rotation" element={<CropRotation />} />
          <Route path="weather" element={<Weather />} />
          <Route path="ai-insights" element={<AIInsights />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
