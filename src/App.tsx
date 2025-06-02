import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DemoLimitProvider } from "@/hooks/useDemoLimit";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { EmailVerificationPage } from "@/components/auth/EmailVerificationPage";
import { AuthCallback } from "@/components/auth/AuthCallback";
import Index from "./pages/Index";
import Analyzer from "./pages/Analyzer";
import GSTDashboard from "./pages/GSTDashboard";
import NotFound from "./pages/NotFound";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DemoLimitProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              
              {/* Auth routes - only accessible when not authenticated */}
              <Route
                path="/auth/login"
                element={
                  <AuthGuard requireAuth={false}>
                    <LoginForm />
                  </AuthGuard>
                }
              />
              <Route
                path="/auth/signup"
                element={
                  <AuthGuard requireAuth={false}>
                    <SignupForm />
                  </AuthGuard>
                }
              />
              <Route
                path="/auth/forgot-password"
                element={
                  <AuthGuard requireAuth={false}>
                    <ForgotPasswordForm />
                  </AuthGuard>
                }
              />
              <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
              <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Protected routes - require authentication */}
              <Route
                path="/analyzer"
                element={
                  <AuthGuard requireAuth={true}>
                    <Analyzer />
                  </AuthGuard>
                }
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DemoLimitProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
