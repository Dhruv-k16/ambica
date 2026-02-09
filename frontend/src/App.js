import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ShowcasePage from '@/pages/ShowcasePage';
import ContactPage from '@/pages/ContactPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ManageEvents from '@/pages/admin/ManageEvents';
import ManageServices from '@/pages/admin/ManageServices';
import ViewEnquiries from '@/pages/admin/ViewEnquiries';
import EditContent from '@/pages/admin/EditContent';
import ProtectedRoute from '@/components/ProtectedRoute';
import '@/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute><ManageServices /></ProtectedRoute>} />
          <Route path="/admin/enquiries" element={<ProtectedRoute><ViewEnquiries /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><EditContent /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;