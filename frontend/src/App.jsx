import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PipelineLayout from './layouts/PipelineLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Reports from './pages/Reports';
import Import from './pages/Import';
import Settings from './pages/Settings';
import { initializeDB } from './store/db';
import { seedService } from './services/seedService';

let initPromise = null;

function App() {
  useEffect(() => {
    if (initPromise) {
      return;
    }

    initPromise = initializeDB().then(async (success) => {
      if (success) {
        console.log("WriteLens IndexedDB initialized successfully.");
        await seedService.checkAndSeed();
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pipeline" element={<PipelineLayout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/import" element={<Import />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/pipeline" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
