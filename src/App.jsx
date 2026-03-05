import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReportEditor from './pages/ReportEditor';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/report/:reportId" element={<ReportEditor />} />
      </Routes>
    </Router>
  );
}
