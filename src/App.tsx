import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Sobre from "./pages/Sobre";
import MyCourses from "./pages/MyCourses";
import CourseDetail from "./pages/CourseDetail";
import Certificate from "./pages/Certificate";
import Checkout from "./pages/Checkout";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Profile from "./pages/user/Profile";
import Certificates from "./pages/user/Certificates";
import Settings from "./pages/user/Settings";
import ValidateCertificate from "./pages/ValidateCertificate";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminNews from "./pages/admin/News";
import AdminMaterials from "./pages/admin/Materials";
import AdminUsers from "./pages/admin/Users";
import AdminCertificates from "./pages/admin/Certificates";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => {
  console.log("App: rendering");
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <HelmetProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/cursos" element={<Courses />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/cursos/:id" element={<CourseDetail />} />
                  <Route path="/certificados/:id" element={<Certificate />} />
                  <Route path="/checkout/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/privacidade" element={<Privacy />} />
                  <Route path="/termos" element={<Terms />} />
                  <Route path="/meus-cursos" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
                  <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/certificados" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
                  <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/validar-certificado" element={<ValidateCertificate />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminLayout>
                          <Outlet />
                        </AdminLayout>
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="news" element={<AdminNews />} />
                    <Route path="materials" element={<AdminMaterials />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="certificates" element={<AdminCertificates />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </HelmetProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
