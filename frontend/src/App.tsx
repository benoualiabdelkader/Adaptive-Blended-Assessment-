import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Reports } from './pages/Reports';
import { Notes } from './pages/Notes';
import { Import } from './pages/Import';
import { Settings } from './pages/Settings';
import { Station01 } from './pages/Station01';
import { Station02 } from './pages/Station02';
import { Station03 } from './pages/Station03';
import { Station04 } from './pages/Station04';
import { Station05 } from './pages/Station05';
import { Station06 } from './pages/Station06';
import { Station07 } from './pages/Station07';
import { Station08 } from './pages/Station08';
import { Station09 } from './pages/Station09';
import { Station10 } from './pages/Station10';
import { Station11 } from './pages/Station11';
import { Station12 } from './pages/Station12';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><Import /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/pipeline/1" element={<ProtectedRoute><Station01 /></ProtectedRoute>} />
        <Route path="/pipeline/2" element={<ProtectedRoute><Station02 /></ProtectedRoute>} />
        <Route path="/pipeline/3" element={<ProtectedRoute><Station03 /></ProtectedRoute>} />
        <Route path="/pipeline/4" element={<ProtectedRoute><Station04 /></ProtectedRoute>} />
        <Route path="/pipeline/5" element={<ProtectedRoute><Station05 /></ProtectedRoute>} />
        <Route path="/pipeline/6" element={<ProtectedRoute><Station06 /></ProtectedRoute>} />
        <Route path="/pipeline/7" element={<ProtectedRoute><Station07 /></ProtectedRoute>} />
        <Route path="/pipeline/8" element={<ProtectedRoute><Station08 /></ProtectedRoute>} />
        <Route path="/pipeline/9" element={<ProtectedRoute><Station09 /></ProtectedRoute>} />
        <Route path="/pipeline/10" element={<ProtectedRoute><Station10 /></ProtectedRoute>} />
        <Route path="/pipeline/11" element={<ProtectedRoute><Station11 /></ProtectedRoute>} />
        <Route path="/pipeline/12" element={<ProtectedRoute><Station12 /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const hasResearchAccess = typeof window !== 'undefined' && sessionStorage.getItem('writelens-research-access') === 'granted';
  return hasResearchAccess ? children : <Navigate to="/login" replace />;
}

export default App;
