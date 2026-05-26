import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
import LandingPage from './components/landing/LandingPage';
import './styles/globals.css';

export default function App() {
  const [showIDE, setShowIDE] = useState(false);

  if (!showIDE) {
    return <LandingPage onLaunch={() => setShowIDE(true)} />;
  }

  return <AppShell />;
}
